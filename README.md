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
# 기본 사용법
npm run generate-blog -- -t "Next.js Server Actions"

# 생성 대상 언어 지정 (Default: ja,en,ko)
npm run generate-blog -- -t "TypeScript 5.x" -l "ja,en"

# File 저장 없이 Preview
npm run generate-blog -- -t "Kubernetes 입문" --dry-run
```

### LLM Gateway 연동

Blog 생성 Script(`generate-blog`, `polish-blog`, `daily-blog`)는 모두 **LLM Gateway** 를 통해 기사를 생성합니다. Local provider Library(`@anthropic-ai/sdk` 등)와 per-provider API Key, `--provider` / `--model` Flag 는 제거되었습니다.

| 항목 | 값 |
|------|-----|
| 필수 환경변수 | `LLM_GATEWAY_BASE_URL`, `LLM_GATEWAY_TOKEN` |
| 사용 Gateway Task | `blog-article-by-topic` (generate-blog), `blog-polish` (polish-blog), `daily-tech-topic-selection` + `daily-tech-article` (daily-blog) |

Gateway 측에 위 Task 의 Prompt Template 이 등록되어 있어야 합니다.

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

LLM Gateway 의 `daily-tech-topic-selection` Task 가 최신 기술 Topic Top N(Default 3)을 선정하고, 각 Topic 을 `daily-tech-article` Task 로 회사 Blog 기사로 생성합니다.

```bash
# 기본 사용법 (Top 3 기사 생성)
npm run daily-blog

# 생성 기사 수 변경
npm run daily-blog -- -c 5

# Topic 선정만 (기사 생성 없음)
npm run daily-blog -- --dry-run
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

## Image 최적화

`public/images/` 에 새로운 Image를 추가할 때, 반드시 아래 Command로 압축 후 Commit 하세요. 최적화하지 않은 대용량 Image는 Core Web Vitals (LCP, FCP)에 큰 악영향을 줍니다.

```bash
# Hero/Background Image (Full Width) — 1920px, Quality 75
npx sharp-cli -i public/images/hero-bg.jpg -o public/images/ -q 75 resize 1920

# Content Image (Half Width) — 1200px, Quality 80
npx sharp-cli -i public/images/about/team.jpg -o public/images/about/ -q 80 resize 1200

# 일반 사용법
npx sharp-cli -i <입력 경로> -o <출력 Directory> -q <Quality 1-100> resize <Width>
```

### Image 가이드라인

| 용도 | 권장 Width | Quality | 목표 File Size |
|------|-----------|---------|---------------|
| Hero/Background (Full Width) | 1920px | 75 | ~200-300KB |
| Content Image (Half Width) | 1200px | 80 | ~100-200KB |
| Thumbnail/Card | 800px | 80 | ~50-100KB |
| Logo/Icon | 원본 유지 | - | SVG 권장 |

> **참고**: `next.config.mjs` 에서 AVIF/WebP 자동 변환이 설정되어 있으므로, JPEG로 저장해도 Browser에는 최적 Format으로 제공됩니다.

## Security Headers

`next.config.mjs` 에 아래 Security Header가 설정되어 있습니다:

| Header | 값 | 목적 |
|--------|---|------|
| `X-Frame-Options` | `DENY` | Clickjacking 방지 |
| `X-Content-Type-Options` | `nosniff` | MIME Sniffing 방지 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer 정보 누출 제한 |
| `Permissions-Policy` | Camera, Mic, Geo 비활성화 | Browser API 제한 |
| `Strict-Transport-Security` | 2년, Preload | HTTPS 강제 |
| `Content-Security-Policy` | Self + Google Analytics Allowlist | XSS/Injection 방지 |

## Contact API Security

`src/app/api/contact/route.ts` 에 적용된 보안 조치:

- **Rate Limiting**: IP당 1분에 5회 제한
- **Request Size 제한**: 10KB 초과 Request 거부
- **Email Subject Sanitization**: Control Character 제거 및 길이 제한
- **환경변수 Validation**: 필수 AWS 환경변수 미설정 시 Error Log 출력
- **Error Logging**: Production에서 Error Object 전체 노출 방지 (`error.message` 만 기록)

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
