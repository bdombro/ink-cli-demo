# ink-cli-demo

A small, end-to-end example of a modern TypeScript CLI that renders an interactive terminal UI. Built with **Bun**, **Ink** (React for the terminal), and **argsbarg** (argv parsing and routing).

The app has one command, `hello`, which greets you by name. If you don't pass `--name`, it opens an Ink-powered list picker so you can choose one interactively.

## Demo

![demo](./demo.svg)

```bash
$ ink-cli-demo hello --name Ada
hello Ada

$ ink-cli-demo hello
Pick a name  ↑/↓  Enter to confirm
> Ada
  Bob
  Chen
  Dana
# (after Enter) → hello Ada

$ ink-cli-demo hello < /dev/null
hello world      # non-TTY fallback

$ ink-cli-demo hello -n Ada -v
verbose mode
hello Ada
```

## Getting started

```bash
just install      # bun install
just run          # run the CLI (no args)
just run -- -n Ada
just dev          # run + watch mode
just test         # run the test suite
just typecheck    # tsc --noEmit
just check        # typecheck + test
just build-bin    # standalone binary → dist/ink-cli-demo
just bundle       # bundled JS → dist/ink-cli-demo.js
```

Pass flags to the app (not `just`) after `--`: `just run -- --help`.

## Single-file version

A self-contained port lives at **[`ink-cli-demo-single-file.tsx`](./ink-cli-demo-single-file.tsx)** — everything (CLI schema, components, entry) collapsed into one file. Useful as a minimum-viable reference or gist. Run it directly:

```bash
bun ./ink-cli-demo-single-file.tsx --name Ada
```

The multi-file version in `src/` is the one to read if you're learning the patterns; the single-file version is the one to copy if you want to bootstrap something tiny.

## What it demonstrates

Four patterns worth stealing:

1. **Separation of concerns.** CLI parsing (argsbarg) is decoupled from rendering (Ink). The handler's only job is to call `render(<Component />)` with parsed options — it doesn't know anything about React, and React components don't know anything about argv.

2. **Component-driven output.** Every byte that reaches the terminal comes from a React component. No `console.log`, no string concatenation in handlers. That means the UI is composable, themeable, and testable the same way a web UI would be.

3. **Graceful degradation.** Interactive TTYs get the rich picker; scripts, CI, and piped invocations get a deterministic default. No ceremony, no errors.

4. **Bun-native.** Source ships as `.ts`/`.tsx`. No build step for development, no transpilation overhead. Tests, typecheck, and builds all go through `bun` directly.

## Structure

```
src/
├── index.tsx              # CLI entry: argsbarg schema + handler → render(<Hello />)
└── pages/hello/
    ├── hello.tsx          # <Hello>: owns state, chooses picker vs greeting
    └── name-picker.tsx    # <NamePicker>: interactive ↑/↓ + Enter list
```

### How it flows

1. `argsbarg` parses argv and dispatches to the `hello` handler.
2. The handler calls `render(<Hello name={...} verbose={...} />).waitUntilExit()`.
3. `<Hello>` holds the `resolvedName` state. If `name` came in via `--name`, it's resolved immediately; otherwise `<NamePicker>` is rendered to collect one.
4. When `resolvedName` becomes non-null, `<Hello>` renders the greeting and calls `useApp().exit()`, which resolves `waitUntilExit()` and ends the process.
5. `<NamePicker>` is pure UI: it takes an `onName` callback, listens for arrow keys and Enter, and reports the choice back to its parent. It has no knowledge of process lifecycle.

### Why callback-based, not `exit()`-based

An earlier draft had `<NamePicker>` pass its value out via Ink's `useApp().exit(value)`. That works, but conflates the picker's job (collect a string) with process lifecycle. The callback version keeps `<NamePicker>` stateless and reusable — you could drop it into a long-running TUI without changes.

## Tech stack

- **[Bun](https://bun.sh)** — runtime, test runner, bundler, package manager
- **[Ink](https://github.com/vadimdemedes/ink)** — React renderer for terminals
- **[argsbarg](https://www.npmjs.com/package/argsbarg)** — argv parsing, routing, help generation
- **React** — component model
- **TypeScript** — strict mode, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`

## Tests

See [`src/index.test.ts`](./src/index.test.ts). The suite spawns the CLI as a subprocess via `Bun.spawnSync` and asserts on exit code and stdout — black-box style, so it catches regressions in both the CLI wiring and the rendered output.
