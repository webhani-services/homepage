# Blog Feature - Task List

> Specification: [specification.md](./specification.md)

## Phase 1: Core Blog Infrastructure

- [x] **1-1. 패키지 설치**
  - `gray-matter`, `next-mdx-remote`, `@tailwindcss/typography` 설치

- [x] **1-2. 콘텐츠 디렉토리 생성**
  - `content/blog/ja/`, `content/blog/en/`, `content/blog/ko/` 디렉토리 생성
  - 샘플 MDX 파일 작성 (각 locale별 1개: aws-ses-nextjs.mdx)

- [x] **1-3. 블로그 유틸리티 작성 (`src/lib/blog.ts`)**
  - `BlogFrontmatter` 타입 정의
  - `BlogPost` 타입 정의
  - `getPosts(locale)` — locale별 글 목록 조회 (status 필터링 포함)
  - `getPostBySlug(locale, slug)` — 단일 글 조회
  - `getAllSlugs()` — 정적 빌드용 전체 slug 목록

- [x] **1-4. 블로그 목록 페이지 (`src/app/blog/page.tsx`)**
  - 현재 locale의 published 글 목록 표시
  - 날짜 내림차순 정렬
  - 글이 없을 때 빈 상태 UI

- [x] **1-5. 블로그 상세 페이지 (`src/app/blog/[slug]/page.tsx`)**
  - MDX 콘텐츠 렌더링
  - `generateStaticParams` 구현
  - `generateMetadata` 구현 (SEO)
  - 존재하지 않는 slug → `notFound()` 처리

## Phase 2: UI Components

- [x] **2-1. BlogCard 컴포넌트 (`src/components/blog/BlogCard.tsx`)**
  - 썸네일 이미지 (next/image)
  - 제목, 설명, 작성일
  - 태그 표시
  - 호버 애니메이션
  - 기존 다크 모드 디자인 시스템 적용

- [x] **2-2. BlogHeader 컴포넌트 (`src/components/blog/BlogHeader.tsx`)**
  - 글 제목
  - 작성일 / 수정일
  - 태그 목록
  - 작성자 정보

- [x] **2-3. 블로그 페이지 스타일링**
  - prose 스타일 적용 (MDX 본문) — @tailwindcss/typography
  - 다크 모드 대응 (prose-invert)
  - 반응형 레이아웃

## Phase 3: Homepage Integration

- [x] **3-1. AreaBlog 컴포넌트 (`src/components/AreaBlog.tsx`)**
  - 최신 published 글 3개 표시
  - 기존 Section Pattern 적용 (영어 eyebrow + 일본어 제목)
  - `reveal` 애니메이션 적용
  - "View All" 링크 → `/blog`

- [x] **3-2. Navigation 업데이트**
  - Blog 링크 추가 (`/blog`)
  - 모바일 메뉴에도 반영 (기존 navigationData 구조 활용)

- [x] **3-3. 홈페이지에 AreaBlog 추가**
  - `src/app/page.tsx`에 AreaBlog 섹션 추가
  - AreaWorks 다음에 배치
  - page.tsx を async 化하여 서버에서 글 목록 취득

- [x] **3-4. 번역 키 추가**
  - `messages/ja.json`, `messages/en.json`, `messages/ko.json`에 Blog 섹션 + navigation 번역 키 추가

## Phase 4: SEO Optimization

- [ ] **4-1. 메타데이터 최적화**
  - 블로그 목록 페이지 메타데이터
  - 블로그 상세 페이지 OG 태그 (title, description, image)

- [ ] **4-2. Sitemap 연동**
  - 블로그 글을 sitemap에 포함
  - `generateStaticParams` 활용

- [ ] **4-3. Structured Data**
  - BlogPosting JSON-LD 추가 (선택)

## Phase 5 (Future): LLM Auto-Generation

- [ ] **5-1. 생성 스크립트 작성 (`scripts/generate-blog.ts`)**
  - LLM API 호출하여 MDX 콘텐츠 생성
  - frontmatter 자동 채우기 (status: draft)
  - 다국어 버전 자동 생성

- [ ] **5-2. GitHub API 연동**
  - 생성된 MDX 파일을 GitHub API로 커밋
  - PR 자동 생성 (검토용)

- [ ] **5-3. 워크플로 자동화**
  - 정기 실행 (Cron / GitHub Actions)
  - 주제 큐 관리

## Notes

- Phase 1~2 를 먼저 완료하고 동작 확인 후 Phase 3 이후 진행
- 각 Phase 완료 시 `npm run lint` + `npm run typecheck` 통과 확인
- UI 변경 시 스크린샷 첨부하여 PR에 포함
