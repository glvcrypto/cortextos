import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readdirSync, readFileSync, writeFileSync, mkdirSync, utimesSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { sendMessage, checkInbox, ackInbox } from '../../../src/bus/message';
import { resolvePaths } from '../../../src/utils/paths';
import type { BusPaths } from '../../../src/types';

describe('Message Bus', () => {
  let testDir: string;
  let senderPaths: BusPaths;
  let receiverPaths: BusPaths;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-bus-test-'));
    // Override ctxRoot to use temp directory
    senderPaths = {
      ctxRoot: testDir,
      inbox: join(testDir, 'inbox', 'sender'),
      inflight: join(testDir, 'inflight', 'sender'),
      processed: join(testDir, 'processed', 'sender'),
      logDir: join(testDir, 'logs', 'sender'),
      stateDir: join(testDir, 'state', 'sender'),
      taskDir: join(testDir, 'tasks'),
      approvalDir: join(testDir, 'approvals'),
      analyticsDir: join(testDir, 'analytics'),
      heartbeatDir: join(testDir, 'heartbeats'),
    };
    receiverPaths = {
      ...senderPaths,
      inbox: join(testDir, 'inbox', 'receiver'),
      inflight: join(testDir, 'inflight', 'receiver'),
      processed: join(testDir, 'processed', 'receiver'),
      logDir: join(testDir, 'logs', 'receiver'),
      stateDir: join(testDir, 'state', 'receiver'),
    };
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('sendMessage', () => {
    it('creates a JSON file in receiver inbox', () => {
      const msgId = sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'Hello');
      expect(msgId).toBeTruthy();

      const receiverInbox = join(testDir, 'inbox', 'receiver');
      const files = readdirSync(receiverInbox).filter(f => f.endsWith('.json'));
      expect(files.length).toBe(1);

      // Verify filename format: {pnum}-{epochMs}-from-{sender}-{rand5}.json
      expect(files[0]).toMatch(/^2-\d+-from-sender-[a-z0-9]{5}\.json$/);
    });

    it('produces JSON matching bash format', () => {
      sendMessage(senderPaths, 'paul', 'boris', 'high', 'Build the page');

      const receiverInbox = join(testDir, 'inbox', 'boris');
      const files = readdirSync(receiverInbox).filter(f => f.endsWith('.json'));
      const content = JSON.parse(readFileSync(join(receiverInbox, files[0]), 'utf-8'));

      // Verify all fields match bash send-message.sh format
      expect(content).toHaveProperty('id');
      expect(content).toHaveProperty('from', 'paul');
      expect(content).toHaveProperty('to', 'boris');
      expect(content).toHaveProperty('priority', 'high');
      expect(content).toHaveProperty('timestamp');
      expect(content).toHaveProperty('text', 'Build the page');
      expect(content).toHaveProperty('reply_to', null);

      // Verify filename has priority 1 (high)
      expect(files[0]).toMatch(/^1-/);
    });

    it('encodes priority correctly in filename', () => {
      sendMessage(senderPaths, 'a', 'b', 'urgent', 'test');
      sendMessage(senderPaths, 'a', 'b', 'high', 'test');
      sendMessage(senderPaths, 'a', 'b', 'normal', 'test');
      sendMessage(senderPaths, 'a', 'b', 'low', 'test');

      const inbox = join(testDir, 'inbox', 'b');
      const files = readdirSync(inbox).filter(f => f.endsWith('.json')).sort();

      expect(files[0]).toMatch(/^0-/); // urgent
      expect(files[1]).toMatch(/^1-/); // high
      expect(files[2]).toMatch(/^2-/); // normal
      expect(files[3]).toMatch(/^3-/); // low
    });

    it('rejects invalid agent names', () => {
      expect(() =>
        sendMessage(senderPaths, '../bad', 'good', 'normal', 'test')
      ).toThrow();
    });

    it('sets reply_to field when replyTo is provided', () => {
      sendMessage(senderPaths, 'alice', 'bob', 'normal', 'reply text', 'original-msg-id');
      const inbox = join(testDir, 'inbox', 'bob');
      const files = readdirSync(inbox).filter(f => f.endsWith('.json'));
      const msg = JSON.parse(readFileSync(join(inbox, files[0]), 'utf-8'));
      expect(msg.reply_to).toBe('original-msg-id');
    });

    it('adds HMAC sig field when bus-signing-key exists', () => {
      const keyPath = join(testDir, 'config', 'bus-signing-key');
      mkdirSync(join(testDir, 'config'), { recursive: true });
      writeFileSync(keyPath, 'test-signing-secret');

      sendMessage(senderPaths, 'alice', 'bob', 'normal', 'signed message');
      const inbox = join(testDir, 'inbox', 'bob');
      const files = readdirSync(inbox).filter(f => f.endsWith('.json'));
      const msg = JSON.parse(readFileSync(join(inbox, files[0]), 'utf-8'));
      expect(msg.sig).toBeTruthy();
      expect(typeof msg.sig).toBe('string');
      expect(msg.sig).toHaveLength(64); // SHA-256 hex = 64 chars
    });

    it('omits sig field when no signing key file', () => {
      sendMessage(senderPaths, 'alice', 'bob', 'normal', 'unsigned message');
      const inbox = join(testDir, 'inbox', 'bob');
      const files = readdirSync(inbox).filter(f => f.endsWith('.json'));
      const msg = JSON.parse(readFileSync(join(inbox, files[0]), 'utf-8'));
      expect(msg.sig).toBeUndefined();
    });
  });

  describe('checkInbox', () => {
    it('returns empty array for empty inbox', () => {
      const messages = checkInbox(receiverPaths);
      expect(messages).toEqual([]);
    });

    it('returns messages sorted by priority', () => {
      sendMessage(senderPaths, 'sender', 'receiver', 'low', 'low priority');
      sendMessage(senderPaths, 'sender', 'receiver', 'urgent', 'urgent');
      sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'normal');

      const messages = checkInbox(receiverPaths);
      expect(messages.length).toBe(3);
      expect(messages[0].priority).toBe('urgent');
      expect(messages[1].priority).toBe('normal');
      expect(messages[2].priority).toBe('low');
    });

    it('moves messages to inflight', () => {
      sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'test');
      checkInbox(receiverPaths);

      const inboxFiles = readdirSync(receiverPaths.inbox).filter(f => f.endsWith('.json'));
      const inflightFiles = readdirSync(receiverPaths.inflight).filter(f => f.endsWith('.json'));

      expect(inboxFiles.length).toBe(0);
      expect(inflightFiles.length).toBe(1);
    });

    it('accepts signed message when HMAC matches', () => {
      const keyPath = join(testDir, 'config', 'bus-signing-key');
      mkdirSync(join(testDir, 'config'), { recursive: true });
      writeFileSync(keyPath, 'shared-secret');

      sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'signed payload');
      const messages = checkInbox(receiverPaths);
      expect(messages).toHaveLength(1);
      expect(messages[0].text).toBe('signed payload');
    });

    it('quarantines tampered message (bad HMAC) to .errors/ and excludes from results', () => {
      // Plant a message with a wrong sig directly into the inbox
      mkdirSync(receiverPaths.inbox, { recursive: true });
      const fakeMsg = {
        id: '1234567890-sender-aaaaa',
        from: 'sender', to: 'receiver', priority: 'normal',
        timestamp: new Date().toISOString(),
        text: 'tampered text',
        reply_to: null,
        sig: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      };
      const keyPath = join(testDir, 'config', 'bus-signing-key');
      mkdirSync(join(testDir, 'config'), { recursive: true });
      writeFileSync(keyPath, 'real-secret');
      writeFileSync(
        join(receiverPaths.inbox, '2-1234567890-from-sender-aaaaa.json'),
        JSON.stringify(fakeMsg),
      );

      const messages = checkInbox(receiverPaths);
      expect(messages).toHaveLength(0); // tampered message excluded

      const errors = readdirSync(join(receiverPaths.inbox, '.errors'));
      expect(errors).toHaveLength(1); // quarantined
    });

    it('accepts unsigned message as legacy when signing key exists', () => {
      // No sig field on message, but signing key is present → accepted with warning
      mkdirSync(receiverPaths.inbox, { recursive: true });
      const legacyMsg = {
        id: '9999999999-sender-bbbbb',
        from: 'sender', to: 'receiver', priority: 'normal',
        timestamp: new Date().toISOString(),
        text: 'legacy unsigned',
        reply_to: null,
        // no sig field
      };
      const keyPath = join(testDir, 'config', 'bus-signing-key');
      mkdirSync(join(testDir, 'config'), { recursive: true });
      writeFileSync(keyPath, 'real-secret');
      writeFileSync(
        join(receiverPaths.inbox, '2-9999999999-from-sender-bbbbb.json'),
        JSON.stringify(legacyMsg),
      );

      const messages = checkInbox(receiverPaths);
      expect(messages).toHaveLength(1);
      expect(messages[0].text).toBe('legacy unsigned');
    });

    it('quarantines corrupt (non-JSON) message files to .errors/', () => {
      mkdirSync(receiverPaths.inbox, { recursive: true });
      writeFileSync(
        join(receiverPaths.inbox, '2-0000000001-from-sender-ccccc.json'),
        '{not valid json',
      );

      const messages = checkInbox(receiverPaths);
      expect(messages).toHaveLength(0);

      const errors = readdirSync(join(receiverPaths.inbox, '.errors'));
      expect(errors).toHaveLength(1);
    });

    it('recovers stale inflight message (>5 min) back to inbox on next check', () => {
      mkdirSync(receiverPaths.inflight, { recursive: true });
      mkdirSync(receiverPaths.inbox, { recursive: true });

      // Plant an old file directly in inflight with mtime >5 min ago
      const staleMsg = {
        id: '0000000000-sender-ddddd',
        from: 'sender', to: 'receiver', priority: 'normal',
        timestamp: new Date().toISOString(),
        text: 'stale inflight',
        reply_to: null,
      };
      const stalePath = join(receiverPaths.inflight, '2-0000000000-from-sender-ddddd.json');
      writeFileSync(stalePath, JSON.stringify(staleMsg));

      // Backdate mtime to 6 minutes ago
      const sixMinAgo = new Date(Date.now() - 6 * 60 * 1000);
      utimesSync(stalePath, sixMinAgo, sixMinAgo);

      const messages = checkInbox(receiverPaths);
      expect(messages).toHaveLength(1);
      expect(messages[0].text).toBe('stale inflight');
    });
  });

  describe('ackInbox', () => {
    it('moves message from inflight to processed', () => {
      const msgId = sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'test');
      checkInbox(receiverPaths); // moves to inflight

      ackInbox(receiverPaths, msgId);

      const inflightFiles = readdirSync(receiverPaths.inflight).filter(f => f.endsWith('.json'));
      const processedFiles = readdirSync(receiverPaths.processed).filter(f => f.endsWith('.json'));

      expect(inflightFiles.length).toBe(0);
      expect(processedFiles.length).toBe(1);
    });

    it('does not throw when message ID is not found in inflight', () => {
      expect(() => ackInbox(receiverPaths, 'nonexistent-id')).not.toThrow();
    });

    it('does not throw when inflight directory does not exist', () => {
      const emptyPaths: BusPaths = { ...receiverPaths, inflight: join(testDir, 'nonexistent-inflight') };
      expect(() => ackInbox(emptyPaths, 'any-id')).not.toThrow();
    });

    it('only ACKs the matching message, leaves others in inflight', () => {
      const id1 = sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'msg one');
      const id2 = sendMessage(senderPaths, 'sender', 'receiver', 'normal', 'msg two');
      checkInbox(receiverPaths);

      ackInbox(receiverPaths, id1);

      const inflight = readdirSync(receiverPaths.inflight).filter(f => f.endsWith('.json'));
      const processed = readdirSync(receiverPaths.processed).filter(f => f.endsWith('.json'));
      expect(inflight).toHaveLength(1);
      expect(processed).toHaveLength(1);

      const remaining = JSON.parse(readFileSync(join(receiverPaths.inflight, inflight[0]), 'utf-8'));
      expect(remaining.id).toBe(id2);
    });
  });
});
