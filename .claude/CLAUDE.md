# Webhani Homepage Project

## Development Environment

### Docker (기본 개발 환경)
- **컨테이너명**: `dev_webhani_hp_app`
- **실행**: `docker compose up` (프로젝트 루트에서)
- **접속**: `http://localhost:8080`
- **내부 포트**: 8000 → 외부 포트: 8080
- **볼륨**: 소스코드 핫리로드 지원 (`./:/var/www`)
- **로그 확인**: `docker compose logs -f app`
- **재빌드**: `docker compose up --build` (Dockerfile 변경 시)

### Docker 주요 명령어
- **패키지 업데이트**: `package.json` 수정 후 `docker compose up -d --build` (Dockerfile 내 `npm install` 재실행)
- **package-lock.json 동기화**: `docker cp dev_webhani_hp_app:/var/www/package-lock.json ./package-lock.json`
- **볼륨 초기화** (node_modules 문제 시): `docker compose down -v && docker compose up -d --build`
- **컨테이너 내 명령 실행**: `docker exec dev_webhani_hp_app <command>`

### 로컬 직접 실행 (대체)
- `npm run dev` → `http://localhost:8000`

### 주의사항
- `node_modules`는 Docker 익명 볼륨으로 관리됨 — 호스트의 node_modules와 분리
- 패키지 변경 후 `next: not found` 에러 발생 시 `docker compose down -v` 후 재빌드

## Tech Stack
- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **i18n**: next-intl (ja/en/ko 3개 언어)
- **Font**: DM Sans (Latin) + Noto Sans JP (Japanese)
- **Form**: react-hook-form + zod
- **Email**: AWS SES + nodemailer

## Project Structure
```
src/
├── app/           # Next.js App Router (page.tsx, layout.tsx, globals.css)
├── components/    # UI 컴포넌트
│   ├── AreaHero.tsx
│   ├── AreaServices.tsx
│   ├── AreaCorporatePhilosophy.tsx
│   ├── AreaAbout.tsx
│   ├── AreaWorks.tsx
│   ├── AreaContact.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── navigation/  # Nav 하위 컴포넌트
│   └── icons/
├── hooks/         # 커스텀 훅 (useScrollReveal)
└── i18n/          # 국제화 설정
messages/          # 번역 파일 (ja.json, en.json, ko.json)
public/images/     # 정적 이미지 (hero, services SVG, works, logos)
```

## Design System
- **Primary Color**: Amber 팔레트 (amber-400 ~ amber-600)
- **Dark Mode**: 레이어드 다크 표면 (#0f0f0f / #1a1a1a / #242424)
- **Animations**: `reveal` 클래스 + IntersectionObserver (스크롤 트리거)
- **Section Pattern**: 영어 소제목(eyebrow) + 일본어 제목 + 설명
- **CSS Variables**: `--primary`, `--dark-bg`, `--dark-surface`, `--surface-muted`

## Conventions
- 컴포넌트명: `Area` 접두사로 페이지 섹션 구분 (AreaHero, AreaServices 등)
- 번역키: `useTranslations("섹션명")`으로 접근
- 다크모드: `class` 기반 토글 (`dark:` 접두사)
- 이미지: `next/image` Image 컴포넌트 사용 필수
- 새로운 기능 추가 시: `docs/spec-and-task/[YYYYMMDD]-[feature-name]/specification.md` 와 `task.md` 를 작성하여 사양과 태스크를 관리한다

## Blog
- **콘텐츠**: `content/blog/{locale}/{slug}.mdx` (MDX + frontmatter)
- **Status**: `draft` | `published` | `private` (frontmatter의 status 필드)
- **자동 생성**: `npm run generate-blog -- -t "topic"` (default: Anthropic)
  - Provider 전환: `--provider openai` 또는 `LLM_PROVIDER=gemini`
  - 생성된 글은 `status: draft` 로 저장됨
