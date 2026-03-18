# Blog Feature Specification

## Overview

webhani 회사 홈페이지에 기술 블로그 기능을 추가한다. MDX 파일 기반으로 콘텐츠를 관리하며, 자체 DB 없이 Git 리포지토리를 콘텐츠 저장소로 활용한다. 향후 LLM을 이용한 자동 작성 워크플로를 지원하는 구조로 설계한다.

## Goals

- 기술 블로그를 통한 SEO 강화 및 기술 브랜딩
- 공개/비공개 등 콘텐츠 상태(status) 관리
- 기존 다국어(ja/en/ko) 체계와의 자연스러운 통합
- DB 없이 MDX + Git 기반 콘텐츠 관리
- 향후 LLM 자동 작성 파이프라인 연동 가능한 구조

## Architecture

### Content Management: MDX + GitHub API (Git as DB)

```
content/blog/{locale}/{slug}.mdx → Next.js 빌드 시 파싱 → 정적 페이지 생성
```

- 콘텐츠는 `content/blog/` 디렉토리에 locale별로 MDX 파일로 저장
- `gray-matter`로 frontmatter 파싱, `next-mdx-remote`로 렌더링
- 빌드 시 `status` 필드에 따라 필터링

### MDX Frontmatter Schema

```yaml
---
title: string           # 글 제목
description: string     # 요약 설명 (SEO, OG용)
date: string            # 작성일 (YYYY-MM-DD)
updatedAt?: string      # 수정일 (선택)
status: string          # "draft" | "published" | "private"
tags: string[]          # 태그 목록
thumbnail?: string      # 썸네일 이미지 경로
author: string          # 작성자
locale: string          # 언어 코드 (ja | en | ko)
slug: string            # URL 슬러그
---
```

### Status Definition

| Status | Production 빌드 | Development 환경 | 용도 |
|--------|-----------------|--------------------|------|
| `draft` | 제외 | 표시 | 작성 중인 글 |
| `published` | 포함 (공개) | 표시 | 공개된 글 |
| `private` | 제외 | 제외 | 아카이브/비공개 |

## Directory Structure

```
content/
└── blog/
    ├── ja/
    │   └── {slug}.mdx
    ├── en/
    │   └── {slug}.mdx
    └── ko/
        └── {slug}.mdx

src/
├── app/
│   └── blog/
│       ├── page.tsx              # 블로그 목록 페이지
│       └── [slug]/
│           └── page.tsx          # 블로그 상세 페이지
├── components/
│   └── blog/
│       ├── BlogCard.tsx          # 목록용 카드 컴포넌트
│       └── BlogHeader.tsx        # 상세 페이지 헤더
└── lib/
    └── blog.ts                   # MDX 파싱, 글 조회 유틸리티
```

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/blog` | 블로그 글 목록 (카드 그리드) |
| `/blog/[slug]` | 블로그 글 상세 (MDX 렌더링) |

## Features

### Phase 1: Core Blog Infrastructure

- MDX 파싱 유틸리티 (`lib/blog.ts`)
- 블로그 목록 페이지 (`/blog`)
- 블로그 상세 페이지 (`/blog/[slug]`)
- Status 기반 필터링 (published만 프로덕션에 노출)
- 다국어 지원 (현재 locale에 맞는 글만 표시)

### Phase 2: UI Components

- `BlogCard` 컴포넌트 (썸네일, 제목, 설명, 날짜, 태그)
- `BlogHeader` 컴포넌트 (제목, 작성일, 태그, 작성자)
- 기존 디자인 시스템 적용 (다크 모드, Amber 팔레트, reveal 애니메이션)

### Phase 3: Homepage Integration

- 메인 페이지에 `AreaBlog` 섹션 추가 (최신 글 3개 표시)
- Navigation에 Blog 링크 추가

### Phase 4: SEO Optimization

- `generateMetadata`로 OG 태그 자동 생성
- `generateStaticParams`로 정적 페이지 사전 빌드
- sitemap에 블로그 글 포함

### Phase 5 (Future): LLM Auto-Generation

- LLM API로 MDX 콘텐츠 자동 생성 스크립트
- GitHub API로 `status: draft` 상태의 MDX 파일 커밋
- PR 기반 검토 → `published`로 변경 → 배포

## Tech Stack Additions

| Package | Purpose |
|---------|---------|
| `gray-matter` | MDX frontmatter 파싱 |
| `next-mdx-remote` | MDX → React 렌더링 (RSC 지원) |
| `rehype-highlight` (선택) | 코드 블록 구문 하이라이팅 |

## Design Guidelines

- 기존 디자인 시스템을 따름 (다크 모드, Amber 팔레트)
- Section Pattern: 영어 eyebrow + 일본어 제목 + 설명
- `reveal` 클래스로 스크롤 애니메이션 적용
- 레이어드 다크 표면 컬러 사용 (#0f0f0f / #1a1a1a / #242424)

## Constraints

- 자체 DB를 사용하지 않는다 (Git = Content Store)
- 기존 next-intl 다국어 체계와 통합한다
- `Area` 접두사 컴포넌트 네이밍 컨벤션을 따른다
- `next/image` Image 컴포넌트를 사용한다
