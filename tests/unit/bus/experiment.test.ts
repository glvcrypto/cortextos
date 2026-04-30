import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  createExperiment,
  runExperiment,
  evaluateExperiment,
  listExperiments,
  gatherContext,
  manageCycle,
} from '../../../src/bus/experiment';

describe('Experiment', () => {
  let agentDir: string;

  beforeEach(() => {
    agentDir = mkdtempSync(join(tmpdir(), 'ctx-experiment-test-'));
  });

  afterEach(() => {
    rmSync(agentDir, { recursive: true, force: true });
  });

  // ---------------------------------------------------------------------------
  // createExperiment
  // ---------------------------------------------------------------------------

  describe('createExperiment', () => {
    it('returns an id and persists the experiment file', () => {
      const id = createExperiment(agentDir, 'boris', 'click_rate', 'CTA colour increases CTR');
      expect(id).toMatch(/^exp_\d+_\w+$/);

      const file = join(agentDir, 'experiments', 'history', `${id}.json`);
      expect(existsSync(file)).toBe(true);

      const exp = JSON.parse(readFileSync(file, 'utf-8'));
      expect(exp.id).toBe(id);
      expect(exp.agent).toBe('boris');
      expect(exp.metric).toBe('click_rate');
      expect(exp.hypothesis).toBe('CTA colour increases CTR');
      expect(exp.status).toBe('proposed');
      expect(exp.result_value).toBeNull();
      expect(exp.decision).toBeNull();
    });

    it('applies default values for optional options', () => {
      const id = createExperiment(agentDir, 'boris', 'ctr', 'test');
      const exp = JSON.parse(readFileSync(join(agentDir, 'experiments', 'history', `${id}.json`), 'utf-8'));
      expect(exp.direction).toBe('higher');
      expect(exp.window).toBe('24h');
      expect(exp.surface).toBe('');
    });

    it('stores custom options', () => {
      const id = createExperiment(agentDir, 'boris', 'ctr', 'test', {
        surface: 'landing_page',
        direction: 'lower',
        window: '48h',
        measurement: 'GA4 bounce rate',
      });
      const exp = JSON.parse(readFileSync(join(agentDir, 'experiments', 'history', `${id}.json`), 'utf-8'));
      expect(exp.surface).toBe('landing_page');
      expect(exp.direction).toBe('lower');
      expect(exp.window).toBe('48h');
      expect(exp.measurement).toBe('GA4 bounce rate');
    });
  });

  // ---------------------------------------------------------------------------
  // runExperiment
  // ---------------------------------------------------------------------------

  describe('runExperiment', () => {
    it('transitions status to running and sets started_at', () => {
      const id = createExperiment(agentDir, 'boris', 'ctr', 'blue button');
      const exp = runExperiment(agentDir, id);

      expect(exp.status).toBe('running');
      expect(exp.started_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    });

    it('writes active.json alongside the history file', () => {
      const id = createExperiment(agentDir, 'boris', 'ctr', 'blue button');
      runExperiment(agentDir, id);

      const activePath = join(agentDir, 'experiments', 'active.json');
      expect(existsSync(activePath)).toBe(true);
      const active = JSON.parse(readFileSync(activePath, 'utf-8'));
      expect(active.id).toBe(id);
    });

    it('stores changesDescription when supplied', () => {
      const id = createExperiment(agentDir, 'boris', 'ctr', 'test');
      const exp = runExperiment(agentDir, id, 'changed CTA from red to blue');
      expect(exp.changes_description).toBe('changed CTA from red to blue');
    });

    it('throws if experiment is not in proposed status', () => {
      const id = createExperiment(agentDir, 'boris', 'ctr', 'test');
      runExperiment(agentDir, id);
      expect(() => runExperiment(agentDir, id)).toThrow(/expected 'proposed'/);
    });

    it('throws if experiment id does not exist', () => {
      expect(() => runExperiment(agentDir, 'exp_nonexistent')).toThrow(/not found/);
    });
  });

  // ---------------------------------------------------------------------------
  // evaluateExperiment
  // ---------------------------------------------------------------------------

  describe('evaluateExperiment', () => {
    function proposeAndRun(metric = 'ctr', direction: 'higher' | 'lower' = 'higher'): string {
      const id = createExperiment(agentDir, 'boris', metric, 'hypothesis', { direction });
      runExperiment(agentDir, id);
      return id;
    }

    it('keeps when measured > baseline for direction:higher', () => {
      const id = proposeAndRun();
      const exp = evaluateExperiment(agentDir, id, 10);
      expect(exp.decision).toBe('keep');
      expect(exp.status).toBe('completed');
      expect(exp.result_value).toBe(10);
    });

    it('discards when measured ≤ baseline for direction:higher', () => {
      const id = proposeAndRun();
      const exp = evaluateExperiment(agentDir, id, 0);
      expect(exp.decision).toBe('discard');
    });

    it('keeps when measured < baseline for direction:lower', () => {
      const id = createExperiment(agentDir, 'boris', 'bounce', 'test', { direction: 'lower' });
      // Manually set baseline_value to 50 so we can beat it going lower
      const histPath = join(agentDir, 'experiments', 'history');
      const filePath = join(histPath, `${id}.json`);
      const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
      raw.baseline_value = 50;
      writeFileSync(filePath, JSON.stringify(raw));
      runExperiment(agentDir, id);

      const exp = evaluateExperiment(agentDir, id, 30);
      expect(exp.decision).toBe('keep');
    });

    it('throws if experiment is not running', () => {
      const id = createExperiment(agentDir, 'boris', 'ctr', 'test');
      expect(() => evaluateExperiment(agentDir, id, 5)).toThrow(/expected 'running'/);
    });

    it('removes active.json on completion', () => {
      const id = proposeAndRun();
      evaluateExperiment(agentDir, id, 5);
      expect(existsSync(join(agentDir, 'experiments', 'active.json'))).toBe(false);
    });

    it('writes a TSV row to results.tsv', () => {
      const id = proposeAndRun();
      evaluateExperiment(agentDir, id, 7);

      const tsvPath = join(agentDir, 'experiments', 'results.tsv');
      expect(existsSync(tsvPath)).toBe(true);
      const content = readFileSync(tsvPath, 'utf-8');
      expect(content).toContain(id);
      expect(content).toContain('keep');
    });

    it('appends to learnings.md', () => {
      const id = proposeAndRun();
      evaluateExperiment(agentDir, id, 5, { learning: 'blue converts better' });

      const learnings = readFileSync(join(agentDir, 'experiments', 'learnings.md'), 'utf-8');
      expect(learnings).toContain(id);
      expect(learnings).toContain('blue converts better');
    });

    it('uses --score override for qualitative metrics', () => {
      const id = proposeAndRun();
      const exp = evaluateExperiment(agentDir, id, 0, { score: 8 });
      expect(exp.result_value).toBe(8);
      expect(exp.decision).toBe('keep');
    });

    it('joins learning and justification with " — "', () => {
      const id = proposeAndRun();
      evaluateExperiment(agentDir, id, 5, { learning: 'part A', justification: 'part B' });

      const learnings = readFileSync(join(agentDir, 'experiments', 'learnings.md'), 'utf-8');
      expect(learnings).toContain('part A — part B');
    });

    it('updates baseline to measured value on keep', () => {
      const id = proposeAndRun();
      const exp = evaluateExperiment(agentDir, id, 42);
      expect(exp.baseline_value).toBe(42);
    });
  });

  // ---------------------------------------------------------------------------
  // listExperiments
  // ---------------------------------------------------------------------------

  describe('listExperiments', () => {
    it('returns empty array when history dir does not exist', () => {
      expect(listExperiments(agentDir)).toEqual([]);
    });

    it('filters by status', () => {
      const id1 = createExperiment(agentDir, 'boris', 'ctr', 'test1');
      const id2 = createExperiment(agentDir, 'boris', 'ctr', 'test2');
      runExperiment(agentDir, id2);

      const proposed = listExperiments(agentDir, { status: 'proposed' });
      expect(proposed).toHaveLength(1);
      expect(proposed[0].id).toBe(id1);
    });

    it('filters by metric', () => {
      createExperiment(agentDir, 'boris', 'ctr', 'test');
      createExperiment(agentDir, 'boris', 'bounce', 'test');

      const results = listExperiments(agentDir, { metric: 'bounce' });
      expect(results).toHaveLength(1);
      expect(results[0].metric).toBe('bounce');
    });

    it('skips corrupt JSON files without throwing', () => {
      const histDir = join(agentDir, 'experiments', 'history');
      mkdirSync(histDir, { recursive: true });
      writeFileSync(join(histDir, 'bad.json'), 'NOT_JSON');
      createExperiment(agentDir, 'boris', 'ctr', 'good');

      expect(() => listExperiments(agentDir)).not.toThrow();
      expect(listExperiments(agentDir)).toHaveLength(1);
    });
  });

  // ---------------------------------------------------------------------------
  // gatherContext
  // ---------------------------------------------------------------------------

  describe('gatherContext', () => {
    it('returns zero stats when no experiments exist', () => {
      const ctx = gatherContext(agentDir, 'boris');
      expect(ctx.agent).toBe('boris');
      expect(ctx.total_experiments).toBe(0);
      expect(ctx.keeps).toBe(0);
      expect(ctx.discards).toBe(0);
      expect(ctx.keep_rate).toBe(0);
    });

    it('calculates keep_rate correctly', () => {
      const id1 = createExperiment(agentDir, 'boris', 'ctr', 'h1');
      runExperiment(agentDir, id1);
      evaluateExperiment(agentDir, id1, 10);

      const id2 = createExperiment(agentDir, 'boris', 'ctr', 'h2');
      runExperiment(agentDir, id2);
      evaluateExperiment(agentDir, id2, 0);

      const ctx = gatherContext(agentDir, 'boris');
      expect(ctx.keeps).toBe(1);
      expect(ctx.discards).toBe(1);
      expect(ctx.keep_rate).toBe(0.5);
    });

    it('reads IDENTITY.md and GOALS.md when they exist', () => {
      writeFileSync(join(agentDir, 'IDENTITY.md'), 'I am boris');
      writeFileSync(join(agentDir, 'GOALS.md'), 'Goal: grow ctr');

      const ctx = gatherContext(agentDir, 'boris');
      expect(ctx.identity).toContain('I am boris');
      expect(ctx.goals).toContain('Goal: grow ctr');
    });
  });

  // ---------------------------------------------------------------------------
  // manageCycle
  // ---------------------------------------------------------------------------

  describe('manageCycle', () => {
    it('creates a cycle in config.json', () => {
      const cycles = manageCycle(agentDir, 'create', {
        name: 'weekly-ctr',
        agent: 'boris',
        metric: 'ctr',
      });
      expect(cycles).toHaveLength(1);
      expect(cycles[0].name).toBe('weekly-ctr');
      expect(cycles[0].enabled).toBe(true);
    });

    it('modifies an existing cycle', () => {
      manageCycle(agentDir, 'create', { name: 'c1', agent: 'boris', metric: 'ctr' });
      const cycles = manageCycle(agentDir, 'modify', { name: 'c1', metric: 'bounce' });
      expect(cycles[0].metric).toBe('bounce');
    });

    it('throws on modify of non-existent cycle', () => {
      expect(() => manageCycle(agentDir, 'modify', { name: 'nope' })).toThrow(/not found/);
    });

    it('removes a cycle', () => {
      manageCycle(agentDir, 'create', { name: 'c1', agent: 'boris', metric: 'ctr' });
      const cycles = manageCycle(agentDir, 'remove', { name: 'c1' });
      expect(cycles).toHaveLength(0);
    });

    it('lists all cycles when no agent filter', () => {
      manageCycle(agentDir, 'create', { name: 'c1', agent: 'boris', metric: 'ctr' });
      manageCycle(agentDir, 'create', { name: 'c2', agent: 'content', metric: 'views' });
      const all = manageCycle(agentDir, 'list', {});
      expect(all).toHaveLength(2);
    });

    it('filters list by agent', () => {
      manageCycle(agentDir, 'create', { name: 'c1', agent: 'boris', metric: 'ctr' });
      manageCycle(agentDir, 'create', { name: 'c2', agent: 'content', metric: 'views' });
      const filtered = manageCycle(agentDir, 'list', { agent: 'boris' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].agent).toBe('boris');
    });

    it('throws create when required fields are missing', () => {
      expect(() => manageCycle(agentDir, 'create', { name: 'c1' })).toThrow(/requires name, agent, and metric/);
    });
  });
});
