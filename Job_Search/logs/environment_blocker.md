# Environment Blocker Log — 2026-07-12

## Summary
Automated job-posting verification and portal applications were **blocked by the session environment**.
Only web *search* works; web *page access* does not.

## Evidence
| Attempt | Tool | Result |
|--------|------|--------|
| bayt.com Jeddah cyber jobs | WebFetch | HTTP 403 |
| jobleads.com GRC Jeddah posting | WebFetch | HTTP 403 |
| naukrigulf.com Jeddah cyber | WebFetch | HTTP 403 |
| linkedin.com job 4355281779 | WebFetch | HTTP 403 |
| sa.jooble.org Jeddah | WebFetch | HTTP 403 |
| career.elm.sa (fresh graduate + main) | WebFetch | HTTP 403 |
| helpag.com/careers | WebFetch | HTTP 403 |
| boards.greenhouse.io (Deloitte) | WebFetch | HTTP 403 |
| **example.com (control)** | WebFetch | **HTTP 403** |
| curl example.com / career.elm.sa / helpag / bayt | curl | CONNECT tunnel 403 (egress policy) |

The agent proxy status (`/__agentproxy/status`) shows outbound web CONNECTs are denied by the session's
egress policy; only package registries (npm, pypi, etc.) are allowed. `example.com` returning 403 confirms
the block is environmental, not per-site anti-bot.

## Impact on the task
- Cannot verify any posting is currently open.
- Cannot read full posting details (employment type, experience, salary, closing date, recruitment email).
- Cannot open or fill any careers portal → no portal application could be staged to Submit.
- No genuine recruitment email addresses could be obtained; none were fabricated (per rules).

## What was done instead
- WebSearch used to surface real leads + official career-page URLs (see report.md / report.csv).
- CV-derived deliverables produced: 3 Gmail drafts, portal answer pack, screening-question answers,
  cover letter — all reliable without web access.

## To complete end-to-end
Re-run in an environment with normal outbound web access (or perform manually): open each lead, confirm
it is open/entry-level/full-time/Jeddah, capture the recruitment email or portal, then use the prepared
materials to apply.
