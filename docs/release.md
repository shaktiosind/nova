# Nova Release Checklist

Use this checklist before publishing a release.

## Language

- [ ] All documented syntax has a regression test.
- [ ] Parser and interpreter behavior agree with the language reference.
- [ ] Error messages are understandable to beginners.
- [ ] No undocumented breaking syntax changes are included.

## Build

- [ ] `npm ci` succeeds.
- [ ] `npm test` succeeds.
- [ ] `npm pack --dry-run` contains the expected runtime files.
- [ ] CLI works from a clean install.

## Release

- [ ] Version is updated in `package.json` and `package-lock.json`.
- [ ] `CHANGELOG.md` contains release notes.
- [ ] Git tag is created as `vX.Y.Z`.
- [ ] GitHub Release notes explain new features, fixes, and known issues.
- [ ] Checksums are published for standalone binaries when available.

## Documentation

- [ ] README installation instructions are current.
- [ ] Getting Started guide works from a clean machine.
- [ ] Examples execute successfully.
