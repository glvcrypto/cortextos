'use client';

import { useEffect, useState, useCallback } from 'react';
import { useOrg } from '@/hooks/use-org';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconTerminal2, IconRefresh, IconSlash } from '@tabler/icons-react';
import { TimeAgo } from '@/components/shared';
import { cn } from '@/lib/utils';

interface CommandEntry {
  id: string;
  agent: string;
  from_name: string;
  text: string;
  timestamp: string;
  is_slash: boolean;
}

const AGENTS = ['all', 'boss', 'dev', 'seo', 'prospector', 'content', 'scout', 'analyst'];

export default function CommandsPage() {
  const { currentOrg: _org } = useOrg();

  const [commands, setCommands] = useState<CommandEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [agentFilter, setAgentFilter] = useState('all');
  const [slashOnly, setSlashOnly] = useState(false);

  const fetchCommands = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (agentFilter !== 'all') params.set('agent', agentFilter);

      const res = await fetch(`/api/commands?${params}`);
      if (res.ok) {
        const json = await res.json();
        setCommands(json.commands ?? []);
        setTotal(json.total ?? 0);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [agentFilter]);

  useEffect(() => {
    fetchCommands();
  }, [fetchCommands]);

  const displayed = slashOnly ? commands.filter((c) => c.is_slash) : commands;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Commands</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Telegram messages received by agents
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchCommands} disabled={loading}>
          <IconRefresh size={15} className={cn('mr-1.5', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {AGENTS.map((a) => (
            <button
              key={a}
              onClick={() => setAgentFilter(a)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                agentFilter === a
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setSlashOnly((v) => !v)}
            className={cn(
              'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              slashOnly
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <IconSlash size={13} />
            /commands only
          </button>
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-muted-foreground">
          {displayed.length} of {total} messages
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="py-16 text-center">
          <IconTerminal2 size={32} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No commands yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Telegram messages arrive here as agents receive them.
          </p>
        </div>
      ) : (
        <div className="grid gap-1.5 max-w-2xl">
          {displayed.map((cmd) => (
            <Card
              key={cmd.id}
              className={cn(
                'transition-colors',
                cmd.is_slash && 'border-primary/20 bg-primary/5'
              )}
            >
              <CardContent className="flex items-start gap-3 py-3">
                <div
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                    cmd.is_slash
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {cmd.agent.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug whitespace-pre-wrap break-words">
                    {cmd.text}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/60">{cmd.agent}</span>
                    <span>from {cmd.from_name}</span>
                    <TimeAgo date={cmd.timestamp} className="text-xs ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
