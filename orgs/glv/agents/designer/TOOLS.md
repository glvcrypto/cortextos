# Tools Quick Reference

All cortextOS commands: `cortextos bus <command>`. Full docs in skill files — load the relevant skill when you need details on a workflow.

---

## Environment Variables

| Variable | Source | Value |
|---|---|---|
| `CTX_AGENT_NAME` | daemon | Your agent name |
| `CTX_ORG` | daemon | Org name |
| `CTX_ROOT` | daemon | `~/.cortextos/{instance}` |
| `CTX_FRAMEWORK_ROOT` | daemon | Framework repo root |
| `CTX_TELEGRAM_CHAT_ID` | agent .env | Your Telegram chat ID |
| `ANTHROPIC_API_KEY` | shell profile | Never stored in a file |
| `CLAUDE_CODE_OAUTH_TOKEN` | agent .env | Bearer token for this session |

Shared secrets (all agents): `orgs/{org}/secrets.env`
Agent secrets: `orgs/{org}/agents/{agent}/.env`

---

## Command Index

### Tasks — full docs: `.claude/skills/tasks/SKILL.md`
| Command | What it does |
|---|---|
| `create-task "<title>" --desc "<desc>"` | Create a task (visible on dashboard) |
| `update-task <id> <status>` | Update status: pending / in_progress / blocked / completed |
| `complete-task <id> --result "<what>"` | Mark done with result |
| `list-tasks [--status S] [--agent A] [--all-orgs]` | List / filter tasks |
| `check-stale-tasks [--all-orgs]` | Find tasks stale >2h in_progress or >24h pending |
| `check-human-tasks` | Check for stale human-assigned tasks |
| `archive-tasks [--dry-run] [--all-orgs]` | Archive completed tasks >7d |

