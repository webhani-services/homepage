# Blog Tag Filter UI 개선 Task

> Specification: [specification.md](./specification.md)

## Phase 1: Logic

- [x] 태그 빈도 계산 및 정렬 유틸리티 추가
- [x] 기본 노출 태그와 확장 태그를 나누는 규칙 구현
- [x] 선택된 태그가 항상 visible 상태를 유지하는 규칙 구현
- [x] 위 규칙에 대한 단위 테스트 추가

## Phase 2: UI

- [x] `BlogList`에 상위 태그 우선 노출 UI 적용
- [x] `더 보기` / `접기` 토글 추가
- [x] 태그 개수 표시 추가
- [x] 결과 카운트와 태그 영역의 시각적 계층 정리

## Phase 3: Localization & Verification

- [x] 다국어 번역 키 추가
- [x] `npm run lint`
- [x] `npm run typecheck`
- [ ] `/blog` 화면 수동 확인
