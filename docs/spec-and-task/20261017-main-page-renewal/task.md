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

- [x] Philosophy + About → Statement 섹션 (`AreaStatement`) + `/about` 페이지 (기존 Component 재사용)
- [x] Services 카드 → 번호 목록형, Products 를 Services 섹션 하단에 통합 (`AreaProducts` → `ProductList`)
- [x] Blog 카드 → 가로형 목록 (Thumbnail 있을 때만 이미지 표시)
- [x] Navigation: philosophy / products 항목 제거, about → `/about`. sitemap 에 `/about` 추가
- [x] 미사용 `navigation.philosophy` / `navigation.products` Key 및 `public/images/services/*.svg` 삭제
- [x] lint / typecheck / build 통과, Mobile (500px) 확인
- Works 는 이미지 중심이라 카드형 유지 (메인 섹션 8 → 6)
