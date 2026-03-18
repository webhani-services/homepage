# OpenClaw を利用した daily-blog 自動実行ガイド

## 概要

OpenClaw Gateway が設置されたマシン上で、毎朝 8:00 に Claude Code CLI を直接起動し、最新テックニュースから Blog 記事を生成、Branch 作成、Draft PR 発行までを完全自動で行います。

API Key ではなく、マシン上の Claude Code CLI に直接 Prompt を渡して実行する方式です。

## 前提条件

- OpenClaw Gateway が設定済み、かつ対象マシン上で動作していること
- Claude Code CLI がインストール済み (`claude` コマンドが利用可能)
- 対象マシン上に本プロジェクトが clone 済み
- GitHub の認証設定済み (SSH Key または `gh auth login`)

## 実行フロー

```text
[OpenClaw Scheduler (毎朝 8:00)]
  ↓
[scripts/cron/daily-blog.sh を実行]
  ↓
[Project Directory に自動移動 (Script からの相対パスで算出)]
  ↓
[git fetch & master を最新に更新]
  ↓
[Claude Code CLI を非 Interactive モードで起動 (claude -p)]
  ↓
[Web 検索 → Topic 選定 → Blog 生成 → Branch 作成 → Push → Draft PR]
  ↓
[Log を logs/daily-blog-{YYYY-MM-DD}.log に保存]
```

## 実行 Script

Script は `scripts/cron/daily-blog.sh` に配置済みです。

### 仕組み

- `PROJECT_DIR` は Script の配置場所から相対パスで自動算出するため、どのマシンでも動作します
- `claude -p "..."` で Claude Code CLI を非 Interactive モードで直接起動します
- `--allowedTools` で必要な Tool 権限のみ許可します
- 終了コードを返すので OpenClaw で成功/失敗の判定が可能です

### Script の内容確認

```bash
cat scripts/cron/daily-blog.sh
```

### 主要な処理

1. `master` Branch を最新に更新
2. Claude Code CLI に Prompt を渡して実行
3. Claude Code が Web 検索 → Topic 選定 → Blog 生成 → `blog/daily-{YYYY-MM-DD}` Branch 作成 → Push → Draft PR 作成
4. 全行程の Log を `logs/daily-blog-{YYYY-MM-DD}.log` に保存

### Prompt の内容

Script 内の Prompt で Claude Code に以下を指示しています:

- **Step 1**: Web 検索で最新テックニュースを取得（Web 開発、Cloud、AI/LLM、DevOps 等）
- **Step 2**: Top 3 Topic を自動選定（最低1件は LLM/AI 関連）
- **Step 3**: 各 Topic を ja/en/ko の 3 Locale で Blog 生成（計9ファイル）
- **Step 4**: `blog/daily-{YYYY-MM-DD}` Branch を作成 → Push → Draft PR 作成
- **ルール**: ユーザー確認なし、Copyright/Tone ガイドライン厳守

## OpenClaw への指示内容

OpenClaw に対して、以下のように伝えてください。

### OpenClaw への Prompt

```text
毎朝 8:00 (JST) に以下の Shell Script を自動実行するスケジュールを設定してください。

実行 Script: {PROJECT_DIR}/scripts/cron/daily-blog.sh

このScriptは、webhani のホームページプロジェクト内に配置されている
Blog 自動生成用の Shell Script です。
Claude Code CLI を非 Interactive モードで起動し、
最新テックニュースから Blog 記事を 3 件生成、
日付別の git Branch を作成して Draft PR を発行します。

設定条件:
- Schedule: 毎日 8:00 (JST)
- 実行方法: Shell Command として実行
- Timeout: 600 秒（Blog 生成に時間がかかるため）
- 実行ユーザー: Claude Code CLI と git/gh コマンドが利用可能なユーザー
- 失敗時: Log ファイル (logs/daily-blog-{YYYY-MM-DD}.log) を確認可能にする
- 通知: 失敗時に通知を送る（任意）
```

