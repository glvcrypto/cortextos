import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'exp-route-'));
process.env.CTX_FRAMEWORK_ROOT = tmpRoot;

type ExperimentsRoute = typeof import('../route');
let route: ExperimentsRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

function makeOrg(name: string) {
  fs.mkdirSync(path.join(tmpRoot, 'orgs', name, 'agents'), { recursive: true });
}

function makeAgent(org: string, agent: string) {
  const base = path.join(tmpRoot, 'orgs', org, 'agents', agent, 'experiments');
  fs.mkdirSync(path.join(base, 'history'), { recursive: true });
  return base;
}

function writeExperiment(
  org: string,
  agent: string,
  filename: string,
  data: Record<string, unknown>,
) {
  const histDir = path.join(
    tmpRoot, 'orgs', org, 'agents', agent, 'experiments', 'history',
  );
  fs.writeFileSync(path.join(histDir, filename), JSON.stringify(data));
}

function writeCycles(
  org: string,
  agent: string,
  cycles: unknown[],
) {
  const expDir = path.join(tmpRoot, 'orgs', org, 'agents', agent, 'experiments');
  fs.writeFileSync(
    path.join(expDir, 'config.json'),
    JSON.stringify({ cycles }),
  );
}

// ---------------------------------------------------------------------------
// GET /api/experiments
// ---------------------------------------------------------------------------

describe('GET /api/experiments', () => {
  it('returns empty agents + zero summary when orgs dir is missing', async () => {
    const res = await route.GET(makeGet('http://localhost/api/experiments'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.agents).toEqual([]);
    expect(data.summary.totalExperiments).toBe(0);
  });

  it('returns empty when org exists but has no agents with experiments', async () => {
    makeOrg('emptyorg');
    const res = await route.GET(makeGet('http://localhost/api/experiments'));
    const data = await res.json();
    expect(data.agents).toEqual([]);
  });

  it('returns agent with experiment when history has valid JSON file', async () => {
    makeAgent('glv', 'dev');
    writeExperiment('glv', 'dev', 'exp-001.json', {
      id: 'exp-001',
      agent: 'dev',
      metric: 'throughput',
      hypothesis: 'test',
      surface: 'api',
      direction: 'up',
      window: '7d',
      measurement: 'count',
      status: 'completed',
      baseline_value: 5,
      result_value: 8,
      decision: 'keep',
      learning: null,
      experiment_commit: null,
      tracking_commit: null,
      created_at: '2026-04-01T00:00:00Z',
      started_at: null,
      completed_at: null,
    });

    const res = await route.GET(makeGet('http://localhost/api/experiments'));
    const data = await res.json();
    const agent = data.agents.find((a: { agent: string }) => a.agent === 'dev');
    expect(agent).toBeTruthy();
    expect(agent.experiments).toHaveLength(1);
    expect(agent.experiments[0].id).toBe('exp-001');
  });

  it('includes agent with cycles but no experiments', async () => {
    makeAgent('glv', 'scout');
    writeCycles('glv', 'scout', [{ name: 'deploy-reliability', metric: 'uptime' }]);

    const res = await route.GET(makeGet('http://localhost/api/experiments'));
    const data = await res.json();
    const agent = data.agents.find((a: { agent: string }) => a.agent === 'scout');
    expect(agent).toBeTruthy();
    expect(agent.cycles).toHaveLength(1);
    expect(agent.experiments).toHaveLength(0);
  });

  it('skips bad JSON experiment files silently', async () => {
    const histDir = path.join(
      tmpRoot, 'orgs', 'glv', 'agents', 'dev', 'experiments', 'history',
    );
    fs.writeFileSync(path.join(histDir, 'corrupt.json'), '{not valid json}');
    const res = await route.GET(makeGet('http://localhost/api/experiments'));
    expect(res.status).toBe(200);
  });

  it('filters by org', async () => {
    makeAgent('other', 'agent1');
    writeExperiment('other', 'agent1', 'e1.json', {
      id: 'e1', agent: 'agent1', metric: 'm', hypothesis: '', surface: '',
      direction: 'up', window: '7d', measurement: 'count',
      status: 'proposed', baseline_value: 0, result_value: null,
      decision: null, learning: null, experiment_commit: null, tracking_commit: null,
      created_at: '2026-04-01T00:00:00Z', started_at: null, completed_at: null,
    });

    const res = await route.GET(makeGet('http://localhost/api/experiments?org=other'));
    const data = await res.json();
    expect(data.agents.every((a: { org: string }) => a.org === 'other')).toBe(true);
    expect(data.agents.length).toBeGreaterThan(0);
  });

  it('filters by agent', async () => {
    const res = await route.GET(makeGet('http://localhost/api/experiments?agent=dev'));
    const data = await res.json();
    expect(data.agents.every((a: { agent: string }) => a.agent === 'dev')).toBe(true);
  });

  it('summary keepRate is 0 when no decisions have been made', async () => {
    makeAgent('glv', 'analyst');
    writeExperiment('glv', 'analyst', 'running.json', {
      id: 'r1', agent: 'analyst', metric: 'm', hypothesis: '', surface: '',
      direction: 'up', window: '7d', measurement: 'count',
      status: 'running', baseline_value: 0, result_value: null,
      decision: null, learning: null, experiment_commit: null, tracking_commit: null,
      created_at: '2026-04-02T00:00:00Z', started_at: null, completed_at: null,
    });

    const res = await route.GET(makeGet('http://localhost/api/experiments?agent=analyst'));
    const data = await res.json();
    expect(data.summary.keepRate).toBe(0);
    expect(data.summary.running).toBe(1);
  });

  it('summary keepRate is computed correctly across all agents', async () => {
    // dev has 1 kept experiment from earlier. Add 1 discarded.
    writeExperiment('glv', 'dev', 'exp-002.json', {
      id: 'exp-002', agent: 'dev', metric: 'throughput', hypothesis: '',
      surface: '', direction: 'up', window: '7d', measurement: 'count',
      status: 'completed', baseline_value: 5, result_value: 4,
      decision: 'discard', learning: null, experiment_commit: null, tracking_commit: null,
      created_at: '2026-04-02T00:00:00Z', started_at: null, completed_at: null,
    });

    const res = await route.GET(makeGet('http://localhost/api/experiments?agent=dev'));
    const data = await res.json();
    // 1 kept / (1 kept + 1 discarded) = 50%
    expect(data.summary.kept).toBe(1);
    expect(data.summary.discarded).toBe(1);
    expect(data.summary.keepRate).toBe(50);
  });
});
