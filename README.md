# Nova

> A simple, readable programming language designed to take beginners from their first program to real software projects.

**Nova 1.1.0 — Developer Preview**

Nova is an indentation-based, dynamically typed programming language with functions, closures, classes, pattern matching, pipelines, and a batteries-included core library.

## Quick start

```nova
fn greet(name):
  print("Hello, " + name + "!")

greet("World")
```

Run a Nova program with:

```bash
nova hello.nv
```

Or start the interactive REPL:

```bash
nova repl
```

## Status

Nova 1.1.0 is a **developer preview**. The core language and interpreter are functional, but the ecosystem is still growing. Modules, package management, networking, databases, and production tooling are planned for future releases.

## Repository

- `src/` — lexer, parser, AST, interpreter and runtime
- `examples/` — example Nova programs
- `tests/` — regression tests
- `docs/` — language documentation
- `dist/` — built JavaScript distribution

## Philosophy

Nova aims to keep the language surface small and approachable while allowing programs to grow in sophistication. Simple things should be simple; complex things should remain possible.

## License

Nova is released under the MIT License.

## Contributing

Contributions, examples, bug reports and language-design discussions are welcome. See `CONTRIBUTING.md` for guidelines.
