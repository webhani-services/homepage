# Main Page Renewal Task

## Phase 1 — Hero + Typography Prototype

- [x] `SectionHeading` Component 작성 (`src/components/SectionHeading.tsx`)
- [x] 7개 섹션 (Services, Philosophy, About, Products, Works, Blog, Contact) 의 heading 블록을 `SectionHeading` 으로 교체
- [x] `AreaHero` 배경을 CSS Glow + Dot Texture 로 교체, 좌측 정렬, `font-medium`
- [x] `globals.css` 에 `.hero-glow`, `.hero-dots`, `prefers-reduced-motion` 대응 추가
- [x] 미사용 `hero.backgroundImage` Key (ja/en/ko) 및 `public/images/hero-bg.jpg` 삭제
- [x] lint / typecheck / build 통과
- [x] Chrome 으로 Desktop / Mobile, Light / Dark Screenshot 확인

## Phase 2 — 섹션 통합 (별도 PR)

- [ ] Philosophy + About → Statement 섹션 + `/about` 페이지
- [ ] Services + Products 목록형 통합
- [ ] Works / Blog 가로형 목록
