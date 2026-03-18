# Webhani Homepage

## 환경

| 항목   | Version |
| ------ | ------- |
| Node   | >= 22   |
| Next.js | 16     |

## 개발 환경 Setup

- [개발 환경 Setup](docs/dev.md)

## 참고 Link

- [Create Nextjs project](docs/init-project.md)

### Library

- [ngrok](https://ngrok.com/)
- [lineicons](https://lineicons.com/icons/)

### Github

- [react-icons](https://react-icons.github.io/react-icons/)

### Template 참고

- [Vesperr](https://bootstrapmade.com/demo/Vesperr/)

## Blog

MDX File 기반의 Blog 기능. `content/blog/{locale}/{slug}.mdx` 에 Content를 배치합니다.

### Blog 기사 자동 생성

LLM을 사용하여 기술 Blog 기사를 자동 생성할 수 있습니다. 생성된 기사는 `status: "draft"` 로 저장됩니다.

```bash
# 기본 사용법 (Default: Anthropic Claude)
npm run generate-blog -- -t "Next.js Server Actions"

# Provider 지정
npm run generate-blog -- -t "React 19 features" -p openai
npm run generate-blog -- -t "Docker tips" -p gemini

# Model 지정
npm run generate-blog -- -t "AWS Lambda" -p anthropic -m claude-haiku-4-5-20251001

# 생성 대상 언어 지정 (Default: ja,en,ko)
npm run generate-blog -- -t "TypeScript 5.x" -l "ja,en"

# File 저장 없이 Preview
npm run generate-blog -- -t "Kubernetes 입문" --dry-run
```

### 지원 Provider

| Provider | 환경변수 | Default Model | Package |
|----------|----------|---------------|---------|
| `anthropic` (Default) | `ANTHROPIC_API_KEY` | `claude-sonnet-4-6` | `@anthropic-ai/sdk` (설치 완료) |
| `openai` | `OPENAI_API_KEY` | `gpt-4o` | `npm install openai` |
| `gemini` | `GEMINI_API_KEY` | `gemini-2.5-flash` | `npm install @google/generative-ai` |

환경변수 `LLM_PROVIDER` 와 `LLM_MODEL` 로 Default 값을 변경할 수 있습니다.

### User 원고를 LLM 으로 다듬기

User가 작성한 원고(초안)를 LLM이 교정・번역하여 3개 언어의 MDX File을 생성합니다.

```bash
# 기본 사용법
npm run polish-blog -- -f drafts/my-article.md

# Custom Slug 지정
npm run polish-blog -- -f drafts/my-article.md -s "my-custom-slug"

# Tag 수동 지정
npm run polish-blog -- -f drafts/my-article.md --tags "React,TypeScript,Next.js"

# Preview (File 저장 없음)
npm run polish-blog -- -f drafts/my-article.md --dry-run
```

### 최신 News 로부터 Blog 기사 자동 생성

Hacker News 와 Dev.to 에서 최신 기술 News 를 취득하고, LLM이 Top 3를 선정(이 중 1건은 LLM/AI 관련 필수)하여 회사 Blog 기사를 생성합니다.

```bash
# 기본 사용법 (Top 3 기사 생성)
npm run daily-blog

# 생성 기사 수 변경
npm run daily-blog -- -c 5

# Topic 선정만 (기사 생성 없음)
npm run daily-blog -- --dry-run

# Provider 지정
npm run daily-blog -- -p gemini
```

### Claude Code 에서 직접 생성 (API Key 불필요)

Claude Code 내에서 아래 Command를 사용하면, API Key 없이 Blog 기사를 생성할 수 있습니다.

```bash
# Topic 지정 생성
/project:generate-blog Next.js Server Actions 활용 방법

# User 원고 교정・번역
/project:polish-blog drafts/my-article.md

# 최신 News 기반 자동 생성 (Top 3 선정, 이 중 1건은 LLM/AI 관련)
/project:daily-blog
```

### Blog 기사 공개 Flow

1. `npm run generate-blog -- -t "Topic"` 으로 기사 생성 (`status: "draft"`)
2. `content/blog/{locale}/` 에 생성된 MDX File 확인・편집
3. Frontmatter 의 `status` 를 `"published"` 로 변경
4. Commit & Deploy

### Status

| Status      | Production | Development | 용도       |
|-------------|------------|-------------|------------|
| `draft`     | 비표시     | 표시        | 작성 중    |
| `published` | 표시       | 표시        | 공개       |
| `private`   | 비표시     | 비표시      | Archive    |

## Package 업데이트 방법

```bash
npm install -g npm-check-updates

# 업데이트 가능한 Package 확인
ncu

# package.json 의 Dependency를 최신 버전으로 업데이트
ncu -u

# 실제 Package Install
npm install
```
