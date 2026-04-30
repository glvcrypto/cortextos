---
name: coding
description: Protocol for code-related work including development, review, debugging, and documentation. Use when user asks to write, review, or debug code.
---

# Coding Skill

> Protocol for code-related work including development, review, debugging, and documentation.

## Trigger

- User asks to write, review, or debug code
- Task involves development work
- PR review needed
- Manual: "help with [coding task]"

---

## GitHub Integration

**Account:** glvcrypto
**Tool:** git (gh CLI to be installed)

### Common Commands

```bash
# Check auth status
gh auth status

# List repos
gh repo list

# View PR
gh pr view [NUMBER]

# Create PR
gh pr create --title "Title" --body "Description"

# List issues
gh issue list

# View notifications
gh api notifications
```

---

## Code Work Protocol

### Before Writing Code

1. **Understand the task**
   - What problem are we solving?
   - What are the constraints?
   - What does success look like?

2. **Check existing code**
   - Read relevant files first
   - Understand existing patterns
   - Note conventions in use

3. **Plan the approach**
   - For non-trivial changes, outline first
   - Consider edge cases
   - Think about testing
   - **Flag better approaches if spotted** (suggest improvements mode)

### While Writing Code

1. **Match existing style but suggest improvements**
   - Follow project conventions
   - Use consistent naming
   - Match indentation and formatting
   - If a better pattern exists, flag it: "This works, but consider [improvement] because [reason]"

2. **Keep changes focused**
   - One logical change per commit
   - Don't mix refactoring with features
   - Avoid unrelated changes

3. **Write clean code**
   - Self-documenting names
   - Comments only where non-obvious
   - Simple over clever

### After Writing Code

1. **Test the change**
   - Run existing tests
   - Test manually if needed
   - Check edge cases

2. **Review before committing**
   - Re-read the diff
   - Remove debugging code
   - Check for sensitive data

---

## Improvement Suggestions

When spotting opportunities to improve existing code:

```yaml
suggest_when:
  - Pattern could be more maintainable
  - Performance improvement is straightforward
  - Security concern exists
  - Better library/approach available
  - Code duplication detected

suggest_format: |
  "Current approach works, but here's a potential improvement:
  [what] - [why] - [effort level]"

never_refactor_without_asking: true
```

---

## PR Creation Protocol

When creating PRs:

1. Clear, descriptive title (under 70 chars)
2. Summary of what changed and why
3. Test plan or how to verify
4. Keep PRs focused and reviewable

---

## Tech Stack Context

```yaml
primary_tools:
  - Lovable (website builder for clients)
  - WordPress + Elementor (BNS, some clients)
  - n8n (automation workflows)
  - Cloudflare (DNS, Workers, KV, R2, D1)

languages:
  - JavaScript/TypeScript (n8n, Workers)
  - HTML/CSS (client sites)
  - Markdown (documentation, this workspace)
  - Python (automation scripts)

testing:
  - Test on Soo Sackers first before deploying to real clients
```

---

## Autonomy Boundaries

```yaml
autonomous:
  - Read code
  - Research solutions
  - Write code (locally)
  - Run tests
  - Create branches

needs_approval:
  - Create PRs
  - Merge PRs
  - Push to shared branches

never_without_asking:
  - Force push
  - Delete branches
  - Deploy to production
  - Modify CI/CD
```

---

## Configuration

```yaml
github:
  account: glvcrypto
  tool: git

code_style:
  match_existing: true
  suggest_improvements: true
  prefer_simple: true

testing:
  run_before_commit: true
  require_passing: true
  test_site: soosackers.com
```

---

*Code represents ideas made concrete. Write code that's easy to read, understand, and maintain. Flag improvements when you see them.*
