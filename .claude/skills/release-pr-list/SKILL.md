---
name: release-pr-list
description: Generate the PR list for a release PR by extracting merged PR numbers from commit headlines, resolving each PR author, grouping entries by author, and updating the target PR description. Use when working on a release PR such as develop to main. Do not use for normal feature PR creation or review comment handling.
allowed tools: Bash, Read, Glob, Grep
---

# Release PR List

Generate the PR list for a release PR and update the PR description.

## Context

- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -5`

## Inputs

- `$ARGUMENTS` must contain the target release PR number
- Example: `301`

## Task

Follow the steps below.

### 1. Identify the target PR

- Read the PR number from `$ARGUMENTS`
- If no PR number is provided, stop and report the missing input

### 2. Collect commit headlines from the release PR

Run:

```bash
gh pr view <PR_NUMBER> --json commits --jq '.commits[].messageHeadline'
```

### 3. Extract merged PR numbers

- Extract every `#<number>` pattern from the commit headlines
- Remove duplicates
- Sort PR numbers in ascending order
- Exclude the release PR number itself if it appears

### 4. Resolve author for each PR

For each extracted PR number, run:

```bash
gh pr view <MERGED_PR_NUMBER> --json author --jq '.author.login'
```

Build entries in this format:

- `#<PR_NUMBER> @<AUTHOR>`

### 5. Group and sort the list

- Group entries by author login
- Sort author groups alphabetically
- Sort PR numbers ascending within each author group

### 6. Update the release PR description

Replace or add a `## PR LIST` section in the target PR description.

Use this format:

```markdown
## PR LIST

- #123 @alice
- #145 @alice
- #130 @bob
```

Prefer `gh pr edit <PR_NUMBER> --body-file - <<'EOF'` so multiline formatting is preserved.

## Decision Rules

- If `gh` is unavailable or unauthenticated, stop and report the blocker.
- If no merged PR numbers can be extracted, stop before editing and report what was found in the commit headlines.
- Preserve the rest of the existing PR description when updating the `## PR LIST` section.
- Do not guess authors. If a PR cannot be resolved, report it clearly instead of writing incomplete data.

## Example Invocations

- `Use $release-pr-list 301 to update the release PR description.`
- `Use $release-pr-list 301 and keep the existing sections untouched except for PR LIST.`
