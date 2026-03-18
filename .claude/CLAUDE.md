# Webhani Homepage Project

## Development Environment

### Docker (Primary Development Environment)

- **Container name**: `dev_webhani_hp_app`
- **Start**: `docker compose up` (from project root)
- **Access**: `http://localhost:8080`
- **Port mapping**: Internal 8000 → External 8080
- **Volume**: Source code hot-reload supported (`./:/var/www`)
- **Logs**: `docker compose logs -f app`
- **Rebuild**: `docker compose up --build` (when Dockerfile changes)

### Docker Key Commands

- **Package update**: Edit `package.json` then `docker compose up -d --build` (re-runs `npm install` in Dockerfile)
- **Sync package-lock.json**: `docker cp dev_webhani_hp_app:/var/www/package-lock.json ./package-lock.json`
- **Reset volumes** (node_modules issues): `docker compose down -v && docker compose up -d --build`
- **Run command in container**: `docker exec dev_webhani_hp_app <command>`

### Local Direct Execution (Alternative)

- `npm run dev` → `http://localhost:8000`

### Notes

- `node_modules` is managed via Docker anonymous volume — isolated from host node_modules
- If `next: not found` error after package changes, run `docker compose down -v` then rebuild

## Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **i18n**: next-intl (ja/en/ko — 3 languages)
- **Font**: DM Sans (Latin) + Noto Sans JP (Japanese)
- **Form**: react-hook-form + zod
- **Email**: AWS SES + nodemailer

## Project Structure

```text
src/
├── app/           # Next.js App Router (page.tsx, layout.tsx, globals.css)
├── components/    # UI components
│   ├── AreaHero.tsx
│   ├── AreaServices.tsx
│   ├── AreaCorporatePhilosophy.tsx
│   ├── AreaAbout.tsx
│   ├── AreaWorks.tsx
│   ├── AreaBlog.tsx
│   ├── AreaContact.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── navigation/  # Nav sub-components
│   ├── blog/         # Blog sub-components (BlogCard, BlogHeader)
│   └── icons/
├── hooks/         # Custom hooks (useScrollReveal)
├── lib/           # Utilities (blog.ts)
└── i18n/          # Internationalization config
messages/          # Translation files (ja.json, en.json, ko.json)
content/blog/      # Blog MDX content ({locale}/{slug}.mdx)
public/images/     # Static images (hero, services SVG, works, logos)
scripts/           # Blog generation scripts
```

## Design System

- **Primary Color**: Amber palette (amber-400 ~ amber-600)
- **Dark Mode**: Layered dark surfaces (#0f0f0f / #1a1a1a / #242424)
- **Animations**: `reveal` class + IntersectionObserver (scroll-triggered)
- **Section Pattern**: English eyebrow subtitle + Japanese title + description
- **CSS Variables**: `--primary`, `--dark-bg`, `--dark-surface`, `--surface-muted`

## Conventions

- Component names: `Area` prefix for page sections (AreaHero, AreaServices, etc.)
- Translation keys: Access via `useTranslations("sectionName")`
- Dark mode: `class`-based toggle (`dark:` prefix)
- Images: Must use `next/image` Image component
- Image optimization: 새 Image 추가 시 반드시 `sharp-cli`로 압축 후 Commit (아래 Image Optimization 참조)
- New features: Create `docs/spec-and-task/[YYYYMMDD]-[feature-name]/specification.md` and `task.md` for specification and task management

## Blog

- **Content**: `content/blog/{locale}/{slug}.mdx` (MDX + frontmatter)
- **Status**: `draft` | `published` | `private` (frontmatter `status` field)
- **Auto-generation**: `npm run generate-blog -- -t "topic"` (default: Anthropic)
  - Switch provider: `--provider openai` or `LLM_PROVIDER=gemini`
  - Generated posts are saved with `status: draft`
- **Claude Code commands** (no API key required, Claude Code generates directly):
  - `/project:generate-blog [topic]` — Generate blog post by topic
  - `/project:polish-blog [file path]` — Polish and translate user draft
  - `/project:daily-blog` — Generate from latest tech news

## Image Optimization

`public/images/` 에 새 Image를 추가할 때 반드시 압축해야 합니다. 미압축 Image는 Core Web Vitals에 큰 악영향을 줍니다.

```bash
# Hero/Background (Full Width) — 1920px, Quality 75
npx sharp-cli -i public/images/<file>.jpg -o public/images/ -q 75 resize 1920

# Content Image (Half Width) — 1200px, Quality 80
npx sharp-cli -i public/images/<file>.jpg -o public/images/ -q 80 resize 1200

# Thumbnail/Card — 800px, Quality 80
npx sharp-cli -i public/images/<file>.jpg -o public/images/ -q 80 resize 800
```

목표 File Size: Hero ~200-300KB, Content ~100-200KB, Thumbnail ~50-100KB. `next.config.mjs`에서 AVIF/WebP 자동 변환이 설정되어 있습니다.

## Documentation Writing Guidelines

When writing or updating documentation in this project:

**Language Policy:**

- Write documentation in Korean (한국어)
- Use English for technical terms and foreign words (외래어)
- Keep consistency throughout all documentation files

**Examples:**

- ✅ "Database 연결 설정" (not "데이터베이스 연결 설정")
- ✅ "API Endpoint 구현" (not "API 엔드포인트 구현")
- ✅ "Cache Directory 관리" (not "캐시 디렉토리 관리")
- ✅ "Backend Service Logic" (not "백엔드 서비스 로직")

**Technical Terms to Keep in English:**

- API, Backend, Frontend, Database, Cache, Service, Repository
- Application, Component, Module, Framework, Library
- Request, Response, Schema, Model, Controller
- Test, Debug, Deploy, Build, Configuration
- Docker, Container, Server, Client, Router, Middleware
