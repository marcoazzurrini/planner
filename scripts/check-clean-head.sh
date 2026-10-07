#!/usr/bin/env bash
# Runs the CI checks on a clean copy of HEAD, the commit being pushed.
# Ignored, untracked, and uncommitted files, local secrets, and old build
# output cannot make it pass. It also refuses to run when the local Node
# or Bun version differs from the versions CI uses.
set -euo pipefail

root=$(git rev-parse --show-toplevel)
want_node=$(cat "$root/.node-version")
want_bun=$(sed -n 's/.*"packageManager": "bun@\([^"]*\)".*/\1/p' "$root/package.json")
have_node=$(node --version | sed 's/^v//')
have_bun=$(bun --version)

if [ "$have_node" != "$want_node" ] || [ "$have_bun" != "$want_bun" ]; then
  echo "Toolchain differs from CI." >&2
  echo "  Node: have $have_node, CI uses $want_node (.node-version)" >&2
  echo "  Bun:  have $have_bun, CI uses $want_bun (package.json packageManager)" >&2
  exit 1
fi

export CI=true
dir=$(mktemp -d)
trap 'git -C "$root" worktree remove --force "$dir"' EXIT
git -C "$root" worktree add --detach --quiet "$dir" HEAD
cd "$dir"
bun install --frozen-lockfile
bun run check
