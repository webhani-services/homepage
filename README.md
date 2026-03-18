# nextjs docker template

## Environment

| ITEM   | Version |
| ------ | ------- |
| node   | 20.10.0 |
| nextjs | 15.1.6  |

## Setup Dev evn

- [Setup Dev env](docs/dev.md)

## Links

- [Create Nextjs project](docs/init-project.md)

### Library

- [ngrok](https://ngrok.com/)
- [lineicons](https://lineicons.com/icons/)

### Github

- [react-icons](https://react-icons.github.io/react-icons/)

### favorite templates

- [Vesperr](https://bootstrapmade.com/demo/Vesperr/)

## Blog

MDX ファイルベースのブログ機能。`content/blog/{locale}/{slug}.mdx` にコンテンツを配置します。

### ブログ記事の自動生成

LLM を使って技術ブログ記事を自動生成できます。生成された記事は `status: "draft"` で保存されます。

```bash
# 基本的な使い方（デフォルト: Anthropic Claude）
npm run generate-blog -- -t "Next.js Server Actions"

# プロバイダーを指定
npm run generate-blog -- -t "React 19 features" -p openai
npm run generate-blog -- -t "Docker tips" -p gemini

# モデルを指定
npm run generate-blog -- -t "AWS Lambda" -p anthropic -m claude-haiku-4-5-20251001

# 生成対象の言語を指定（デフォルト: ja,en,ko）
npm run generate-blog -- -t "TypeScript 5.x" -l "ja,en"

# ファイル保存せずにプレビュー
npm run generate-blog -- -t "Kubernetes入門" --dry-run
```

### 対応プロバイダー

| Provider | 環境変数 | デフォルトモデル | パッケージ |
|----------|----------|------------------|------------|
| `anthropic` (デフォルト) | `ANTHROPIC_API_KEY` | `claude-sonnet-4-6` | `@anthropic-ai/sdk` (インストール済み) |
| `openai` | `OPENAI_API_KEY` | `gpt-4o` | `npm install openai` |
| `gemini` | `GEMINI_API_KEY` | `gemini-2.5-flash` | `npm install @google/generative-ai` |

環境変数 `LLM_PROVIDER` と `LLM_MODEL` でデフォルト値を変更できます。

### ユーザー原稿を LLM で仕上げる

ユーザーが書いた原稿（下書き）を LLM が校正・翻訳し、3言語の MDX ファイルを生成します。

```bash
# 基本的な使い方
npm run polish-blog -- -f drafts/my-article.md

# カスタムスラグを指定
npm run polish-blog -- -f drafts/my-article.md -s "my-custom-slug"

# タグを手動指定
npm run polish-blog -- -f drafts/my-article.md --tags "React,TypeScript,Next.js"

# プレビュー（ファイル保存なし）
npm run polish-blog -- -f drafts/my-article.md --dry-run
```

### 最新ニュースからブログ記事を自動生成

Hacker News と Dev.to から最新の技術ニュースを取得し、LLM が Top 3 を選定（うち1件は LLM/AI 関連必須）して会社ブログ記事を生成します。

```bash
# 基本的な使い方（Top 3 記事を生成）
npm run daily-blog

# 生成記事数を変更
npm run daily-blog -- -c 5

# トピック選定のみ（記事生成なし）
npm run daily-blog -- --dry-run

# プロバイダー指定
npm run daily-blog -- -p gemini
```

### Claude Code で直接生成（API キー不要）

Claude Code 内で以下のコマンドを使うと、API キー不要でブログ記事を生成できます。

```bash
# トピック指定で生成
/project:generate-blog Next.js Server Actions の活用方法

# ユーザー原稿を校正・翻訳
/project:polish-blog drafts/my-article.md

# 最新ニュースから自動生成（Top 3 選定、うち1つは LLM/AI 関連）
/project:daily-blog
```

### ブログ記事の公開フロー

1. `npm run generate-blog -- -t "トピック"` で記事を生成（`status: "draft"`）
2. `content/blog/{locale}/` に生成された MDX ファイルを確認・編集
3. frontmatter の `status` を `"published"` に変更
4. コミット & デプロイ

### Status

| Status | Production | Development | 用途 |
|--------|-----------|-------------|------|
| `draft` | 非表示 | 表示 | 作成中 |
| `published` | 表示 | 表示 | 公開 |
| `private` | 非表示 | 非表示 | アーカイブ |

## package 更新方法

```bash
npm install -g npm-check-updates

# 更新可能なパッケージを確認
ncu

# package.json の依存関係を最新版に更新
ncu -u

# 実際にパッケージをインストール
npm install
```
