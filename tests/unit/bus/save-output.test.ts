import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { saveOutput } from '../../../src/bus/save-output';
import type { BusPaths, Task } from '../../../src/types';

function makeTask(id: string, assignedTo: string, outputs: Task['outputs'] = []): Task {
  return {
    id,
    title: 'Test task',
    description: '',
    type: 'agent',
    needs_approval: false,
    status: 'in_progress',
    assigned_to: assignedTo,
    created_by: 'test',
    org: 'acme',
    priority: 'medium',
    project: 'proj',
    kpi_key: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    completed_at: null,
    due_date: null,
    archived: false,
    outputs,
  };
}

describe('saveOutput', () => {
  let testDir: string;
  let paths: BusPaths;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-save-output-'));
    mkdirSync(join(testDir, 'tasks'), { recursive: true });
    mkdirSync(join(testDir, 'deliverables'), { recursive: true });
    paths = {
      ctxRoot: testDir,
      inbox: join(testDir, 'inbox'),
      inflight: join(testDir, 'inflight'),
      processed: join(testDir, 'processed'),
      logDir: join(testDir, 'logs'),
      stateDir: join(testDir, 'state'),
      taskDir: join(testDir, 'tasks'),
      approvalDir: join(testDir, 'approvals'),
      analyticsDir: join(testDir, 'analytics'),
      deliverablesDir: join(testDir, 'deliverables'),
    };
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('copies file and links to task outputs', () => {
    const task = makeTask('task-001', 'dev');
    writeFileSync(join(testDir, 'tasks', 'task-001.json'), JSON.stringify(task));
    const src = join(testDir, 'report.pdf');
    writeFileSync(src, 'pdf content');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'task-001' });

    expect(existsSync(result.targetPath)).toBe(true);
    expect(result.linked).toBe(true);
    const updated: Task = JSON.parse(readFileSync(join(testDir, 'tasks', 'task-001.json'), 'utf-8'));
    expect(updated.outputs).toHaveLength(1);
    expect(updated.outputs![0].type).toBe('file');
    expect(updated.outputs![0].label).toBe('report.pdf');
    expect(existsSync(src)).toBe(true);
  });

  it('uses custom label in task.outputs entry', () => {
    writeFileSync(join(testDir, 'tasks', 'task-002.json'), JSON.stringify(makeTask('task-002', 'dev')));
    const src = join(testDir, 'data.csv');
    writeFileSync(src, 'a,b,c');

    saveOutput(paths, { sourcePath: src, taskId: 'task-002', label: 'My Report' });

    const updated: Task = JSON.parse(readFileSync(join(testDir, 'tasks', 'task-002.json'), 'utf-8'));
    expect(updated.outputs![0].label).toBe('My Report');
  });

  it('deletes source file when move=true', () => {
    writeFileSync(join(testDir, 'tasks', 'task-003.json'), JSON.stringify(makeTask('task-003', 'dev')));
    const src = join(testDir, 'temp.txt');
    writeFileSync(src, 'temporary');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'task-003', move: true });

    expect(existsSync(result.targetPath)).toBe(true);
    expect(existsSync(src)).toBe(false);
  });

  it('copies file but skips task link when noLink=true', () => {
    writeFileSync(join(testDir, 'tasks', 'task-004.json'), JSON.stringify(makeTask('task-004', 'dev')));
    const src = join(testDir, 'asset.png');
    writeFileSync(src, 'png data');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'task-004', noLink: true });

    expect(existsSync(result.targetPath)).toBe(true);
    expect(result.linked).toBe(false);
    const updated: Task = JSON.parse(readFileSync(join(testDir, 'tasks', 'task-004.json'), 'utf-8'));
    expect(updated.outputs ?? []).toHaveLength(0);
  });

  it('appends to existing task.outputs array', () => {
    const existing: Task['outputs'] = [{ type: 'file', value: 'prior/file.txt', label: 'Prior' }];
    writeFileSync(join(testDir, 'tasks', 'task-005.json'), JSON.stringify(makeTask('task-005', 'dev', existing)));
    const src = join(testDir, 'second.txt');
    writeFileSync(src, 'content');

    saveOutput(paths, { sourcePath: src, taskId: 'task-005' });

    const updated: Task = JSON.parse(readFileSync(join(testDir, 'tasks', 'task-005.json'), 'utf-8'));
    expect(updated.outputs).toHaveLength(2);
    expect(updated.outputs![0].label).toBe('Prior');
    expect(updated.outputs![1].label).toBe('second.txt');
  });

  it('resolves filename collision by appending -1 suffix', () => {
    writeFileSync(join(testDir, 'tasks', 'task-006.json'), JSON.stringify(makeTask('task-006', 'dev')));
    const destDir = join(testDir, 'deliverables', 'dev', 'task-006');
    mkdirSync(destDir, { recursive: true });
    writeFileSync(join(destDir, 'output.txt'), 'existing');

    const src = join(testDir, 'output.txt');
    writeFileSync(src, 'new content');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'task-006' });

    expect(result.targetPath).toContain('output-1.txt');
    expect(existsSync(result.targetPath)).toBe(true);
  });

  it('resolves double collision to -2 suffix', () => {
    writeFileSync(join(testDir, 'tasks', 'task-007.json'), JSON.stringify(makeTask('task-007', 'dev')));
    const destDir = join(testDir, 'deliverables', 'dev', 'task-007');
    mkdirSync(destDir, { recursive: true });
    writeFileSync(join(destDir, 'img.png'), 'v1');
    writeFileSync(join(destDir, 'img-1.png'), 'v2');

    const src = join(testDir, 'img.png');
    writeFileSync(src, 'v3');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'task-007' });

    expect(result.targetPath).toContain('img-2.png');
  });

  it('throws when source file does not exist', () => {
    writeFileSync(join(testDir, 'tasks', 'task-008.json'), JSON.stringify(makeTask('task-008', 'dev')));
    expect(() =>
      saveOutput(paths, { sourcePath: join(testDir, 'ghost.pdf'), taskId: 'task-008' }),
    ).toThrow('Source file not found');
  });

  it('throws when task JSON does not exist', () => {
    const src = join(testDir, 'real.txt');
    writeFileSync(src, 'data');
    expect(() =>
      saveOutput(paths, { sourcePath: src, taskId: 'nonexistent-task' }),
    ).toThrow('Task not found');
  });

  it('stores storedPath with forward slashes on all platforms', () => {
    writeFileSync(join(testDir, 'tasks', 'task-009.json'), JSON.stringify(makeTask('task-009', 'dev')));
    const src = join(testDir, 'chart.svg');
    writeFileSync(src, '<svg/>');

    const result = saveOutput(paths, { sourcePath: src, taskId: 'task-009' });

    expect(result.storedPath).not.toContain('\\');
    expect(result.storedPath).toContain('/');
  });
});
