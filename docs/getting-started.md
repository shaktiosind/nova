# Getting Started with Nova

Nova is a small, readable scripting language. You write source files with the
`.nv` extension and run them with the `nova` command.

## Your first program

Create `hello.nv`:

```nova
print("Hello, World!")
```

Run it:

```bash
nova hello.nv
```

## Variables

```nova
let name = "Alice"
let age = 25

print("Name:", name)
print("Age:", age)
```

Use `let` the first time a variable is created. After that, it can be
reassigned without `let`.

## Conditions

```nova
let score = 78

if score >= 70:
  print("Pass")
else:
  print("Try again")
```

## Functions

```nova
fn add(a, b):
  return a + b

print(add(2, 3))
```

## Lists and pipelines

```nova
let numbers = [1, 2, 3, 4, 5, 6]

let result = numbers
  .filter(fn(x) => x % 2 == 0)
  .map(fn(x) => x * x)

print(result)
```

## REPL

Run Nova without a file to enter the interactive REPL:

```bash
nova
```

Useful commands include `help`, `examples`, `version`, `check`, `run`, and
`exit`.
