import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { parseUsageOutput, storeUsageData, collectMetrics } from '../../../src/bus/metrics';
import type { UsageData } from '../../../src/bus/metrics';

let testDir: string;

beforeEach(() => {
  testDir = mkdtempSync(join(tmpdir(), 'cortextos-metrics-test-'));
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// parseUsageOutput — pure string parser, no I/O
// ---------------------------------------------------------------------------

describe('parseUsageOutput', () => {
  const SAMPLE_OUTPUT = `
Current session: 45% (Resets in 3 hours)
Current week (all models): 62% (Resets Monday)
Current week (Sonnet): 55%
`;

  it('parses session percentage', () => {
    const result = parseUsageOutput(SAMPLE_OUTPUT, 'dev');
    expect(result.session.used_pct).toBe(45);
  });

  it('parses week all-models percentage', () => {
    const result = parseUsageOutput(SAMPLE_OUTPUT, 'dev');
    expect(result.week_all_models.used_pct).toBe(62);
  });

  it('parses week sonnet percentage', () => {
    const result = parseUsageOutput(SAMPLE_OUTPUT, 'dev');
    expect(result.week_sonnet.used_pct).toBe(55);
  });

  it('parses session reset string', () => {
    const result = parseUsageOutput(SAMPLE_OUTPUT, 'dev');
    expect(result.session.resets).toBe('in 3 hours)');
  });

  it('parses week reset string', () => {
    const result = parseUsageOutput(SAMPLE_OUTPUT, 'dev');
    expect(result.week_all_models.resets).toBe('Monday)');
  });

  it('returns zeros for all percentages when output is empty', () => {
    const result = parseUsageOutput('', 'dev');
    expect(result.session.used_pct).toBe(0);
    expect(result.week_all_models.used_pct).toBe(0);
    expect(result.week_sonnet.used_pct).toBe(0);
  });

  it('sets agent name on result', () => {
    const result = parseUsageOutput(SAMPLE_OUTPUT, 'my-agent');
    expect(result.agent).toBe('my-agent');
  });

  it('includes a timestamp string', () => {
    const result = parseUsageOutput(SAMPLE_OUTPUT, 'dev');
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('returns 0 resets strings when no reset info present', () => {
    const result = parseUsageOutput('Current session: 10%\nCurrent week (all models): 5%\n', 'dev');
    expect(result.session.resets).toBe('');
    expect(result.week_all_models.resets).toBe('');
  });
});

// ---------------------------------------------------------------------------
// storeUsageData — writes latest.json + appends daily JSONL
// ---------------------------------------------------------------------------

describe('storeUsageData', () => {
  function makeData(agent: string): UsageData {
    return {
      agent,
      timestamp: '2026-04-29T10:00:00Z',
      session: { used_pct: 30, resets: 'in 2h' },
      week_all_models: { used_pct: 50, resets: 'Monday' },
      week_sonnet: { used_pct: 40 },
    };
  }

  it('writes latest.json to state/usage/', () => {
    storeUsageData(testDir, makeData('dev'));

    const latestPath = join(testDir, 'state', 'usage', 'latest.json');
    expect(existsSync(latestPath)).toBe(true);
    const data = JSON.parse(readFileSync(latestPath, 'utf-8'));
    expect(data.agent).toBe('dev');
    expect(data.session.used_pct).toBe(30);
  });

  it('appends a JSONL line to the daily log', () => {
    storeUsageData(testDir, makeData('dev'));

    const dailyPath = join(testDir, 'state', 'usage', '2026-04-29.jsonl');
    expect(existsSync(dailyPath)).toBe(true);
    const lines = readFileSync(dailyPath, 'utf-8').trim().split('\n');
    expect(lines.length).toBe(1);
    expect(JSON.parse(lines[0]).agent).toBe('dev');
  });

  it('appends additional records to the daily JSONL without overwriting', () => {
    storeUsageData(testDir, makeData('dev'));
    storeUsageData(testDir, makeData('scout'));

    const dailyPath = join(testDir, 'state', 'usage', '2026-04-29.jsonl');
    const lines = readFileSync(dailyPath, 'utf-8').trim().split('\n');
    expect(lines.length).toBe(2);
    expect(JSON.parse(lines[0]).agent).toBe('dev');
    expect(JSON.parse(lines[1]).agent).toBe('scout');
  });

  it('latest.json is overwritten by subsequent writes', () => {
    storeUsageData(testDir, makeData('dev'));
    const data2: UsageData = { ...makeData('dev'), session: { used_pct: 99, resets: 'soon' } };
    storeUsageData(testDir, data2);

    const latestPath = join(testDir, 'state', 'usage', 'latest.json');
    const stored = JSON.parse(readFileSync(latestPath, 'utf-8'));
    expect(stored.session.used_pct).toBe(99);
  });
});

// ---------------------------------------------------------------------------
// collectMetrics — aggregates agent task counts, heartbeat health, approvals
// ---------------------------------------------------------------------------

describe('collectMetrics', () => {
  function writeAgent(ctxRoot: string, name: string) {
    const configDir = join(ctxRoot, 'config');
    mkdirSync(configDir, { recursive: true });
    const existing = existsSync(join(configDir, 'enabled-agents.json'))
      ? JSON.parse(readFileSync(join(configDir, 'enabled-agents.json'), 'utf-8'))
      : {};
    existing[name] = { org: 'acme', enabled: true };
    writeFileSync(join(configDir, 'enabled-agents.json'), JSON.stringify(existing));
  }

  function writeTask(ctxRoot: string, taskId: string, assignedTo: string, status: string) {
    const taskDir = join(ctxRoot, 'tasks');
    mkdirSync(taskDir, { recursive: true });
    writeFileSync(join(taskDir, `${taskId}.json`), JSON.stringify({
      id: taskId, assigned_to: assignedTo, status,
    }));
  }

  function writeHeartbeat(ctxRoot: string, agentName: string, ageMs: number) {
    const hbDir = join(ctxRoot, 'state', agentName);
    mkdirSync(hbDir, { recursive: true });
    const ts = new Date(Date.now() - ageMs).toISOString();
    writeFileSync(join(hbDir, 'heartbeat.json'), JSON.stringify({ last_heartbeat: ts }));
  }

  it('returns empty agents object when no agents configured', () => {
    const report = collectMetrics(testDir);
    expect(report.agents).toEqual({});
    expect(report.system.agents_total).toBe(0);
  });

  it('counts completed tasks for each agent', () => {
    writeAgent(testDir, 'dev');
    writeTask(testDir, 'task-1', 'dev', 'completed');
    writeTask(testDir, 'task-2', 'dev', 'completed');
    writeTask(testDir, 'task-3', 'dev', 'pending');

    const report = collectMetrics(testDir);
    expect(report.agents['dev'].tasks_completed).toBe(2);
    expect(report.agents['dev'].tasks_pending).toBe(1);
    expect(report.system.total_tasks_completed).toBe(2);
  });

  it('marks agent heartbeat_stale=false when heartbeat is recent (<5h)', () => {
    writeAgent(testDir, 'dev');
    writeHeartbeat(testDir, 'dev', 60 * 1000); // 1 minute old

    const report = collectMetrics(testDir);
    expect(report.agents['dev'].heartbeat_stale).toBe(false);
    expect(report.system.agents_healthy).toBe(1);
  });

  it('marks agent heartbeat_stale=true when heartbeat is old (>5h)', () => {
    writeAgent(testDir, 'dev');
    writeHeartbeat(testDir, 'dev', 6 * 60 * 60 * 1000); // 6 hours old

    const report = collectMetrics(testDir);
    expect(report.agents['dev'].heartbeat_stale).toBe(true);
    expect(report.system.agents_healthy).toBe(0);
  });

  it('counts pending approvals in approvals/pending/', () => {
    writeAgent(testDir, 'dev');
    const pendingDir = join(testDir, 'approvals', 'pending');
    mkdirSync(pendingDir, { recursive: true });
    writeFileSync(join(pendingDir, 'approval_1.json'), JSON.stringify({ id: 'approval_1' }));
    writeFileSync(join(pendingDir, 'approval_2.json'), JSON.stringify({ id: 'approval_2' }));

    const report = collectMetrics(testDir);
    expect(report.system.approvals_pending).toBe(2);
  });

  it('writes latest.json to analytics/reports/', () => {
    writeAgent(testDir, 'dev');
    collectMetrics(testDir);

    const reportPath = join(testDir, 'analytics', 'reports', 'latest.json');
    expect(existsSync(reportPath)).toBe(true);
    const written = JSON.parse(readFileSync(reportPath, 'utf-8'));
    expect(written.system).toBeDefined();
  });

  it('handles missing config file gracefully (no agents, no crash)', () => {
    expect(() => collectMetrics(testDir)).not.toThrow();
    const report = collectMetrics(testDir);
    expect(report.system.agents_total).toBe(0);
  });

  it('ignores tasks assigned to other agents when counting', () => {
    writeAgent(testDir, 'dev');
    writeAgent(testDir, 'scout');
    writeTask(testDir, 'task-a', 'dev', 'completed');
    writeTask(testDir, 'task-b', 'scout', 'completed');

    const report = collectMetrics(testDir);
    expect(report.agents['dev'].tasks_completed).toBe(1);
    expect(report.agents['scout'].tasks_completed).toBe(1);
  });
});
