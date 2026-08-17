# Nova v2.0.1

Nova v2.0.1 is a runtime-hardening release. The goal is to make Nova substantially more robust without making beginner programs more complicated.

## Highlights

- Real SQLite database handles
- SQL identifier validation
- Safer HTTP client/server runtime
- Request/response limits
- Safe execution mode
- Default HTML escaping
- Explicit trusted HTML via `gui_raw()`
- Correct short-circuit evaluation
- Descending ranges
- Better function-call diagnostics
- Improved CLI and REPL
- 15 regression tests

The complete hardened build was compiled and tested locally. The packaged artifact is available in the ChatGPT conversation as `Nova_Language_v2.0.1_Hardened.zip`.