### 補足説明

OpenClaw に上記を伝える際、以下の点を確認してください:

- `{PROJECT_DIR}` は実際の Project Path に置き換えること（例: `/home/user/homepage`）
- OpenClaw が動作しているユーザーで `claude` コマンドと `gh` コマンドが実行可能であること
- `scripts/cron/daily-blog.sh` に実行権限 (`chmod +x`) が付与されていること

## OpenClaw Scheduler 設定（手動設定の場合）

OpenClaw の管理画面から手動で設定する場合の手順です。

### Step 1: Script の実行権限を確認

```bash
chmod +x scripts/cron/daily-blog.sh
```

### Step 2: OpenClaw に登録

OpenClaw の設定画面で以下を登録:

| 項目            | 値                                                            |
| --------------- | ------------------------------------------------------------- |
| Trigger         | Schedule (Cron)                                               |
| Cron Expression | `0 8 * * *` (毎朝 8:00 JST)                                  |
| Action          | Shell Command                                                 |
| Command         | `{PROJECT_DIR}/scripts/cron/daily-blog.sh`                    |
| Timeout         | 600s (Blog 生成に時間がかかるため余裕を持たせる)              |

`{PROJECT_DIR}` は実際の Project Path に置き換えてください。

### Step 3: 動作確認

手動で一度実行してテストします:

```bash
./scripts/cron/daily-blog.sh
```

実行後、以下を確認:

- `logs/daily-blog-{今日の日付}.log` が生成されていること
- GitHub に `blog/daily-{今日の日付}` Branch が作成されていること
- Draft PR が作成されていること

## Prompt のカスタマイズ

Prompt を変更する場合は `scripts/cron/daily-blog.sh` 内の `PROMPT` ブロックを編集してください。

### Draft ではなく Published で生成する場合

Step 3 の行を変更:

```text
   - status は "published" で保存
```

### 特定の分野にフォーカスする場合

Step 1 の対象分野を絞ります:

```text
1. Web検索で今日の最新テックニュースを取得してください。対象分野:
   - AI/LLM (Claude, GPT, AI Coding Assistant 等) に限定
```

### Branch のみ作成し PR は作成しない場合

Step 4 から PR 関連の行を削除:

```text
4. 生成完了後、以下の git 操作を実行してください:
   - `master` Branch から新しい Branch を作成: `blog/daily-{YYYY-MM-DD}`
   - 生成された MDX ファイルをすべて `git add`
   - Commit メッセージ: "add daily blog posts: {YYYY-MM-DD}"
   - 作成した Branch に push
```

## Log 管理

Log は `logs/daily-blog-{YYYY-MM-DD}.log` に保存されます（`.gitignore` に追加済み）。

```bash
# 最新の Log を確認
tail -50 logs/daily-blog-$(date +%Y-%m-%d).log

# 古い Log を削除（30日以上前）
find logs/ -name "daily-blog-*.log" -mtime +30 -delete
```

## トラブルシューティング

| 問題                          | 原因                         | 対処                                                                  |
| ----------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `claude: command not found`   | PATH が通っていない          | Script 内の PATH 設定を確認、必要なら Claude Code のパスを追加        |
| Web 検索が失敗する            | WebSearch Tool の権限不足    | `--allowedTools` に `WebSearch` が含まれているか確認                   |
| git push が失敗する           | 認証の問題                   | SSH Key / GitHub Token の設定を確認                                   |
| Branch が既に存在する         | 同日に2回実行された          | Script に `git branch -D blog/daily-${DATE} 2>/dev/null` を追加       |
| Topic が LLM/AI を含まない    | Prompt の制約が弱い          | "必ず1件以上" の文言を強調                                            |
| Timeout で中断される          | 生成時間が長い               | OpenClaw の Timeout を 900s 以上に設定                                |
| 記事の品質が低い              | Prompt の指示が不足          | `daily-blog.md` のガイドラインへの参照を明示                          |
