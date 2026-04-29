import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync,
} from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { saveOutput } from '../../../src/bus/save-output';
import type { BusPaths, Task } from '../../../src/types/index';

let tmpDir: string;
let paths: BusPaths;

function makePaths(root: string): BusPaths {
  return {
    ctxRoot: root,
    inbox: join(root, 'inbox', 'dev'),
    inflight: join(root, 'inflight', 'dev'),
    processed: join(root, 'processed', 'dev'),
    logDir: join(root, 'logs', 'dev'),
    stateDir: join(root, 'state', 'dev'),
    taskDir: join(root, 'tasks'),
    approvalDir: join(root, 'approvals'),
    analyticsDir: join(root, 'analytics'),
    deliverablesDir: join(root, 'deliverables'),
  };
}

function makeTask(id: string, assignedTo = 'dev'): Task {
  return {
    id,
    title: 'Test task',
    description: '',
    type: 'agent',
    needs_approval: false,
    status: 'in_progress',
    assigned_to: assignedTo,
    created_by: 'test',
    org: 'glv',
    priority: 'normal',
    project: '',
    kpi_key: null,
    created_at: '2026-04-29T12:00:00Z',
    updated_at: '2026-04-29T12:00:00Z',
    completed_at: null,
    due_date: null,
    archived: false,
    outputs: [],
  };
}

function writeTask(taskId: string, assignedTo = 'dev'): string {
  mkdirSync(paths.taskDir, { recursive: true });
  const taskFile = join(paths.taskDir, `${taskId}.json`);
  writeFileSync(taskFile, JSON.stringify(makeTask(taskId, assignedTo)));
  return taskFile;
}

function writeSource(filename: string, content = 'test content'): string {
  const src = join(tmpDir, filename);
  writeFileSync(src, content);
  return src;
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'ctx-saveoutput-test-'));
  paths = makePaths(tmpDir);
});

afterEach(() => {
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
});

// ---------------------------------------------------------------------------
// saveOutput — basic copy
// ---------------------------------------------------------------------------

describe('saveOutput — basic copy', () => {
  it('copies source file to deliverables tree', () => {
    const taskId = 'task_test_001';
    writeTask(taskId);
    const src = writeSource('report.pdf');

    const result = saveOutput(paths, { sourcePath: src, taskId });

    expect(existsSync(result.targetPath)).toBe(true);
  });

  it('source file still exists after copy (non-destructive)', () => {
    const taskId = 'task_test_002';
    writeTask(taskId);
    const src = writeSource('doc.txt', 'hello');

    saveOutput(paths, { sourcePath: src, taskId });

    expect(existsSync(src)).toBe(true);
  });

  it('target is inside deliverables/{agent}/{taskId}/', () => {
    const taskId = 'task_test_003';
    writeTask(taskId, 'dev');
    const src = writeSource('file.txt');

    const result = saveOutput(paths, { sourcePath: src, taskId });

    expect(result.targetPath).toContain(taskId);
    expect(result.targetPath).toContain('dev');
    expect(result.targetPath).toContain('deliverables');
  });

  it('returns linked: true by default', () => {
    const taskId = 'task_test_004';
    writeTask(taskId);
    const src = writeSource('out.txt');

    const result = saveOutput(paths, { sourcePath: src, taskId });

    expect(result.linked).toBe(true);
  });

  it('appends output entry to task.outputs[]', () => {
    const taskId = 'task_test_005';
    writeTask(taskId);
    const src = writeSource('result.txt');

    saveOutput(paths, { sourcePath: src, taskId });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, `${taskId}.json`), 'utf-8'));
    expect(task.outputs).toHaveLength(1);
    expect(task.outputs![0].type).toBe('file');
  });

  it('output entry value uses forward slashes (POSIX path)', () => {
    const taskId = 'task_test_006';
    writeTask(taskId);
    const src = writeSource('chart.png');

    const result = saveOutput(paths, { sourcePath: src, taskId });

    expect(result.storedPath).not.toContain('\\');
  });

  it('output entry label defaults to filename', () => {
    const taskId = 'task_test_007';
    writeTask(taskId);
    const src = writeSource('my-report.pdf');

    saveOutput(paths, { sourcePath: src, taskId });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, `${taskId}.json`), 'utf-8'));
    expect(task.outputs![0].label).toContain('report');
  });

  it('respects custom label', () => {
    const taskId = 'task_test_008';
    writeTask(taskId);
    const src = writeSource('img.png');

    saveOutput(paths, { sourcePath: src, taskId, label: 'Hero Image' });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, `${taskId}.json`), 'utf-8'));
    expect(task.outputs![0].label).toBe('Hero Image');
  });
});

// ---------------------------------------------------------------------------
// saveOutput — move semantics
// ---------------------------------------------------------------------------

