'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconPlugConnected, IconRefresh, IconTrash, IconPlus, IconRotateClockwise2, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface McpServer {
  name: string;
  type: string;
  url?: string;
  command?: string;
  args?: string[];
  enabled: boolean;
}

interface AgentMcpConfig {
  agent: string;
  org: string;
  servers: McpServer[];
  filePath: string | null;
}

interface RestartBanner {
  agents: string[];
  reason: string;
}

export default function McpPage() {
  const [configs, setConfigs] = useState<AgentMcpConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [restartBanner, setRestartBanner] = useState<RestartBanner | null>(null);
  const [restarting, setRestarting] = useState<Set<string>>(new Set());

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<{ org: string; agent: string } | null>(null);
  const [addForm, setAddForm] = useState({ name: '', type: 'http', url: '', command: '' });
  const [addError, setAddError] = useState('');

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mcp');
      if (res.ok) setConfigs(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  // Only show agents that have servers or are "interesting" (skip empty unknown agents)
  const withServers = configs.filter((c) => c.servers.length > 0);
  const withoutServers = configs.filter((c) => c.servers.length === 0);

  async function handleDelete(org: string, agent: string, serverName: string) {
    const res = await fetch('/api/mcp', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ org, agent, name: serverName }),
    });
    if (res.ok) {
      await fetchConfigs();
      setRestartBanner({ agents: [agent], reason: `Removed MCP server "${serverName}"` });
    }
  }

  async function handleAdd() {
    if (!addTarget) return;
    setAddError('');

    if (!addForm.name.trim()) { setAddError('Name is required'); return; }
    if (addForm.type === 'http' && !addForm.url.trim()) { setAddError('URL is required for HTTP type'); return; }
    if (addForm.type === 'stdio' && !addForm.command.trim()) { setAddError('Command is required for stdio type'); return; }

    const config: Record<string, unknown> = { type: addForm.type };
    if (addForm.type === 'http') config.url = addForm.url;
    if (addForm.type === 'stdio') {
      const parts = addForm.command.trim().split(' ');
      config.command = parts[0];
      if (parts.length > 1) config.args = parts.slice(1);
    }

    const res = await fetch('/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ org: addTarget.org, agent: addTarget.agent, name: addForm.name, config }),
    });

    if (res.ok) {
      setAddDialogOpen(false);
      setAddForm({ name: '', type: 'http', url: '', command: '' });
      await fetchConfigs();
      setRestartBanner({ agents: [addTarget.agent], reason: `Added MCP server "${addForm.name}"` });
    } else {
      setAddError('Failed to save — check server logs');
    }
  }

  async function handleRestart(agents: string[], idle = false) {
    setRestarting(new Set(agents));
    try {
      const reason = idle
        ? 'MCP config updated (idle-only restart)'
        : 'MCP config updated via dashboard';
      await fetch('/api/mcp/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agents, reason }),
      });
    } catch { /* silent */ }
    finally {
      setRestarting(new Set());
      setRestartBanner(null);
    }
  }

  function openAddDialog(org: string, agent: string) {
    setAddTarget({ org, agent });
    setAddForm({ name: '', type: 'http', url: '', command: '' });
    setAddError('');
    setAddDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Restart banner */}
      {restartBanner && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          <div>
            <span className="font-medium text-amber-700 dark:text-amber-400">MCP config changed.</span>
            <span className="ml-1.5 text-muted-foreground">
              {restartBanner.agents.join(', ')} must restart to pick up changes.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => handleRestart(restartBanner.agents)}
              disabled={restarting.size > 0}
            >
              <IconRotateClockwise2 size={13} className="mr-1.5" />
              Restart Affected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRestart(restartBanner.agents, true)}
              disabled={restarting.size > 0}
            >
              Restart When Idle
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setRestartBanner(null)}
            >
              <IconX size={14} />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">MCP Servers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Model Context Protocol servers configured per agent
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchConfigs} disabled={loading}>
          <IconRefresh size={15} className={cn('mr-1.5', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Agents with servers */}
          {withServers.map((cfg) => (
            <Card key={`${cfg.org}/${cfg.agent}`}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                    {cfg.agent.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{cfg.agent}</span>
                  <span className="text-xs text-muted-foreground">{cfg.org}</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {cfg.servers.length}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openAddDialog(cfg.org, cfg.agent)}
                >
                  <IconPlus size={13} className="mr-1" />
                  Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {cfg.servers.map((srv) => (
                  <div
                    key={srv.name}
                    className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconPlugConnected
                        size={14}
                        className={cn(
                          'shrink-0',
                          srv.enabled ? 'text-green-500' : 'text-muted-foreground/50'
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{srv.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {srv.type}
                          {srv.url ? ` · ${srv.url}` : ''}
                          {srv.command ? ` · ${srv.command}` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(cfg.org, cfg.agent, srv.name)}
                      className="ml-2 shrink-0 rounded p-1 text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <IconTrash size={13} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Agents without servers — collapsed list */}
          {withoutServers.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                No servers configured
              </p>
              <div className="flex flex-wrap gap-2">
                {withoutServers.map((cfg) => (
                  <button
                    key={`${cfg.org}/${cfg.agent}`}
                    onClick={() => openAddDialog(cfg.org, cfg.agent)}
                    className="flex items-center gap-1.5 rounded-md border border-dashed px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                  >
                    <IconPlus size={11} />
                    {cfg.agent}
                  </button>
                ))}
              </div>
            </div>
          )}

          {configs.length === 0 && (
            <div className="py-16 text-center">
              <IconPlugConnected size={32} className="mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No agents found.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Server Dialog */}
      {addDialogOpen && addTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setAddDialogOpen(false); }}
        >
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Add MCP Server to {addTarget.agent}</h2>
              <button onClick={() => setAddDialogOpen(false)} className="text-muted-foreground hover:text-foreground">
                <IconX size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Server Name</label>
                <input
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. supabase, slack"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                <div className="flex gap-2">
                  {['http', 'stdio'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAddForm((f) => ({ ...f, type: t }))}
                      className={cn(
                        'flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors',
                        addForm.type === t
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {addForm.type === 'http' && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">URL</label>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://mcp.example.com/api"
                    value={addForm.url}
                    onChange={(e) => setAddForm((f) => ({ ...f, url: e.target.value }))}
                  />
                </div>
              )}

              {addForm.type === 'stdio' && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Command</label>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="npx @modelcontextprotocol/server-name"
                    value={addForm.command}
                    onChange={(e) => setAddForm((f) => ({ ...f, command: e.target.value }))}
                  />
                </div>
              )}

              {addError && (
                <p className="text-xs text-destructive">{addError}</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAdd}>
                  <IconPlus size={13} className="mr-1.5" />
                  Add Server
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
