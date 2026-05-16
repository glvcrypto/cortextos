import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  getTunnelConfigPath,
  readTunnelConfig,
  writeTunnelConfig,
} from '../../../src/cli/tunnel.js';

describe('getTunnelConfigPath', () => {
  it('returns path under .cortextos/<instance>/tunnel.json in rootDir', () => {
    const result = getTunnelConfigPath('default', '/tmp/test-root');
    expect(result).toBe('/tmp/test-root/.cortextos/default/tunnel.json');
  });

  it('uses custom instance name in path', () => {
    const result = getTunnelConfigPath('staging', '/tmp/test-root');
    expect(result).toBe('/tmp/test-root/.cortextos/staging/tunnel.json');
  });
});

describe('readTunnelConfig', () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'ctx-tunnel-test-'));
  });

  afterEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('returns {} when tunnel.json does not exist', () => {
    const result = readTunnelConfig('default', tmpRoot);
    expect(result).toEqual({});
  });

  it('returns parsed config when tunnel.json exists', () => {
    const configDir = join(tmpRoot, '.cortextos', 'default');
    mkdirSync(configDir, { recursive: true });
    const config = { tunnelId: 'abc-123', tunnelName: 'cortextos', port: 8080 };
    writeFileSync(join(configDir, 'tunnel.json'), JSON.stringify(config), 'utf-8');

    const result = readTunnelConfig('default', tmpRoot);
    expect(result).toEqual(config);
  });

  it('returns {} when tunnel.json contains invalid JSON', () => {
    const configDir = join(tmpRoot, '.cortextos', 'default');
    mkdirSync(configDir, { recursive: true });
    writeFileSync(join(configDir, 'tunnel.json'), 'not valid json', 'utf-8');

    const result = readTunnelConfig('default', tmpRoot);
    expect(result).toEqual({});
  });
});

describe('writeTunnelConfig', () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'ctx-tunnel-test-'));
  });

  afterEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('creates parent dirs and writes tunnel.json', () => {
    const config = { tunnelId: 'xyz-456', tunnelName: 'cortextos', port: 4040 };
    writeTunnelConfig('default', config, tmpRoot);

    const configPath = join(tmpRoot, '.cortextos', 'default', 'tunnel.json');
    expect(existsSync(configPath)).toBe(true);
    const written = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(written).toEqual(config);
  });

  it('overwrites existing config with new values', () => {
    writeTunnelConfig('default', { port: 8080 }, tmpRoot);
    writeTunnelConfig('default', { port: 9090, tunnelId: 'new' }, tmpRoot);

    const configPath = join(tmpRoot, '.cortextos', 'default', 'tunnel.json');
    const written = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(written.port).toBe(9090);
    expect(written.tunnelId).toBe('new');
  });

  it('uses instance name in path', () => {
    writeTunnelConfig('staging', { tunnelUrl: 'https://test.cfargotunnel.com' }, tmpRoot);
    const configPath = join(tmpRoot, '.cortextos', 'staging', 'tunnel.json');
    expect(existsSync(configPath)).toBe(true);
  });
});
