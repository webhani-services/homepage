#!/bin/bash
set -euo pipefail

# ============================================================
# daily-blog.sh
#
# OpenClaw Scheduler から毎朝実行される Blog 自動生成 Script
# Claude Code CLI を直接起動し、Prompt を渡して実行する
# ============================================================

# === 設定 ===
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
LOG_DIR="${PROJECT_DIR}/logs"
DATE=$(date +%Y-%m-%d)
LOG_FILE="${LOG_DIR}/daily-blog-${DATE}.log"
LOCK_FILE="${LOG_DIR}/.daily-blog.lock"
BRANCH_NAME="blog/daily-${DATE}"
MAX_TURNS=30
TIMEOUT_SECONDS=1800  # 30 分
LOG_RETENTION_DAYS=30

# === PATH 設定 (claude コマンドが見つからない場合に備える) ===
export PATH="$HOME/.claude/bin:$HOME/.local/bin:/usr/local/bin:$PATH"

# === Log Directory 作成 ===
mkdir -p "${LOG_DIR}"

# === Log Rotation (古い Log を削除) ===
find "${LOG_DIR}" -name "daily-blog-*.log" -mtime +${LOG_RETENTION_DAYS} -delete 2>/dev/null || true

# === Lock File による排他制御 ===
if [ -f "${LOCK_FILE}" ]; then
  LOCK_PID=$(cat "${LOCK_FILE}" 2>/dev/null || echo "")
  if [ -n "${LOCK_PID}" ] && kill -0 "${LOCK_PID}" 2>/dev/null; then
    echo "ERROR: Another instance is already running (PID: ${LOCK_PID})" | tee -a "${LOG_FILE}"
    exit 1
  else
    echo "WARNING: Stale lock file found (PID: ${LOCK_PID}), removing..." | tee -a "${LOG_FILE}"
    rm -f "${LOCK_FILE}"
  fi
fi
echo $$ > "${LOCK_FILE}"

# === Cleanup Trap ===
ORIGINAL_BRANCH=""
cleanup() {
  local exit_code=$?
  rm -f "${LOCK_FILE}"

  # 失敗時に master に戻す
  if [ ${exit_code} -ne 0 ] && [ -n "${ORIGINAL_BRANCH}" ]; then
    echo "Restoring branch: ${ORIGINAL_BRANCH}" >> "${LOG_FILE}" 2>&1
    git checkout "${ORIGINAL_BRANCH}" >> "${LOG_FILE}" 2>&1 || true
  fi

  exit ${exit_code}
}
trap cleanup EXIT INT TERM

echo "=== daily-blog: ${DATE} ===" | tee "${LOG_FILE}"
echo "Start: $(date)" | tee -a "${LOG_FILE}"
echo "Project: ${PROJECT_DIR}" | tee -a "${LOG_FILE}"

# === Project Directory に移動 ===
cd "${PROJECT_DIR}"

# === 現在の Branch を記録 ===
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "master")

# === 重複実行チェック (同日 Branch が既に存在するか) ===
if git rev-parse --verify "origin/${BRANCH_NAME}" >/dev/null 2>&1; then
  echo "Branch '${BRANCH_NAME}' already exists on remote. Skipping." | tee -a "${LOG_FILE}"
  exit 0
fi

# === master を最新に更新 ===
echo "Updating master branch..." | tee -a "${LOG_FILE}"
git fetch origin 2>&1 | tee -a "${LOG_FILE}"
git checkout master 2>&1 | tee -a "${LOG_FILE}"
git pull origin master 2>&1 | tee -a "${LOG_FILE}"

# === Claude Code CLI を非 Interactive モードで実行 (Timeout 付き) ===
echo "Starting Claude Code (max-turns: ${MAX_TURNS}, timeout: ${TIMEOUT_SECONDS}s)..." | tee -a "${LOG_FILE}"

gtimeout "${TIMEOUT_SECONDS}" \
claude -p "$(cat <<'PROMPT'
以下の作業を自動で実行してください。ユーザー確認は不要です。すべて自動で判断して進めてください。

## 作業内容

1. Web検索で今日の最新テック ニュースを取得してください。対象分野:
   - Web開発 (React, Next.js, TypeScript, Vercel, python, ruby, go, rust 等)
   - Cloud Infrastructure (AWS, Docker, Kubernetes 等)
   - AI/LLM (Claude, GPT, AI Coding Assistant 等)
   - DevOps / Developer Tooling
   - design pattern (SOLID, DRY, KISS, YAGNI 等)
   - architecture pattern (MVC, MVP, MVVM, DDD 等)
   - testing (unit test, integration test, e2e test 等)
   - CI/CD (GitHub Actions, CircleCI 等)
   - monitoring (Prometheus, Grafana 等)
   - security (OAuth, JWT 等)
   - database (MySQL, PostgreSQL 等)
   - caching (Redis, Memcached 等)
   - queuing (RabbitMQ, Kafka 等)

2. 取得したニュースから Top 3 の Topic を選定してください。
   - 最低1件は LLM/AI 関連の Topic を含めること
   - 選定基準: 実用性、webhani の事業との関連性、トレンド性、新鮮さ

3. 選定した 3 Topic について、Blog 記事を生成してください。
   - `.claude/commands/daily-blog.md` の指示に従うこと
   - 各 Topic につき ja/en/ko の 3 Locale で生成 (計9ファイル)
   - 保存先: `content/blog/{locale}/{slug}.mdx`
   - status は "draft" で保存

4. 生成完了後、以下の git 操作を実行してください:
   - `master` Branch から新しい Branch を作成: `blog/daily-{YYYY-MM-DD}` (今日の日付を使用)
   - 生成された MDX ファイルをすべて `git add`
   - Commit メッセージ: "add daily blog posts: {YYYY-MM-DD}"
   - 作成した Branch に push
   - Draft PR を作成 (base: `master`, title: "Daily blog posts: {YYYY-MM-DD}")
   - PR の body には生成した Topic 一覧とファイルパスを記載すること

## 重要なルール

- Topic 選定でユーザー確認を求めないこと。自動で最適な 3 件を選んで進めること。
- Copyright & Originality のガイドラインを厳守すること（`.claude/commands/daily-blog.md` 参照）
- Tone & Persona のガイドラインを厳守すること（同上）
- 各 Locale の記事は直訳ではなく、自然な書き直しにすること
PROMPT
)" --max-turns "${MAX_TURNS}" \
  --allowedTools "Edit,Write,WebSearch,Bash(git*),Bash(gh*),Glob,Grep,Read,Agent" \
  2>&1 | tee -a "${LOG_FILE}"

EXIT_CODE=${PIPESTATUS[0]}

echo "" | tee -a "${LOG_FILE}"
echo "End: $(date)" | tee -a "${LOG_FILE}"
echo "Exit code: ${EXIT_CODE}" | tee -a "${LOG_FILE}"

# === 結果サマリー ===
if [ ${EXIT_CODE} -eq 0 ]; then
  echo "SUCCESS: Daily blog generation completed." | tee -a "${LOG_FILE}"
elif [ ${EXIT_CODE} -eq 124 ]; then
  echo "ERROR: Claude Code timed out after ${TIMEOUT_SECONDS}s." | tee -a "${LOG_FILE}"
else
  echo "ERROR: Claude Code failed with exit code ${EXIT_CODE}." | tee -a "${LOG_FILE}"
fi

exit ${EXIT_CODE}