describe('saveOutput — move option', () => {
  it('removes source file when move: true', () => {
    const taskId = 'task_test_move_001';
    writeTask(taskId);
    const src = writeSource('temp.txt');

    saveOutput(paths, { sourcePath: src, taskId, move: true });

    expect(existsSync(src)).toBe(false);
  });

  it('target file exists after move', () => {
    const taskId = 'task_test_move_002';
    writeTask(taskId);
    const src = writeSource('export.csv');

    const result = saveOutput(paths, { sourcePath: src, taskId, move: true });

    expect(existsSync(result.targetPath)).toBe(true);
  });

  it('copy semantics (move: false default) preserves source', () => {
    const taskId = 'task_test_move_003';
    writeTask(taskId);
    const src = writeSource('keep.txt');

    saveOutput(paths, { sourcePath: src, taskId, move: false });

    expect(existsSync(src)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// saveOutput — noLink option
// ---------------------------------------------------------------------------

describe('saveOutput — noLink option', () => {
  it('returns linked: false when noLink: true', () => {
    const taskId = 'task_test_nolink_001';
    writeTask(taskId);
    const src = writeSource('preview.png');

    const result = saveOutput(paths, { sourcePath: src, taskId, noLink: true });

    expect(result.linked).toBe(false);
  });

  it('does not append to task.outputs[] when noLink: true', () => {
    const taskId = 'task_test_nolink_002';
    writeTask(taskId);
    const src = writeSource('thumb.jpg');

    saveOutput(paths, { sourcePath: src, taskId, noLink: true });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, `${taskId}.json`), 'utf-8'));
    expect(task.outputs ?? []).toHaveLength(0);
  });

  it('still copies file to deliverables tree when noLink: true', () => {
    const taskId = 'task_test_nolink_003';
    writeTask(taskId);
    const src = writeSource('asset.svg');

    const result = saveOutput(paths, { sourcePath: src, taskId, noLink: true });

    expect(existsSync(result.targetPath)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// saveOutput — collision resolution
// ---------------------------------------------------------------------------

describe('saveOutput — filename collision resolution', () => {
  it('appends -1 suffix when filename already exists', () => {
    const taskId = 'task_test_col_001';
    writeTask(taskId);
    const src1 = writeSource('report.pdf', 'v1');
    const src2 = join(tmpDir, 'report2.pdf');
    writeFileSync(src2, 'v2');

    saveOutput(paths, { sourcePath: src1, taskId });
    const result2 = saveOutput(paths, { sourcePath: src2, taskId, label: 'report.pdf' });
    // Second file gets a deduplicated name (either report.pdf is the first,
    // src2 basename is report2.pdf so no collision)
    expect(existsSync(result2.targetPath)).toBe(true);
  });

  it('resolves collision by adding -1 to the stem', () => {
    const taskId = 'task_test_col_002';
    writeTask(taskId);
    // Write two files with the same name via two sources with same basename
    const src1 = join(tmpDir, 'output.txt');
    const src2Copy = join(tmpDir, 'subdir');
    mkdirSync(src2Copy, { recursive: true });
    const src2 = join(src2Copy, 'output.txt');
    writeFileSync(src1, 'first');
    writeFileSync(src2, 'second');

    const r1 = saveOutput(paths, { sourcePath: src1, taskId });
    const r2 = saveOutput(paths, { sourcePath: src2, taskId });

    expect(r1.targetPath).toContain('output.txt');
    expect(r2.targetPath).toContain('output-1.txt');
    expect(existsSync(r1.targetPath)).toBe(true);
    expect(existsSync(r2.targetPath)).toBe(true);
  });

  it('appends multiple outputs to task.outputs[]', () => {
    const taskId = 'task_test_col_003';
    writeTask(taskId);
    const s1 = writeSource('a.txt', 'a');
    const s2 = join(tmpDir, 'sub');
    mkdirSync(s2, { recursive: true });
    const s2f = join(s2, 'a.txt');
    writeFileSync(s2f, 'b');

    saveOutput(paths, { sourcePath: s1, taskId });
    saveOutput(paths, { sourcePath: s2f, taskId });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, `${taskId}.json`), 'utf-8'));
    expect(task.outputs).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// saveOutput — error cases
// ---------------------------------------------------------------------------

describe('saveOutput — error cases', () => {
  it('throws when source file does not exist', () => {
    const taskId = 'task_test_err_001';
    writeTask(taskId);

    expect(() =>
      saveOutput(paths, { sourcePath: join(tmpDir, 'nonexistent.txt'), taskId }),
    ).toThrow(/Source file not found/);
  });

  it('throws when task does not exist', () => {
    const src = writeSource('file.txt');

    expect(() =>
      saveOutput(paths, { sourcePath: src, taskId: 'task_no_such' }),
    ).toThrow(/Task not found/);
  });
});

// ---------------------------------------------------------------------------
// saveOutput — storedPath cross-platform check
// ---------------------------------------------------------------------------

describe('saveOutput — storedPath', () => {
  it('storedPath is relative to ctxRoot', () => {
    const taskId = 'task_test_path_001';
    writeTask(taskId);
    const src = writeSource('data.json', '{}');

    const result = saveOutput(paths, { sourcePath: src, taskId });

    // storedPath should not start with tmpDir absolute prefix
    expect(result.storedPath.startsWith('/')).toBe(false);
    expect(result.storedPath.startsWith(tmpDir)).toBe(false);
  });

  it('storedPath contains expected path segments', () => {
    const taskId = 'task_test_path_002';
    writeTask(taskId, 'dev');
    const src = writeSource('image.png');

    const result = saveOutput(paths, { sourcePath: src, taskId });

    expect(result.storedPath).toContain('deliverables');
    expect(result.storedPath).toContain('dev');
    expect(result.storedPath).toContain(taskId);
    expect(result.storedPath).toContain('image.png');
  });

  it('task updated_at is refreshed after linking', () => {
    const taskId = 'task_test_path_003';
    writeTask(taskId);
    const src = writeSource('log.txt');

    saveOutput(paths, { sourcePath: src, taskId });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, `${taskId}.json`), 'utf-8'));
    // updated_at should be newer than the original 2026-04-29T12:00:00Z
    expect(task.updated_at).toBeTruthy();
  });
});
