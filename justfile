# https://github.com/casey/just

set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# List recipes (default)
_:
    @just --list

# Install dependencies
install:
    bun install

# Run the CLI entrypoint
run *ARGS:
    bun ./src/index.tsx {{ARGS}}

# Run entrypoint and restart on file changes
dev *ARGS:
    bun --watch ./src/index.tsx {{ARGS}}

# Run tests
test *ARGS:
    bun test ./src {{ARGS}}

# Typecheck without emitting (uses tsconfig.json)
typecheck:
    bun x tsc --noEmit

# Run typecheck and tests
check: typecheck test

# Produce a standalone binary under dist/ (see package name / platform)
build-bin:
    mkdir -p dist
    bun build ./src/index.tsx --compile --outfile=dist/ink-cli-demo

# Produce a 
bundle:
    mkdir -p dist
    bun build ./src/index.tsx --target=bun --outfile=dist/ink-cli-demo.js
