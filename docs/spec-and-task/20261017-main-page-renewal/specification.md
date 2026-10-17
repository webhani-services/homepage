# Main Page Renewal 사양

## 배경

현재 메인 페이지는 Stock 사진 Hero, 모든 제목이 Bold, 섹션 8개가 같은 크기의 위계로 나열되어 있어 기업 홈페이지 템플릿 같은 인상을 준다.
legalontech.jp, openai.com/index/gpt-6-astra 를 Chrome으로 확인한 결과 공통점은 다음과 같다.

| 항목 | 레퍼런스 | 현재 |
|---|---|---|
| Hero 비주얼 | 추상 Particle (영상/Canvas) | Stock 사진 |
| 큰 제목 weight | 400~500 | 700 |
| 섹션 제목 | 거대한 영문 (LegalOn 140px, weight 400) + 작은 일본어 | 48px Bold 일본어 |
| 강조색 | 거의 없음 | Amber 다수 |
| 정렬 | 좌측 정렬, 좁은 본문 칼럼 | 중앙 정렬 |

## 목표

1. Hero를 Stock 사진 없이 어두운 배경 + Amber Glow + 점 Texture (CSS Only)로 교체
2. Typography 위계 재정의: 얇고 큰 영문 eyebrow, 작은 일본어 제목
3. 섹션 수 축소 (8 → 5) — Phase 2

## 범위

### Phase 1 (이번 PR — Prototype)

- `AreaHero`: 배경 이미지 제거, CSS Glow/Dot 배경, 좌측 정렬, 제목 `font-medium`
- `SectionHeading` 공통 Component 신설: 7개 섹션의 중복된 eyebrow + h2 + description 블록을 대체
  - 영문 eyebrow: `text-5xl md:text-7xl xl:text-8xl font-normal` (lg 2-column 에서 overflow 방지), 장식이므로 `aria-hidden`
  - h2 (일본어 제목): 작은 Amber 텍스트 — 의미상 Heading은 h2 유지 (SEO / Screen Reader)
  - 좌측 정렬
- `prefers-reduced-motion` 시 Glow Animation 정지
- 사용하지 않게 되는 `hero.backgroundImage` 번역 Key 및 `hero-bg.jpg` 제거

### Phase 2 (별도 PR)

- 섹션 통합: Philosophy + About → Statement, Services + Products → 목록형, Works + Blog 정리
- `/about` 하위 페이지 신설

## 비범위

- Canvas / WebGL Particle (Library 추가가 필요 — 효과 검증 후 판단)
- 카피 변경 (기존 번역 문구 유지)

## 완료 조건

- `npm run lint`, `npm run typecheck`, `npm run build` 통과
- ja / en / ko, Light / Dark, Desktop (1440px) / Mobile (375px) 에서 레이아웃 깨짐 없음
- 영문 eyebrow가 Mobile 및 Philosophy 2-column 레이아웃에서 overflow 하지 않음
