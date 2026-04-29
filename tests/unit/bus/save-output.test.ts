import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { saveOutput } from '../../../src/bus/save-output';
import type { BusPaths, Task } from '../../../src/types';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-001',
    title: 'Test Task',
    description: '',
    type: 'agent',
    needs_approval: false,
    status: 'in_progress',
    assigned_to: 'dev',
    created_by: 'dev',
    org: 'glv',
    priority: 'normal',
    project: '',
    kpi_key: null,
    created_at: '2026-04-29T00:00:00Z',
    updated_at: '2026-04-29T00:00:00Z',
    completed_at: null,
    due_date: null,
    archived: false,
    outputs: [],
    ...overrides,
  };
}

describe('saveOutput', () => {
  let testDir: string;
  let paths: BusPaths;
  let sourceFile: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-save-output-test-'));
    paths = {
      ctxRoot: testDir,
      inbox: join(testDir, 'inbox'),
      inflight: join(testDir, 'inflight'),
      processed: join(testDir, 'processed'),
      logDir: join(testDir, 'logs'),
      stateDir: join(testDir, 'state', 'dev'),
      taskDir: join(testDir, 'tasks'),
      approvalDir: join(testDir, 'approvals'),
      analyticsDir: join(testDir, 'analytics'),
      deliverablesDir: join(testDir, 'deliverables'),
    };
    mkdirSync(paths.taskDir, { recursive: true });

    sourceFile = join(testDir, 'source.txt');
    writeFileSync(sourceFile, 'hello deliverable');
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  function writeTask(task: Task) {
    writeFileSync(join(paths.taskDir, `${task.id}.json`), JSON.stringify(task, null, 2));
  }

  it('copies source file into the deliverables tree', () => {
    writeTask(makeTask());
    const result = saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    expect(existsSync(result.targetPath)).toBe(true);
    expect(readFileSync(result.targetPath, 'utf-8')).toBe('hello deliverable');
  });

  it('places the file under {deliverablesDir}/{assignedTo}/{taskId}/', () => {
    writeTask(makeTask({ assigned_to: 'dev' }));
    const result = saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    expect(result.targetPath).toContain(join('deliverables', 'dev', 'task-001'));
  });

  it('stores a forward-slash relative path in storedPath', () => {
    writeTask(makeTask());
    const result = saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    expect(result.storedPath).not.toContain('\\');
    expect(result.storedPath.startsWith('/')).toBe(false); // relative, not absolute
  });

  it('links the output to the task (appends to outputs array)', () => {
    writeTask(makeTask());
    const result = saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    expect(result.linked).toBe(true);
    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'task-001.json'), 'utf-8'));
    expect(task.outputs).toHaveLength(1);
    expect(task.outputs![0].type).toBe('file');
    expect(task.outputs![0].value).toBe(result.storedPath);
  });

  it('uses provided label in outputs entry', () => {
    writeTask(makeTask());
    saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001', label: 'My Report' });
    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'task-001.json'), 'utf-8'));
    expect(task.outputs![0].label).toBe('My Report');
  });

  it('defaults label to the filename when label is omitted', () => {
    writeTask(makeTask());
    saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'task-001.json'), 'utf-8'));
    expect(task.outputs![0].label).toBe('source.txt');
  });

  it('skips task update when noLink is true', () => {
    writeTask(makeTask());
    const result = saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001', noLink: true });
    expect(result.linked).toBe(false);
    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'task-001.json'), 'utf-8'));
    expect(task.outputs ?? []).toHaveLength(0);
    expect(existsSync(result.targetPath)).toBe(true); // file still copied
  });

  it('removes source file when move is true', () => {
    writeTask(makeTask());
    saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001', move: true });
    expect(existsSync(sourceFile)).toBe(false);
  });

  it('preserves source file when move is false (default)', () => {
    writeTask(makeTask());
    saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    expect(existsSync(sourceFile)).toBe(true);
  });

  it('resolves filename collision by appending -1, -2 suffixes', () => {
    writeTask(makeTask());
    const r1 = saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    const r2 = saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    expect(r1.targetPath).not.toBe(r2.targetPath);
    expect(r2.targetPath).toMatch(/source-1\.txt$/);
    expect(existsSync(r1.targetPath)).toBe(true);
    expect(existsSync(r2.targetPath)).toBe(true);
  });

  it('appends to existing outputs without replacing them', () => {
    const existing: Task = makeTask({ outputs: [{ type: 'file', value: 'prior/file.txt', label: 'prior' }] });
    writeTask(existing);
    saveOutput(paths, { sourcePath: sourceFile, taskId: 'task-001' });
    const task: Task = JSON.parse(readFileSync(join(paths.taskDir, 'task-001.json'), 'utf-8'));
    expect(task.outputs).toHaveLength(2);
    expect(task.outputs![0].label).toBe('prior');
  });

  it('throws when source file does not exist', () => {
    writeTask(makeTask());
    expect(() =>
      saveOutput(paths, { sourcePath: join(testDir, 'nonexistent.txt'), taskId: 'task-001' }),
    ).toThrow(/Source file not found/);
  });

  it('throws when task does not exist', () => {
    expect(() =>
      saveOutput(paths, { sourcePath: sourceFile, taskId: 'nonexistent-task' }),
    ).toThrow(/Task not found/);
  });
});
