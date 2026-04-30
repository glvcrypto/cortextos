---
name: git
description: Interactive git workflow — branching, previewing, diffing, and deploying projects. Use when user says /git or needs to manage branches, preview builds, check status, or deploy code. Works with any repo.
---

# Git Workflow Skills

> Universal git workflow commands that work in any repo. Explains everything in plain English.

## Trigger

- User types `/git:<command>`
- User asks about branches, deployments, diffs, or project builds
- User wants to preview changes before going live

---

## Subcommands

### `/git:branch <name>`

Create and switch to a new branch.

**Steps:**
1. Detect current working repo (check for `.git` directory, walk up if needed)
2. Show current branch name
3. Create new branch from current branch: `git checkout -b <name>`
4. Confirm: "You're now on branch `<name>`, branched from `<previous-branch>`. Changes here won't affect `<previous-branch>` until you merge."

**If no name provided:** Ask what the branch is for, suggest a name like `feature/description` or `fix/description`.

---

### `/git:status`

Plain English summary of the repo state.

**Steps:**
1. Run `git status`, `git branch --show-current`, `git log --oneline -5`
2. Check ahead/behind remote: `git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null`
3. Present in plain English:

**Output format:**
```
Branch: feature/service-pages
Based on: main

Changes:
- 3 files modified (Services.tsx, App.tsx, sitemap.xml)
- 2 new files (services/Marketing.tsx, services/Automation.tsx)
- 1 file deleted (old-component.tsx)

Remote: 2 commits ahead of origin, 0 behind

Recent commits:
1. "Add marketing service page" (10 min ago)
2. "Update routing for service pages" (25 min ago)
```

**Never show raw git output.** Always translate to plain English.

---

### `/git:preview`

Build and preview the project locally.

**Steps:**
1. Detect project type from package.json:
   - Look for `preview` script → use it
   - Look for `dev` script as fallback
   - Check for Vite, Next.js, Gatsby, etc.
2. Run `npm install` if node_modules is missing or stale
3. Run `npm run build` (or equivalent)
4. If build fails: show errors in plain English, suggest fixes
5. Run `npm run preview` (or equivalent)
6. Tell user: "Your site is live at http://localhost:4173 (or whatever port). Open this in your browser to see your changes. Press Ctrl+C in the terminal to stop the preview."

**If no package.json:** Check for other project types (Python, Go, etc.) and adapt.

**Important:** Run the preview server in the background so the user can continue chatting.

---

### `/git:diff [base]`

Show what changed on the current branch vs a base branch.

**Steps:**
1. Determine base branch (default: `main`, or user-specified)
2. Run `git diff <base>...HEAD --stat` for summary
3. Run `git diff <base>...HEAD` for full diff
4. Present in plain English:

**Output format:**
```
Changes on `feature/service-pages` vs `main`:

Files added (3):
- src/pages/services/Marketing.tsx — New marketing service page (145 lines)
- src/pages/services/Automation.tsx — New automation service page (132 lines)
- src/pages/services/CustomAI.tsx — New custom AI service page (128 lines)

Files modified (2):
- src/App.tsx — Added 14 new route definitions
- public/sitemap.xml — Added 14 new URL entries

Files deleted (0): None

Total: +425 lines added, -12 lines removed across 5 files
```

**For large diffs:** Summarise by file, don't dump the full diff unless asked.

---

### `/git:deploy`

Merge current branch into main and push.

**Steps:**
1. Run `/git:status` first — show the state
2. Run `/git:diff` — show what's about to go live
3. **ASK FOR CONFIRMATION:** "This will merge `<branch>` into `main` and push to origin. The changes above will go live. Proceed? (yes/no)"
4. **Only if user confirms:**
   - `git checkout main`
   - `git pull origin main` (get latest)
   - `git merge <branch> --no-ff` (preserve branch history)
   - `git push origin main`
   - Report success: "Deployed. Your changes are now live on main."
5. Ask: "Want to delete the `<branch>` branch? It's no longer needed."

**NEVER proceed without explicit confirmation.**
**NEVER force push.**

---

### `/git:log`

Show recent commit history in plain English.

**Steps:**
1. Run `git log --oneline --graph -15`
2. Show current branch context
3. Present in readable format:

**Output format:**
```
Branch: feature/service-pages (5 commits ahead of main)

Recent commits:
1. "Add FAQ schema to service pages" — 2 hours ago
2. "Add pricing callouts to all service subpages" — 3 hours ago
3. "Create 14 service page components" — 4 hours ago
4. "Update App.tsx routing for service subpages" — 4 hours ago
5. "Create feature branch for service pages" — 5 hours ago
--- merged from main ---
6. "content: services page expansion — 14 pages" — yesterday
```

---

## General Rules

1. **Auto-detect the repo.** Check current directory for `.git`, walk up parents if needed. If not in a repo, ask the user which project they want to work with.
2. **Plain English always.** Never dump raw git output. Translate everything.
3. **No destructive actions without confirmation.** This includes: force push, reset --hard, branch deletion, rebase.
4. **Handle errors gracefully.** If a command fails, explain what went wrong and suggest a fix.
5. **Remember the repo path.** Once detected, use it for all subsequent commands in the session.
