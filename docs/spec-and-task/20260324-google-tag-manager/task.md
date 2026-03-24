# Google Tag Manager 導入 - Task List

> Specification: [specification.md](./specification.md)

## Phase 1: Package 설치 및 환경변수 설정

- [x] **1-1. `@next/third-parties` Package 설치**
  - `npm install @next/third-parties` 실행
  - `package.json` 및 `package-lock.json` 반영 완료

- [x] **1-2. 환경변수 추가**
  - `.env`에 `NEXT_PUBLIC_GTM_ID=GTM-P6BQ225N` 추가 완료
  - `.env.sample`에 `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` Template 추가 완료

## Phase 2: layout.tsx 변경

- [x] **2-1. GTM Component 추가**
  - `@next/third-parties/google`에서 `GoogleTagManager` import
  - `<html>` Tag 직후에 `<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />` 추가
  - `NEXT_PUBLIC_GTM_ID` 미설정 시 Component를 렌더링하지 않도록 조건부 처리

- [x] **2-2. 기존 GA4 Script 삭제**
  - `gtag.js` 로드 Script Tag 삭제
  - `google-analytics` inline Script Tag 삭제

- [x] **2-3. 기존 Microsoft Clarity Script 삭제**
  - `microsoft-clarity` Script Tag 삭제
  - `NEXT_PUBLIC_CLARITY_PROJECT_ID` 환경변수도 `.env.sample`에서 삭제 완료

- [x] **2-4. 불필요한 import 정리**
  - `next/script`의 `Script` import 삭제 완료

## Phase 3: 동작 확인

- [x] **3-1. Build 확인**
  - `npm run build` 성공 확인
  - TypeScript 에러 없음 확인 (`npm run typecheck`)
  - Lint 에러 없음 확인 (`npm run lint`)

- [ ] **3-2. 개발 환경 동작 확인**
  - `http://localhost:8080` 접속
  - Browser DevTools → Network Tab에서 `gtm.js` 로드 확인
  - Console에 `dataLayer` 객체 존재 확인
  - 기존 GA4 `gtag.js` 직접 로드가 없는지 확인

- [ ] **3-3. GTM ID 미설정 시 동작 확인**
  - `NEXT_PUBLIC_GTM_ID`를 제거한 상태에서 에러 없이 동작하는지 확인

## Phase 4: GTM Console 설정 (코드 외 작업)

- [ ] **4-1. GTM Container 생성** (이미 있는 경우 Skip)
  - [Google Tag Manager](https://tagmanager.google.com/)에서 Container 생성
  - Container ID (`GTM-XXXXXXX`) 취득

- [ ] **4-2. GA4 Tag 설정**
  - Tag Type: Google Analytics: GA4 Configuration
  - Measurement ID: `G-M9E2FH8EK1`
  - Trigger: All Pages
  - Tag 공개 (Publish)

- [ ] **4-3. Microsoft Clarity Tag 설정**
  - Tag Type: Custom HTML
  - Clarity tracking code 삽입
  - Trigger: All Pages
  - Tag 공개 (Publish)

- [ ] **4-4. GTM Preview Mode로 동작 검증**
  - GA4 Event 발화 확인
  - Clarity 동작 확인

## Phase 5: Cleanup

- [x] **5-1. 환경변수 정리**
  - `NEXT_PUBLIC_CLARITY_PROJECT_ID`를 `.env.sample`에서 삭제 완료
  - Clarity는 GTM Console에서 관리

- [ ] **5-2. 배포 환경 `.env` 업데이트**
  - Production 환경의 환경변수에 `NEXT_PUBLIC_GTM_ID` 추가
  - Vercel / Docker 등 배포 환경에 반영

## Notes

- Phase 1~3 은 코드 변경 작업 (Claude Code로 실행 가능)
- Phase 4 는 GTM Web Console 작업 (수동 작업 필요)
- Phase 4-2 (GA4 Tag 설정)을 먼저 완료한 후 Phase 2 (코드 배포)를 진행하면 데이터 공백을 최소화할 수 있다
- 각 Phase 완료 시 `npm run lint` + `npm run typecheck` 통과 확인
