# Blog Tag Filter UI 개선 Specification

## Overview

블로그 목록 페이지의 태그 영역은 고유 태그 수가 많아질수록 첫 화면을 과도하게 점유하고, 검색과 글 카드보다 먼저 시선을 빼앗는다. 현재는 모든 태그를 동일한 위계로 한 번에 노출하고 있어 정보 밀도가 지나치게 높다.

이번 개선은 태그를 탐색 가능한 상태로 유지하면서도 기본 화면의 시각적 부담을 줄이는 것을 목표로 한다.

## Goals

- 블로그 첫 화면에서 태그 영역의 세로 점유율을 줄인다
- 자주 등장하는 태그를 우선 노출해 탐색 효율을 높인다
- 현재 선택된 태그는 접힌 상태에서도 항상 보이게 유지한다
- 기존 검색, URL Query Parameter, Pagination 동작을 유지한다

## Non-Goals

- 태그 taxonomy 전면 정리
- 태그 자동완성 검색 UI 추가
- Backend 또는 MDX Frontmatter 구조 변경

## Current Problem

- 고유 태그 수가 100개 이상인 상태에서 모든 태그가 동일 스타일로 노출된다
- 사용 빈도 1회의 희소 태그도 상위 태그와 같은 강조 수준을 가진다
- 검색창 아래에 긴 태그 wall이 생겨 글 목록 탐색보다 필터 자체가 더 무거워 보인다

## Proposed Solution

### 1. Tag Priority

- 태그는 이름순이 아니라 사용 빈도 내림차순으로 정렬한다
- 동률일 경우 이름 오름차순으로 정렬해 결과를 안정화한다

### 2. Default Visibility

- 기본 화면에서는 `전체` 버튼과 상위 태그 일부만 노출한다
- 기본 노출 개수는 `10`개로 고정한다

### 3. Expand / Collapse

- 기본 노출 외 태그는 `더 보기` 버튼 뒤에 숨긴다
- 확장 상태에서는 나머지 태그를 모두 노출하고 `접기`로 돌아갈 수 있다

### 4. Selected Tag Persistence

- 현재 선택된 태그가 기본 노출 범위 밖에 있어도 접힌 상태에서 항상 보이게 유지한다
- 사용자는 자신이 어떤 태그로 필터링 중인지 즉시 인지할 수 있어야 한다

### 5. Tag Count

- 각 태그 버튼에 해당 태그가 포함된 글 수를 함께 노출한다
- 희소 태그의 시각적 우선순위를 자연스럽게 낮춘다

## Affected Files

```text
docs/spec-and-task/20260412-blog-tag-filter/specification.md
docs/spec-and-task/20260412-blog-tag-filter/task.md
src/lib/blogTagFilters.ts
src/lib/blogTagFilters.test.ts
src/app/blog/page.tsx
src/components/blog/BlogList.tsx
messages/en.json
messages/ja.json
messages/ko.json
```

## Constraints

- 기존 Query Parameter (`tag`, `q`, `page`) 동작을 유지한다
- 기존 Tailwind 기반 스타일과 amber accent 톤을 유지한다
- 새로운 UI Library를 추가하지 않는다

## Verification

- 태그 정렬/노출 규칙은 단위 테스트로 검증한다
- `npm run lint`
- `npm run typecheck`
- 브라우저에서 `/blog` 수동 확인
