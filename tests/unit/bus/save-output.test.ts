import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { saveOutput } from '../../../src/bus/save-output';
import type { BusPaths, Task } from '../../../src/types';

function makePaths(root: string): BusPaths {
  return {
    ctxRoot: root,
    inbox: join(root, 'inbox'),
    inflight: join(root, 'inflight'),
    processed: join(root, 'processed'),
    logDir: join(root, 'logs'),
    stateDir: join(root, 'state'),
    taskDir: join(root, 'tasks'),
    approvalDir: join(root, 'approvals'),
    analyticsDir: join(root, 'analytics'),
    deliverablesDir: join(root, 'deliverables'),
  };
}

function makeTask(taskDir: string, taskId: string, assigned_to = 'boris'): void {
  mkdirSync(taskDir, { recursive: true });
  const task: Task = {
    id: taskId,
    title: 'Test task',
    description: '',
    type: 'agent',
    needs_approval: false,
    status: 'in_progress',
    assigned_to,
    created_by: 'system',
    org: 'acme',
    priority: 'medium',
    project: 'test',
    kpi_key: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    completed_at: null,
    due_date: null,
    archived: false,
  };
  writeFileSync(join(taskDir, `${taskId}.json`), JSON.stringify(task, null, 2));
}

describe('saveOutput', () => {
  let testDir: string;
  let paths: BusPaths;
  let srcDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'ctx-saveout-test-'));
    paths = makePaths(testDir);
    srcDir = join(testDir, 'src');
    mkdirSync(srcDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('copies the source file into the deliverables tree', () => {
    const src = join(srcDir, 'report.pdf');
    writeFileSync(src, 'PDF content');
    makeTask(paths.taskDir, 'T1');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'T1' });

    expect(existsSync(result.targetPath)).toBe(true);
    expect(readFileSync(result.targetPath, 'utf-8')).toBe('PDF content');
    expect(result.linked).toBe(true);
  });

  it('places the file under {deliverablesDir}/{assigned_to}/{taskId}/', () => {
    const src = join(srcDir, 'doc.txt');
    writeFileSync(src, 'hello');
    makeTask(paths.taskDir, 'T2', 'content-agent');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'T2' });

    expect(result.targetPath).toContain(join('content-agent', 'T2'));
    expect(result.targetPath).toContain('doc.txt');
  });

  it('storedPath uses forward slashes (cross-platform)', () => {
    const src = join(srcDir, 'file.md');
    writeFileSync(src, '# doc');
    makeTask(paths.taskDir, 'T3');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'T3' });

    expect(result.storedPath).not.toContain('\\');
    expect(result.storedPath).toContain('/');
  });

  it('appends a file output entry to task.outputs', () => {
    const src = join(srcDir, 'chart.png');
    writeFileSync(src, 'PNG');
    makeTask(paths.taskDir, 'T4');

    saveOutput(paths, { sourcePath: src, taskId: 'T4' });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'T4.json'), 'utf-8'));
    expect(task.outputs).toHaveLength(1);
    expect(task.outputs![0].type).toBe('file');
    expect(task.outputs![0].label).toBe('chart.png');
  });

  it('uses a custom label when provided', () => {
    const src = join(srcDir, 'report.csv');
    writeFileSync(src, 'a,b,c');
    makeTask(paths.taskDir, 'T5');

    saveOutput(paths, { sourcePath: src, taskId: 'T5', label: 'Monthly Report' });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'T5.json'), 'utf-8'));
    expect(task.outputs![0].label).toBe('Monthly Report');
  });

  it('does not link when noLink:true but still copies the file', () => {
    const src = join(srcDir, 'temp.txt');
    writeFileSync(src, 'data');
    makeTask(paths.taskDir, 'T6');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'T6', noLink: true });

    expect(existsSync(result.targetPath)).toBe(true);
    expect(result.linked).toBe(false);

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'T6.json'), 'utf-8'));
    expect(task.outputs ?? []).toHaveLength(0);
  });

  it('deletes the source file when move:true', () => {
    const src = join(srcDir, 'draft.md');
    writeFileSync(src, '# Draft');
    makeTask(paths.taskDir, 'T7');

    saveOutput(paths, { sourcePath: src, taskId: 'T7', move: true });

    expect(existsSync(src)).toBe(false);
  });

  it('keeps the source file when move is not set', () => {
    const src = join(srcDir, 'keep.txt');
    writeFileSync(src, 'keep me');
    makeTask(paths.taskDir, 'T8');

    saveOutput(paths, { sourcePath: src, taskId: 'T8' });

    expect(existsSync(src)).toBe(true);
  });

  it('appends to existing task.outputs without overwriting', () => {
    const src1 = join(srcDir, 'a.txt');
    const src2 = join(srcDir, 'b.txt');
    writeFileSync(src1, 'A');
    writeFileSync(src2, 'B');
    makeTask(paths.taskDir, 'T9');

    saveOutput(paths, { sourcePath: src1, taskId: 'T9' });
    saveOutput(paths, { sourcePath: src2, taskId: 'T9' });

    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'T9.json'), 'utf-8'));
    expect(task.outputs).toHaveLength(2);
  });

  it('resolves filename collisions: appends -1 before extension', () => {
    const src1 = join(srcDir, 'report.txt');
    const src2 = join(srcDir, 'other', 'report.txt');
    mkdirSync(join(srcDir, 'other'), { recursive: true });
    writeFileSync(src1, 'first');
    writeFileSync(src2, 'second');
    makeTask(paths.taskDir, 'T10');

    const r1 = saveOutput(paths, { sourcePath: src1, taskId: 'T10' });
    const r2 = saveOutput(paths, { sourcePath: src2, taskId: 'T10' });

    expect(r1.targetPath).toMatch(/report\.txt$/);
    expect(r2.targetPath).toMatch(/report-1\.txt$/);
    expect(existsSync(r1.targetPath)).toBe(true);
    expect(existsSync(r2.targetPath)).toBe(true);
  });

  it('throws when the source file does not exist', () => {
    makeTask(paths.taskDir, 'T11');
    expect(() =>
      saveOutput(paths, { sourcePath: join(srcDir, 'ghost.txt'), taskId: 'T11' }),
    ).toThrow(/Source file not found/);
  });

  it('throws when the task does not exist', () => {
    const src = join(srcDir, 'file.txt');
    writeFileSync(src, 'data');
    expect(() =>
      saveOutput(paths, { sourcePath: src, taskId: 'NONEXISTENT' }),
    ).toThrow(/Task not found/);
  });
});
