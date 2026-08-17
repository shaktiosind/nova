# Nova

> A simple, readable programming language designed to take beginners from their first program to real software projects.

**Nova 2.0.1 — Runtime Hardening Release**

Nova is an indentation-based, dynamically typed programming language with functions, closures, classes, pattern matching, pipelines, and a batteries-included runtime.

## v2.0.1 highlights

Nova keeps the beginner-friendly language surface while adding practical application capabilities:

- Filesystem and JSON APIs
- SQLite database APIs
- HTTP client and server APIs
- HTML/GUI builders
- Helpful function-argument and runtime diagnostics
- Safe mode for untrusted source
- Descending ranges and corrected short-circuit evaluation
- Improved CLI and REPL
- 15-test regression suite

## Quick start

```bash
npm install
npm run build
nova examples/hello.nv
```

Start the REPL:

```bash
nova repl
```

Check syntax without running:

```bash
nova check examples/hello.nv
```

Run untrusted code without native application capabilities:

```bash
nova --safe program.nv
```

## Example

```nova
let numbers = [1, 2, 3, 4, 5]

fn square(x):
  return x * x

print(numbers.map(square))
```

## Application APIs

No imports are required for common native APIs:

```nova
let text = fs_read("data.txt")
let data = json_read("data.json")

let db = db_open("app.db")
let rows = db_query(db, "SELECT * FROM users")
db_close(db)

let response = http_get("https://example.com")
```

HTML can be generated directly:

```nova
let page = gui_page("Hello", gui_h1("Hello from Nova"))
gui_save("hello.html", page)
```

GUI text is escaped by default; trusted HTML requires explicit `gui_raw()`.

## Project structure

- `src/` — lexer, parser, AST, interpreter, runtime and native standard library
- `examples/` — example Nova programs
- `tests/` — regression tests
- `docs/` — language and release documentation
- `dist/` — built JavaScript distribution

## Design principle

**Keep the language simple. Make the runtime powerful.**

Nova is intended to let a beginner learn a small set of concepts and then use the same language to build useful scripts and small applications.

## License

MIT

## Contributing

Contributions, examples, bug reports and language-design discussions are welcome. See `CONTRIBUTING.md` for guidelines.
