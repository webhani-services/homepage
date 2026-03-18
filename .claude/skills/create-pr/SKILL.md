---
name: create-pr
description: Commit changes and create a draft PR following the PR template
allowed tools: Bash, Read, Glob, Grep
---

# Create PR

Commit changes and create a draft PR following the PR template.

## Context

- Changed files: !`git status --short`
- Current branch: !`git branch --show-current`
- Commit history (diff from base branch): !`git log --oneline develop..HEAD 2>/dev/null || git log --oneline main..HEAD 2>/dev/null`
- File diff summary: !`git diff develop --stat 2>/dev/null || git diff main --stat 2>/dev/null`

## Task

Follow the steps below to commit and create a PR.

### 0. Determine Base Branch

- If a base branch is specified in `$ARGUMENTS`, use it; otherwise, use `develop`
- **Use this determined base branch consistently throughout all subsequent steps**

### 1. Check Uncommitted Changes

- Check uncommitted changes with `git status` and `git diff`
- If there are uncommitted changes:
  - Split changes into appropriate units (by feature/purpose) and create commits
  - Write commit messages that clearly describe the purpose of each change
- If there are no uncommitted changes: skip this step

### 2. Push to Remote

- Push to remote with `git push -u origin HEAD`

### 3. Create PR

- Read `.github/pull_request_template.md` and create the PR description following the template
- Write each section based on all commits from the base branch (`git log <base-branch>..HEAD`)
- If there are no UI changes, write "N/A" in the screenshot section
- Create a **draft** PR with `gh pr create --draft --base <base-branch>`
- Display the PR URL after creation

### 4. Completion Report

- Display the created PR URL
- Show a summary of the number of commits and file changes

## Notes

- Follow any additional instructions in `$ARGUMENTS`
- Pass the PR body via HEREDOC to prevent formatting issues
