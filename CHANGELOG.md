# Changelog

## 2.0.1 — Runtime Hardening

- Hardened filesystem, JSON, SQLite, HTTP and GUI runtime APIs.
- Added real database handles and SQL identifier validation.
- Added safer HTTP invocation, validation, limits and server cleanup.
- Added default HTML escaping with explicit `gui_raw()`.
- Added safe runtime mode.
- Fixed `or` evaluation and descending `range()` semantics.
- Added clearer function argument diagnostics.
- Improved CLI and REPL commands.
- Added a 15-case regression suite.

## 2.0.0

- Added filesystem, JSON, SQLite, HTTP and GUI native APIs.

## 1.1.0

- Developer-preview hardening of the core language, interpreter and REPL.
