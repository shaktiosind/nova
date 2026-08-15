# Nova Changelog

## 1.1.0 — Robust & Beginner-Friendly

### Runtime
- Added clear runtime type validation for arithmetic and numeric functions.
- Fixed `and` / `or` evaluation so the left side runs only once.
- Added descending `range(start, end, step)` support.
- Rejects `range(..., 0)`.
- Added deep equality for maps.
- Added clearer missing/extra/unknown function argument errors.
- Added variable-name suggestions for common typos.
- Imports no longer fail silently; unsupported modules now report an explicit error.

### Language
- Match guards now work with `case x if condition:`.
- Added map patterns.
- Added simple `or` patterns such as `case 1 or 2:`.
- Added expression-bodied functions with `fn name(...) => expression`.
- Multi-line expressions inside `()`, `[]` and `{}` are supported.
- Mixed tabs and spaces in indentation are rejected.

### REPL
- Variables and functions persist between commands.
- Added simple multi-line block entry using `...`.
- Added `help`, `examples`, `version`, `check`, and `run` commands.
- `print` can be passed as a function.

### Quality
- Added a lightweight regression test suite covering core language features and error cases.

### Design principle
Nova 1.1 intentionally focuses on **making the existing language safer and more predictable** instead of adding a large number of new keywords or advanced syntax.