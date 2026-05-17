/**
 * Shared agent-browser helpers for social analytics scrapers.
 *
 * agent-browser is invoked as a subprocess using a persistent named session
 * so platform logins survive between scrape runs. Session path:
 *   ~/.cache/agent-browser/sessions/glv-socials
 */
import { execFileSync, execFile } from 'child_process';
import { promisify } from 'util';
import { logAbCall } from '../logger.js';

const execFileAsync = promisify(execFile);

export const SESSION = 'glv-socials';
const AB_TIMEOUT_MS = 60_000;

export interface ABResult {
  stdout: string;
  stderr: string;
}

/** Run a single agent-browser command and return stdout. Throws on non-zero exit. */
export function abSync(args: string[]): string {
  return execFileSync('agent-browser', ['--session', SESSION, ...args], {
    timeout: AB_TIMEOUT_MS,
    encoding: 'utf-8',
  }).toString().trim();
}

/** Run a single agent-browser command async. Logs invocation + any stderr. */
export async function ab(args: string[]): Promise<ABResult> {
  const start = Date.now();
  try {
    const { stdout, stderr } = await execFileAsync(
      'agent-browser',
      ['--session', SESSION, ...args],
      { timeout: AB_TIMEOUT_MS },
    );
    const durationMs = Date.now() - start;
    if (stderr.trim()) {
      logAbCall({ ts: new Date().toISOString(), command: args, durationMs, exitCode: 0, stderr: stderr.trim() });
    }
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    const exitCode = (err as { code?: number }).code ?? 1;
    const stderr = (err as { stderr?: string }).stderr ?? String(err);
    logAbCall({ ts: new Date().toISOString(), command: args, durationMs, exitCode, stderr });
    throw err;
  }
}

/**
 * Run JavaScript in the current page context and return the result as a
 * parsed JSON value. Uses agent-browser's `evaluate` command which prints
 * the return value to stdout as JSON.
 */
export async function evaluate<T>(js: string): Promise<T | null> {
  try {
    const { stdout } = await ab(['evaluate', js]);
    return JSON.parse(stdout) as T;
  } catch {
    return null;
  }
}

/** Navigate to URL and wait for network idle. */
export async function goto(url: string): Promise<void> {
  await ab(['open', url]);
}

/** Wait for a selector to appear (up to timeout). */
export async function waitFor(selector: string, timeoutMs = 10_000): Promise<void> {
  await ab(['wait-for', selector, `--timeout=${timeoutMs}`]);
}

/** Parse a compact number string like "1.2K", "4.5M", "12,345" → number | null */
export function parseCompact(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const s = raw.trim().replace(/,/g, '').toUpperCase();
  const m = s.match(/^([\d.]+)([KMB]?)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (isNaN(n)) return null;
  const mult = m[2] === 'K' ? 1_000 : m[2] === 'M' ? 1_000_000 : m[2] === 'B' ? 1_000_000_000 : 1;
  return Math.round(n * mult);
}
