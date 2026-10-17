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

## Phase 3 — Hero Particle 영상

- [x] 원본 영상 Procedural 생성 (`scripts/render-hero-video.py`, numpy + PIL). 모든 움직임을 Loop 주기의 정수배로 설계 → Seamless Loop (마지막 다음 Frame == 첫 Frame, diff 0)
- [x] 1280×720 / 24fps / 10s / 음성 없음. VP9 WebM (CRF 34, 1.17MB) + H.264 MP4 (CRF 26, faststart, 1.40MB) + Poster JPG (sharp-cli q75, 30KB)
- [x] Poster 는 `next/image priority` (LCP), 영상은 Mount 후 표시. `prefers-reduced-motion` / Save-Data 시 영상 미로드
- [x] 세로 화면에서 Particle 이 보이도록 `object-position: 72% 50%`, 왼쪽 Gradient 로 카피 가독성 확보
- [x] 미사용 `.hero-glow` / `.hero-dots` CSS 삭제

재생성 방법:

```bash
python3 -I scripts/render-hero-video.py /tmp/hero-frames 1280 720 24 10
ffmpeg -framerate 24 -i /tmp/hero-frames/f%04d.png -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p -an public/videos/hero-particles.webm
ffmpeg -framerate 24 -i /tmp/hero-frames/f%04d.png -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an public/videos/hero-particles.mp4
ffmpeg -i /tmp/hero-frames/f0000.png -q:v 4 /tmp/poster.jpg && npx sharp-cli -i /tmp/poster.jpg -o public/images/ -q 75
```
