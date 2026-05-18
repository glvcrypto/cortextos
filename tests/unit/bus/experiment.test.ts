import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  loadExperimentConfig,
  createExperiment,
  runExperiment,
  evaluateExperiment,
  listExperiments,
  gatherContext,
} from '../../../src/bus/experiment';

let agentDir: string;

beforeEach(() => {
  agentDir = mkdtempSync(join(tmpdir(), 'cortextos-experiment-test-'));
});

afterEach(() => {
  rmSync(agentDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// loadExperimentConfig
// ---------------------------------------------------------------------------

describe('loadExperimentConfig', () => {
  it('returns empty object when config file does not exist', () => {
    const config = loadExperimentConfig(agentDir);
    expect(config).toEqual({});
  });

  it('returns parsed config when file exists', () => {
    const expDir = join(agentDir, 'experiments');
    mkdirSync(expDir, { recursive: true });
    writeFileSync(join(expDir, 'config.json'), JSON.stringify({
      approval_required: true,
      theta_wave: { enabled: true },
    }));

    const config = loadExperimentConfig(agentDir);
    expect(config.approval_required).toBe(true);
    expect(config.theta_wave?.enabled).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// createExperiment
// ---------------------------------------------------------------------------

describe('createExperiment', () => {
  it('returns an id matching exp_<epoch>_<rand>', () => {
    const id = createExperiment(agentDir, 'dev', 'open_rate', 'Subject line A beats B');
    expect(id).toMatch(/^exp_\d+_[a-zA-Z0-9]+$/);
  });

  it('writes experiment JSON to experiments/history/', () => {
    const id = createExperiment(agentDir, 'dev', 'open_rate', 'Subject line A beats B');
    const filePath = join(agentDir, 'experiments', 'history', `${id}.json`);
    expect(existsSync(filePath)).toBe(true);

    const exp = JSON.parse(readFileSync(filePath, 'utf-8'));
    expect(exp.id).toBe(id);
    expect(exp.agent).toBe('dev');
    expect(exp.metric).toBe('open_rate');
    expect(exp.hypothesis).toBe('Subject line A beats B');
    expect(exp.status).toBe('proposed');
  });

  it('applies default direction=higher and window=24h', () => {
    const id = createExperiment(agentDir, 'dev', 'clicks', 'CTA change improves clicks');
    const exp = JSON.parse(readFileSync(join(agentDir, 'experiments', 'history', `${id}.json`), 'utf-8'));
    expect(exp.direction).toBe('higher');
    expect(exp.window).toBe('24h');
  });

  it('applies options surface, direction, window when provided', () => {
    const id = createExperiment(agentDir, 'dev', 'bounce_rate', 'Shorter copy reduces bounces', {
      surface: 'landing_page',
      direction: 'lower',
      window: '48h',
    });
    const exp = JSON.parse(readFileSync(join(agentDir, 'experiments', 'history', `${id}.json`), 'utf-8'));
    expect(exp.surface).toBe('landing_page');
    expect(exp.direction).toBe('lower');
    expect(exp.window).toBe('48h');
  });
});

// ---------------------------------------------------------------------------
// runExperiment
// ---------------------------------------------------------------------------

describe('runExperiment', () => {
  it('transitions experiment from proposed to running', () => {
    const id = createExperiment(agentDir, 'dev', 'open_rate', 'Hypothesis');
    const result = runExperiment(agentDir, id);

    expect(result.status).toBe('running');
    expect(result.started_at).toBeTruthy();
  });

  it('writes active.json', () => {
    const id = createExperiment(agentDir, 'dev', 'open_rate', 'Hypothesis');
    runExperiment(agentDir, id);

    const activePath = join(agentDir, 'experiments', 'active.json');
    expect(existsSync(activePath)).toBe(true);
    const active = JSON.parse(readFileSync(activePath, 'utf-8'));
    expect(active.id).toBe(id);
    expect(active.status).toBe('running');
  });

  it('sets changes_description when provided', () => {
    const id = createExperiment(agentDir, 'dev', 'clicks', 'CTA change');
    const result = runExperiment(agentDir, id, 'Changed button color to orange');
    expect(result.changes_description).toBe('Changed button color to orange');
  });

  it('throws when experiment is not in proposed state', () => {
    const id = createExperiment(agentDir, 'dev', 'open_rate', 'Hypothesis');
    runExperiment(agentDir, id);
    // Already 'running' — calling again should throw
    expect(() => runExperiment(agentDir, id)).toThrow(/proposed/);
  });
});

// ---------------------------------------------------------------------------
// evaluateExperiment
// ---------------------------------------------------------------------------

describe('evaluateExperiment', () => {
  function startedExperiment(direction: 'higher' | 'lower' = 'higher', baseline = 50) {
    const id = createExperiment(agentDir, 'dev', 'open_rate', 'Hypothesis', { direction });
    // Manually set baseline_value before running
    const histPath = join(agentDir, 'experiments', 'history', `${id}.json`);
    const exp = JSON.parse(readFileSync(histPath, 'utf-8'));
    exp.baseline_value = baseline;
    writeFileSync(histPath, JSON.stringify(exp));
    runExperiment(agentDir, id);
    return id;
  }

  it('decision=keep when measured > baseline (direction=higher)', () => {
    const id = startedExperiment('higher', 50);
    const result = evaluateExperiment(agentDir, id, 60);
    expect(result.decision).toBe('keep');
    expect(result.result_value).toBe(60);
  });

  it('decision=discard when measured <= baseline (direction=higher)', () => {
    const id = startedExperiment('higher', 50);
    const result = evaluateExperiment(agentDir, id, 40);
    expect(result.decision).toBe('discard');
  });

  it('decision=keep when measured < baseline (direction=lower)', () => {
    const id = startedExperiment('lower', 50);
    const result = evaluateExperiment(agentDir, id, 30);
    expect(result.decision).toBe('keep');
  });

  it('updates baseline to measured value on keep', () => {
    const id = startedExperiment('higher', 50);
    const result = evaluateExperiment(agentDir, id, 65);
    expect(result.baseline_value).toBe(65);
  });

  it('baseline unchanged on discard', () => {
    const id = startedExperiment('higher', 50);
    const result = evaluateExperiment(agentDir, id, 30);
    expect(result.baseline_value).toBe(50);
  });

  it('score option overrides measuredValue for decision', () => {
    const id = startedExperiment('higher', 5);
    // Pass 0 as placeholder measuredValue, score=8 as actual
    const result = evaluateExperiment(agentDir, id, 0, { score: 8 });
    expect(result.result_value).toBe(8);
    expect(result.decision).toBe('keep');
  });

  it('appends a line to results.tsv', () => {
    const id = startedExperiment('higher', 50);
    evaluateExperiment(agentDir, id, 60);

    const tsvPath = join(agentDir, 'experiments', 'results.tsv');
    expect(existsSync(tsvPath)).toBe(true);
    const lines = readFileSync(tsvPath, 'utf-8').trim().split('\n');
    // header + 1 data line
    expect(lines.length).toBe(2);
    expect(lines[1]).toContain(id);
    expect(lines[1]).toContain('keep');
  });

  it('removes active.json after evaluation', () => {
    const id = startedExperiment('higher', 50);
    const activePath = join(agentDir, 'experiments', 'active.json');
    expect(existsSync(activePath)).toBe(true);

    evaluateExperiment(agentDir, id, 60);
    expect(existsSync(activePath)).toBe(false);
  });

  it('throws when experiment is not in running state', () => {
    const id = createExperiment(agentDir, 'dev', 'open_rate', 'Hypothesis');
    // Still 'proposed' — evaluating should throw
    expect(() => evaluateExperiment(agentDir, id, 60)).toThrow(/running/);
  });
});

// ---------------------------------------------------------------------------
// listExperiments
// ---------------------------------------------------------------------------

describe('listExperiments', () => {
  it('returns empty array when history dir does not exist', () => {
    expect(listExperiments(agentDir)).toEqual([]);
  });

  it('returns all experiments sorted newest-first', () => {
    // Write JSON with explicit distinct created_at to avoid second-granularity
    // collision that makes sort order non-deterministic in fast test runs.
    const histDir = join(agentDir, 'experiments', 'history');
    mkdirSync(histDir, { recursive: true });

    const makeExp = (id: string, created_at: string) => ({
      id, agent: 'dev', metric: 'clicks', hypothesis: 'H', surface: '',
      direction: 'higher', window: '24h', measurement: '', status: 'proposed',
      baseline_value: 0, result_value: null, decision: null, learning: '',
      experiment_commit: null, tracking_commit: null, changes_description: null,
      created_at, started_at: null, completed_at: null,
    });

    writeFileSync(join(histDir, 'exp_older.json'), JSON.stringify(makeExp('exp_older', '2026-01-01T10:00:00Z')));
    writeFileSync(join(histDir, 'exp_newer.json'), JSON.stringify(makeExp('exp_newer', '2026-01-01T11:00:00Z')));

    const all = listExperiments(agentDir);
    expect(all.length).toBe(2);
    expect(all[0].id).toBe('exp_newer');
    expect(all[1].id).toBe('exp_older');
  });

  it('filters by status', () => {
    const id1 = createExperiment(agentDir, 'dev', 'clicks', 'H1');
    createExperiment(agentDir, 'dev', 'opens', 'H2');
    runExperiment(agentDir, id1);

    const running = listExperiments(agentDir, { status: 'running' });
    expect(running.length).toBe(1);
    expect(running[0].id).toBe(id1);
  });

  it('filters by metric', () => {
    createExperiment(agentDir, 'dev', 'clicks', 'H1');
    const id2 = createExperiment(agentDir, 'dev', 'opens', 'H2');

    const opens = listExperiments(agentDir, { metric: 'opens' });
    expect(opens.length).toBe(1);
    expect(opens[0].id).toBe(id2);
  });

  it('skips corrupt JSON files gracefully', () => {
    const id = createExperiment(agentDir, 'dev', 'clicks', 'H1');
    // Write a corrupt file alongside the valid one
    writeFileSync(join(agentDir, 'experiments', 'history', 'corrupt.json'), 'not-json{{');

    const all = listExperiments(agentDir);
    expect(all.length).toBe(1);
    expect(all[0].id).toBe(id);
  });
});

// ---------------------------------------------------------------------------
// gatherContext
// ---------------------------------------------------------------------------

describe('gatherContext', () => {
  it('returns zeros and empty strings when no experiments exist', () => {
    const ctx = gatherContext(agentDir, 'dev');
    expect(ctx.total_experiments).toBe(0);
    expect(ctx.keeps).toBe(0);
    expect(ctx.discards).toBe(0);
    expect(ctx.keep_rate).toBe(0);
    expect(ctx.learnings).toBe('');
  });

  it('calculates keep_rate from completed experiments', () => {
    // Create 2 experiments, run + evaluate both
    function makeCompleted(direction: 'higher' | 'lower', measured: number, baseline: number) {
      const id = createExperiment(agentDir, 'dev', 'clicks', 'H');
      const histPath = join(agentDir, 'experiments', 'history', `${id}.json`);
      const exp = JSON.parse(readFileSync(histPath, 'utf-8'));
      exp.baseline_value = baseline;
      exp.direction = direction;
      writeFileSync(histPath, JSON.stringify(exp));
      runExperiment(agentDir, id);
      evaluateExperiment(agentDir, id, measured);
    }

    makeCompleted('higher', 60, 50); // keep
    makeCompleted('higher', 30, 50); // discard

    const ctx = gatherContext(agentDir, 'dev');
    expect(ctx.total_experiments).toBe(2);
    expect(ctx.keeps).toBe(1);
    expect(ctx.discards).toBe(1);
    expect(ctx.keep_rate).toBe(0.5);
  });

  it('reads learnings.md content when present', () => {
    mkdirSync(join(agentDir, 'experiments'), { recursive: true });
    writeFileSync(join(agentDir, 'experiments', 'learnings.md'), '# Learnings\n- Test insight\n');

    const ctx = gatherContext(agentDir, 'dev');
    expect(ctx.learnings).toContain('Test insight');
  });
});
