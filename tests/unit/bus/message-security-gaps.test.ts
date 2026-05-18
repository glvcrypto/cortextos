/**
 * Coverage gaps for src/bus/message.ts — security and error paths.
 *
 * The existing message.test.ts covers the happy-path (send → checkInbox → ack)
 * without a signing key, which means the HMAC signing/verification branches, the
 * corrupt-JSON recovery path, stale-inflight recovery, and the ackInbox no-match
 * branch are all zero-coverage.  This suite fills those gaps.
 *
 * Cases:
 *   sendMessage
 *     1. reply_to is set when replyTo arg is provided
 *     2. sig field is present when a signing key exists in ctxRoot/config/bus-signing-key
 *
 *   checkInbox (HMAC)
 *     3. signed message passes verification and is delivered
 *     4. message with a tampered sig is rejected into inbox/.errors/
 *     5. unsigned message when a key exists is accepted with a legacy warning
 *
 *   checkInbox (error recovery)
 *     6. corrupt JSON file is moved to inbox/.errors/ instead of crashing
 *     7. stale inflight file (>5 min) is recovered back to inbox on next checkInbox
 *
 *   ackInbox
 *     8. non-existent messageId is silently ignored (no throw)
 *     9. ack finds the correct message when inflight contains multiple messages
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mkdtempSync, rmSync, writeFileSync, readFileSync,
  readdirSync, existsSync, mkdirSync, utimesSync,
} from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { createHmac } from 'crypto';
import { sendMessage, checkInbox, ackInbox } from '../../../src/bus/message';
import type { BusPaths } from '../../../src/types';

function makePaths(testDir: string, agent: string = 'receiver'): BusPaths {
  return {
    ctxRoot: testDir,
    inbox: join(testDir, 'inbox', agent),
    inflight: join(testDir, 'inflight', agent),
    processed: join(testDir, 'processed', agent),
    logDir: join(testDir, 'logs', agent),
    stateDir: join(testDir, 'state', agent),
    taskDir: join(testDir, 'tasks'),
    approvalDir: join(testDir, 'approvals'),
    analyticsDir: join(testDir, 'analytics'),
    heartbeatDir: join(testDir, 'heartbeats'),
  };
}

function writeSigningKey(testDir: string, key: string): void {
  const configDir = join(testDir, 'config');
  mkdirSync(configDir, { recursive: true });
  writeFileSync(join(configDir, 'bus-signing-key'), key, 'utf-8');
}

function hmacSign(key: string, payload: string): string {
  return createHmac('sha256', key).update(payload).digest('hex');
}

describe('message.ts — security and error-recovery gaps', () => {
  let testDir: string;
  let senderPaths: BusPaths;
  let receiverPaths: BusPaths;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-msg-gaps-'));
    senderPaths = makePaths(testDir, 'sender');
    receiverPaths = makePaths(testDir, 'receiver');
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  // ── sendMessage ──────────────────────────────────────────────────────────

  it('sets reply_to in the JSON payload when replyTo arg is supplied', () => {
    const originalId = '1234-sender-abc';
    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'Re: prior message', originalId);

    const inbox = join(testDir, 'inbox', 'receiver');
    const [file] = readdirSync(inbox).filter(f => f.endsWith('.json'));
    const msg = JSON.parse(readFileSync(join(inbox, file), 'utf-8'));

    expect(msg.reply_to).toBe(originalId);
  });

  it('includes a sig field when the signing key exists in ctxRoot/config/bus-signing-key', () => {
    const key = 'test-signing-key-abc123';
    writeSigningKey(testDir, key);

    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'signed message');

    const inbox = join(testDir, 'inbox', 'receiver');
    const [file] = readdirSync(inbox).filter(f => f.endsWith('.json'));
    const msg = JSON.parse(readFileSync(join(inbox, file), 'utf-8'));

    expect(msg.sig).toBeDefined();
    expect(typeof msg.sig).toBe('string');
    // Verify the sig value is correct: HMAC over "id:from:to:text"
    const expected = hmacSign(key, `${msg.id}:${msg.from}:${msg.to}:${msg.text}`);
    expect(msg.sig).toBe(expected);
  });

  // ── checkInbox — HMAC verification ──────────────────────────────────────

  it('delivers a correctly-signed message when a key is configured', () => {
    const key = 'shared-secret-key-xyz';
    writeSigningKey(testDir, key);

    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'legit message');
    const messages = checkInbox(receiverPaths);

    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('legit message');
  });

  it('rejects a tampered message sig by moving the file into inbox/.errors/', () => {
    const key = 'shared-secret-key-xyz';
    writeSigningKey(testDir, key);

    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'tampered');

    // Tamper the sig in the written file
    const inbox = join(testDir, 'inbox', 'receiver');
    const [file] = readdirSync(inbox).filter(f => f.endsWith('.json'));
    const msgPath = join(inbox, file);
    const msg = JSON.parse(readFileSync(msgPath, 'utf-8'));
    msg.sig = 'deadbeef'.repeat(8); // invalid 64-char hex
    writeFileSync(msgPath, JSON.stringify(msg));

    const messages = checkInbox(receiverPaths);

    expect(messages).toHaveLength(0);
    // File should be in .errors/
    const errDir = join(inbox, '.errors');
    expect(existsSync(errDir)).toBe(true);
    const errFiles = readdirSync(errDir).filter(f => f.endsWith('.json'));
    expect(errFiles).toHaveLength(1);
  });

  it('accepts an unsigned message (legacy) when a signing key exists', () => {
    const key = 'shared-secret-key-xyz';
    writeSigningKey(testDir, key);

    // Write a message without a sig field directly into the inbox
    const inbox = join(testDir, 'inbox', 'receiver');
    mkdirSync(inbox, { recursive: true });
    const msgId = `${Date.now()}-sender-abc12`;
    const filename = `2-${Date.now()}-from-sender-abc12.json`;
    const legacyMsg = {
      id: msgId,
      from: 'sender',
      to: 'receiver',
      priority: 'normal',
      timestamp: new Date().toISOString(),
      text: 'legacy unsigned',
      reply_to: null,
      // No sig field
    };
    writeFileSync(join(inbox, filename), JSON.stringify(legacyMsg));

    const messages = checkInbox(receiverPaths);

    // Legacy messages are accepted even without a sig
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('legacy unsigned');
  });

  // ── checkInbox — error recovery ──────────────────────────────────────────

  it('moves corrupt JSON files to inbox/.errors/ without throwing', () => {
    const inbox = join(testDir, 'inbox', 'receiver');
    mkdirSync(inbox, { recursive: true });
    writeFileSync(join(inbox, '2-12345-from-sender-abc12.json'), 'NOT VALID JSON{{{');

    const messages = checkInbox(receiverPaths);

    expect(messages).toHaveLength(0);
    const errDir = join(inbox, '.errors');
    const errFiles = readdirSync(errDir).filter(f => f.endsWith('.json'));
    expect(errFiles).toHaveLength(1);
  });

  it('recovers a stale inflight file (>5 min old) back to inbox on the next checkInbox', () => {
    // Send and process into inflight
    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'stale message');
    const firstBatch = checkInbox(receiverPaths); // moves to inflight
    expect(firstBatch).toHaveLength(1);

    // Age the inflight file to >300 seconds ago via utimesSync
    const inflight = join(testDir, 'inflight', 'receiver');
    const [inflightFile] = readdirSync(inflight).filter(f => f.endsWith('.json'));
    const staleTime = new Date(Date.now() - 6 * 60 * 1000); // 6 minutes ago
    utimesSync(join(inflight, inflightFile), staleTime, staleTime);

    // Next checkInbox should recover the stale file and re-deliver it
    const secondBatch = checkInbox(receiverPaths);
    expect(secondBatch).toHaveLength(1);
    expect(secondBatch[0].text).toBe('stale message');
  });

  // ── ackInbox ─────────────────────────────────────────────────────────────

  it('silently does nothing when the messageId does not match any inflight file', () => {
    // Ensure inflight has a real message so we know ack looked but found nothing
    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'real message');
    checkInbox(receiverPaths);

    expect(() => ackInbox(receiverPaths, 'non-existent-id-xyz')).not.toThrow();

    // The real message is still in inflight (not moved to processed)
    const inflightFiles = readdirSync(receiverPaths.inflight).filter(f => f.endsWith('.json'));
    expect(inflightFiles).toHaveLength(1);
  });

  it('moves only the matching message when inflight contains multiple messages', () => {
    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'first');
    sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'second');
    const msgs = checkInbox(receiverPaths);
    expect(msgs).toHaveLength(2);

    // Ack only the first
    ackInbox(receiverPaths, msgs[0].id);

    const inflightFiles = readdirSync(receiverPaths.inflight).filter(f => f.endsWith('.json'));
    const processedFiles = readdirSync(receiverPaths.processed).filter(f => f.endsWith('.json'));
    expect(inflightFiles).toHaveLength(1);
    expect(processedFiles).toHaveLength(1);

    // The remaining inflight message is the second one
    const remaining = JSON.parse(readFileSync(join(receiverPaths.inflight, inflightFiles[0]), 'utf-8'));
    expect(remaining.text).toBe('second');
  });
});
