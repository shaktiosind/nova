# Contributing to Nova

Thank you for helping improve Nova.

## Before you start

Nova is intentionally beginner-friendly. Contributions should prefer clear,
predictable behavior over additional syntax or unnecessary complexity.

## Development setup

Requirements:

- Node.js 16 or newer
- npm 7 or newer

Install dependencies and run the test suite:

```bash
npm install
npm test
```

Build only:

```bash
npm run build
```

Run the REPL:

```bash
npm start
```

## Pull requests

Please include:

1. A short explanation of the change.
2. Tests for new or changed behavior.
3. Documentation updates when language behavior changes.
4. No unrelated formatting or refactoring.

If a change affects Nova syntax or semantics, explain the beginner-facing
reason for the change and provide at least one example.

## Language design rule

The default question for a proposed feature is:

> Does this make Nova substantially more useful without making the language
> substantially harder to learn?

If the answer is unclear, discuss the idea before implementing it.