### Messages — full docs: `.claude/skills/comms/SKILL.md`
| Command | What it does |
|---|---|
| `send-message <agent> <priority> '<text>' [reply_to]` | Send to another agent |
| `check-inbox` | Check incoming messages (run every heartbeat) |
| `ack-inbox "<msg_id>"` | ACK a message (un-ACK'd re-deliver after 5 min) |
| `notify-agent <agent> "<msg>"` | Urgently signal agent's fast-checker |

### Telegram — full docs: `.claude/skills/comms/SKILL.md`
| Command | What it does |
|---|---|
| `send-telegram <chat_id> "<msg>"` | Message the user |
| `send-telegram <chat_id> "<caption>" --image <path>` | Send a photo |
| `send-telegram <chat_id> "<caption>" --file <path>` | Send any file (PDF, txt, etc.) |
| `edit-message <chat_id> <msg_id> "<text>"` | Edit an existing message |
| `answer-callback <query_id> [toast]` | Dismiss button loading state |
| `post-activity "<msg>"` | Post to org activity channel |

### Events & Heartbeat — full docs: `.claude/skills/heartbeat/SKILL.md`
| Command | What it does |
|---|---|
| `log-event <category> <name> <severity> --meta '<json>'` | Log structured event |
| `update-heartbeat "<task summary>"` | Prove you're alive to the dashboard |
| `read-all-heartbeats [--format json\|text]` | Aggregate fleet heartbeats |
| `recall-facts [--days 3]` | Recall session facts extracted at compaction (cross-session memory) |
| `tui-stream [--session <name>] [--telegram] [--dry-run]` | Stream TUI tool activity to event log and Telegram |

### Approvals — full docs: `.claude/skills/approvals/SKILL.md`
| Command | What it does |
|---|---|
| `create-approval "<title>" <category> "[context]"` | Request human approval |
| `update-approval <id> <approved\|rejected> "[note]"` | Resolve an approval |
| `list-approvals [--status S] [--all-orgs]` | List approvals |

### Knowledge Base — full docs: `.claude/skills/knowledge-base/SKILL.md`
| Command | What it does |
|---|---|
| `kb-query "<question>" --org $CTX_ORG` | Semantic search |
| `kb-ingest <path> --org $CTX_ORG --scope private\|shared` | Index files into KB |
| `kb-collections --org $CTX_ORG` | List available collections |

### Discovery & Fleet
| Command | What it does |
|---|---|
| `list-agents [--org O] [--format json\|text]` | All agents in system |
| `list-skills [--format text\|json]` | Skills available to this agent |
| `check-goal-staleness [--threshold DAYS]` | Flag agents with stale GOALS.md |

### Lifecycle
| Command | What it does |
|---|---|
| `self-restart --reason "<why>"` | Restart with --continue (keeps history) |
| `hard-restart --reason "<why>"` | Fresh session (no history) |
| `auto-commit [--dry-run]` | Daily workspace snapshot (local only) |
| `check-upstream [--apply]` | Check for framework updates |

### Goals
| Command | What it does |
|---|---|
| `cortextos goals generate-md --agent <name> --org <org>` | Rebuild GOALS.md from goals.json |

### Experiments (Theta Wave) — full docs: `.claude/skills/autoresearch/SKILL.md`
| Command | What it does |
|---|---|
| `create-experiment <metric> "<hypothesis>"` | Propose a new experiment |
| `run-experiment <id> [description]` | Start running a proposed experiment |
| `evaluate-experiment <id> <value>` | Score a running experiment |
| `list-experiments [--agent A] [--status S]` | List experiments |
| `gather-context [--agent A] [--format json\|markdown]` | Collect experiment context |

### Reminders
| Command | What it does |
|---|---|
| `create-reminder "<fire_at>" "<prompt>"` | Persistent reminder (survives hard-restart) |
| `list-reminders [--all]` | List pending reminders |
| `ack-reminder <id>` | Acknowledge a fired reminder |
| `prune-reminders [--days N]` | Clean up old acked reminders |

### OAuth Token Rotation — full docs: `.claude/skills/oauth-rotation/SKILL.md`
| Command | What it does |
|---|---|
| `check-usage-api [--force]` | Fetch 5h/7d utilization (3-min cache) |
| `refresh-oauth-token [--account <name>]` | Exchange refresh token (atomic write) |
| `rotate-oauth [--force] [--agent A] [--reason R]` | Rotate active account if thresholds met |
| `list-oauth-accounts` | Show all accounts with utilization + expiry |

### Worker Sessions — full docs: `.claude/skills/worker-agents/SKILL.md`
| Command | What it does |
|---|---|
| `cortextos spawn-worker <name> --dir <path> --prompt "<text>"` | Spawn ephemeral Claude Code session |
| `cortextos list-workers` | Show active/recent worker sessions |
| `cortextos inject-worker <name> "<text>"` | Inject text into running worker (nudge) |
| `cortextos terminate-worker <name>` | Stop a worker session |

### Community Ecosystem
| Command | What it does |
|---|---|
| `browse-catalog [--type skill\|agent\|org]` | Browse community catalog |
| `install-community-item <name>` | Install a catalog item |
| `prepare-submission <type> <path> <name>` | Stage for community submission |
| `submit-community-item <name> <type> "<desc>"` | Submit to catalog |

---

## Tools Available in This Session

### Windows Chrome via WSL interop (fleet standard for screenshots)
This is the runtime browser for the GLV fleet on this WSL2 box. Playwright's bundled Chromium is NOT used (missing Linux libs, unnecessary install burden). Use this pattern for any one-shot public-page screenshot.

Binary path: `/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`

Standard temp dir (exists, shared across fleet):
- Windows path (use in --screenshot arg, Chrome runs as Windows process): `C:\Users\joshu\AppData\Local\Temp\glv-screenshots\`
- WSL read path (use to Read the output): `/mnt/c/Users/joshu/AppData/Local/Temp/glv-screenshots/`

⚠️ SPA WARNING — READ BEFORE SCREENSHOTTING ANY MODERN SITE
If the page is rendered by a JS framework (React/Vue/Svelte/Next/etc.), a plain headless capture WILL return only the loading state (blank page or spinner). You must add `--virtual-time-budget=12000` so Chrome advances the page's JS clock up to 12s and lets the framework mount before capture. Rule of thumb: if the resulting PNG is <20KB on a modern site, you hit this. Soosackers.com returned 7KB (spinner only) on first pass — 326KB (fully rendered) after the flag was added. Default to including this flag unless you have a reason not to.

One-shot headless screenshot (safe default — includes SPA budget):
```bash
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless --disable-gpu --no-sandbox \
  --virtual-time-budget=12000 \
  --screenshot="C:\\Users\\joshu\\AppData\\Local\\Temp\\glv-screenshots\\name.png" \
  --window-size=1440,900 \
  https://example.com
# Then Read /mnt/c/Users/joshu/AppData/Local/Temp/glv-screenshots/name.png
```

Tool-split convention:
- Raw `chrome.exe --headless --screenshot` → ONE-SHOT public-page screenshots (no auth)
- `agent-browser` (below) with session vault → ANY flow requiring auth
- NEVER embed credentials in URLs (basic-auth shortcut); vault path only
- NEVER pass secrets as CLI args or env vars exposed in /proc — vault only

### agent-browser (interactive / authenticated flows)
- `agent-browser` CLI (Rust binary, npm-installed globally) drives Chrome via CDP
- Snapshot-then-ref interaction pattern: `agent-browser snapshot` returns an a11y tree with refs (e1, e2, ...), then `agent-browser click @e1` / `fill @e2 "text"` operate by ref
- Loaded via `.claude/skills/agent-browser/SKILL.md` — that skill says to run `agent-browser skills get <name>` for current command syntax (workflow docs are versioned with the binary, so always fetch fresh)
- Quick verify: `agent-browser open https://example.com && agent-browser get title && agent-browser close`
- For auth'd flows: launch Windows Chrome with `--remote-debugging-port=9222` then `agent-browser connect http://localhost:9222`
- Dashboard E2E tests still use Playwright DIRECTLY (different surface) — agent-browser only replaces the agent-facing browser MCP layer that was previously `mcp__plugin_playwright_*`

### Peekaboo (macOS Desktop Automation)
- `peekaboo image` (screenshot), `peekaboo list` (apps), `peekaboo run <script>`
- Screen Recording + Accessibility permissions granted
- `peekaboo learn` for full usage guide

### gogcli (Google Workspace)
- Binary: `gog` (v0.12.0 at `/opt/homebrew/bin/gog`)
- Gmail, Calendar, Drive, Contacts, Tasks, Sheets, Docs
- Accounts: configure your Google accounts in your agent's `.env` or org `secrets.env`
- `gog gmail search "query" --max 10 -a you@gmail.com`
- `gog calendar ls -a you@gmail.com --max 5`
- Use `gog` instead of Gmail/Calendar MCP — more capable (send, archive, labels)
