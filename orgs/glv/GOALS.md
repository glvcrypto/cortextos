# GLV Marketing — Organization Goals

> Auto-generated from canonical memory (`project_glv_goals.md`, dated 2026-05-12). To regenerate, update the memory file then re-run.

## North Star

Improve the system to run at **95% working / 5% human intervention**. The system will never be fully autonomous on client work — human-in-the-loop stays on client deliverables. The primary business goal is to grow clients and optimize the system to be as clean as possible.

## Top Goals

### 1. System optimization to 95/5 working/intervention ratio
The fleet runs at high autonomy with reliable 5% human gates on client work, agent error handling, and edge cases. No client deliverable ships without a human touch, but no human time goes to plumbing, routing, or fleet-internal coordination.

### 2. Client growth
Sustained acquisition pipeline, retention quality on existing retainers, and a scalable delivery system that handles **any business at any time**. The delivery system that handles the current cohort should handle the next 4 clients without bespoke rework.

### 3. System cleanliness
Fleet processes, SOPs, and agent skills work generalizably across any client. No client-specific code, memory, or routing baked into the framework. Workflows are designed for "any business at any time" — current clients are instances, not the design target.

## How to Apply

- When proposing agent work, bias toward anything that compounds these three goals.
- **Generalize, don't client-specific.** When building features, skills, or SOPs, design for "any business at any time." If a workflow only makes sense for one client, that's a smell — refactor before extending.
- Client work always has a human gate. System work (infra, agent improvements, framework patches) can be more autonomous.
- The prospector agent is the canonical outreach path. No legacy prospecting workflows referenced.
- Current client status, deliverable pipelines, and retainer-level snapshots live in a separate client-status tracker — not in GOALS.md.
