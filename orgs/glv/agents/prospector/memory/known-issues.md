# Known Issues

## Mid-session CronCreate reliability (observed 2026-04-22)

**Symptom:** CronCreate jobs created after session start appear in CronList but never fire. Session-start crons (registered before first user interaction) fire reliably.

**Affected crons:** 521ba184, f3a1f001, 55ac4745, dc76916f (all created mid-session, all listed, none fired)

**Unaffected:** 39d142ba (internal-email, hourly), f034e4be (outreach-conversion), 32d0adac (reply-rate) — all set up at session start, all fire reliably.

**Workaround:** ScheduleWakeup-based loop as fallback for heartbeat. `update-heartbeat` writes to heartbeat.json correctly so the agent is operationally healthy; gap alerts from the detector are informational noise.

**Impact:** Gap detector fires [SYSTEM] alerts every ~10 min. Agent health unaffected — heartbeat.json is current.

**Next step:** On next session restart, heartbeat cron will be restored from config.json at session start and should fire normally.
