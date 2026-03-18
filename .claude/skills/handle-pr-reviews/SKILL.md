---
name: handle-pr-reviews
description: Review PR comments, fix issues where needed, and reply to each comment
allowed tools: Bash, Read, Edit, Glob, Grep
---

# Handle PR Review Comments

Review PR comments, fix issues where needed, and reply to each comment.

## Context

- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -5`

## Task

Follow the steps below to handle PR review comments.

### 1. Identify PR Number

- If a PR number is specified in `$ARGUMENTS`, use it
- Otherwise, identify the current branch's PR with `gh pr view --json number`

### 2. Retrieve New Comments

- Retrieve PR review comments with `gh api repos/{owner}/{repo}/pulls/{pr}/comments`
- Skip already-addressed comments that contain `<!-- <review_comment_addressed> -->`
- Skip comment threads where you (obtained via `gh api user --jq .login`) have already replied

### 3. Analyze and Fix Comments

For each comment:

1. **Read the comment and determine if a fix is needed**
   - Acknowledgment/approval-only comments (tagged with `review_comment_addressed`) → Skip
   - Comments requesting code changes → Apply the fix
   - Question-only comments → Reply only (no fix needed)

2. **If a fix is needed**
   - Read the target file and identify the problem area
   - Apply the fix
   - Group multiple comments on the same file into a single commit
   - Use commit message format: `fix: summary of the fix`

3. **Commit Rules**
   - 1 comment = 1 commit (group same-file comments into 1 commit)
   - Push to remote after committing

### 4. Reply to Comments

Reply to each comment in the following format:

- **If fixed**: `Fixed: [commit-hash](commit URL)\nDescription of the fix`
- **If no fix needed**: Reply explaining the reason
- **For acknowledged comments**: `Thank you for confirming!`

Reply in thread format (use `in_reply_to_id` to reply to the original comment).

### 5. Final Confirmation

- Report that all comments have been addressed
- Display a list of modified files and commits

## Notes

- PR comment reply API: `gh api repos/{owner}/{repo}/pulls/comments/{in_reply_to_id}/replies -f body="..."`
- Commit URL format: `https://github.com/{owner}/{repo}/pull/{pr}/commits/{full_sha}`
- Follow any additional instructions in `$ARGUMENTS`
