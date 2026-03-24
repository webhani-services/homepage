# Google Tag Manager 導入 Specification

## Overview

webhani 회사 홈페이지에 Google Tag Manager (GTM)를 導入한다. 현재 `layout.tsx`에 직접 삽입되어 있는 GA4 Script와 Microsoft Clarity Script를 GTM으로 일원 관리하여, 코드 변경 없이 Tag의 추가・변경・삭제를 가능하게 한다.

## Goals

- GTM을 통한 Analytics Tag 일원 관리 (GA4, Clarity 등)
- 코드 변경 없이 GTM Console에서 Tag 추가・변경 가능
- Next.js 16 App Router와의 최적 통합
- 이중 계측 방지 (기존 직접 삽입 Script 제거)
- 환경변수 기반 GTM ID 관리 (환경별 분리 가능)

## Current State (AS-IS)

### 현재 `src/app/layout.tsx` 의 Analytics 구성

```tsx
// GA4 — 직접 삽입
<Script src="https://www.googletagmanager.com/gtag/js?id=G-M9E2FH8EK1" strategy="afterInteractive" />
<Script id="google-analytics" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-M9E2FH8EK1');`}
</Script>

// Microsoft Clarity — 환경변수로 조건부 삽입
{process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
  <Script id="microsoft-clarity" strategy="afterInteractive">...</Script>
)}
```

### 문제점

| 항목 | 설명 |
|------|------|
| 유연성 부족 | 새 Tag 추가 시 코드 변경 + 배포 필요 |
| GA4 ID 하드코딩 | `G-M9E2FH8EK1`이 소스에 직접 기재 |
| 관리 분산 | GA4와 Clarity가 각각 별도 Script로 관리 |

## Target State (TO-BE)

### Architecture

```
AS-IS:
  layout.tsx → GA4 Script (직접) + Clarity Script (직접)

TO-BE:
  layout.tsx → GTM Script (1개)
  GTM Console → GA4 Tag + Clarity Tag + 향후 추가 Tag
```

### 구현 방식: `@next/third-parties/google`

Next.js 공식 `@next/third-parties` Package의 `GoogleTagManager` Component를 사용한다.

```tsx
import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <GoogleTagManager gtmId="GTM-XXXXXXX" />
      <body>{children}</body>
    </html>
  );
}
```

이 Component는 내부적으로:
- `<head>`에 GTM inline script 삽입
- `<body>` 직후에 `<noscript>` iframe fallback 삽입

### 환경변수 설계

```env
# .env.local (신규)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# .env.local (기존 — GTM 이관 후 불요)
# NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxx  ← GTM에서 관리
```

| 변수 | 용도 | 비고 |
|------|------|------|
| `NEXT_PUBLIC_GTM_ID` | GTM Container ID | 필수. 미설정 시 GTM Script 미삽입 |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Clarity Project ID | GTM 이관 완료 후 삭제 가능 |

## Implementation Details

### 변경 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `package.json` | `@next/third-parties` Package 추가 |
| `src/app/layout.tsx` | GTM Component 추가, 기존 GA4・Clarity Script 삭제 |
| `.env.local` | `NEXT_PUBLIC_GTM_ID` 추가 |
| `.env.example` | `NEXT_PUBLIC_GTM_ID` 추가 (Template) |

### layout.tsx 변경 후 이미지

```tsx
import { GoogleTagManager } from '@next/third-parties/google';

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <body className={`${noto.className} ${dmSans.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 삭제되는 코드

- GA4 `gtag.js` Script Tag (2개)
- Microsoft Clarity Script Tag (1개)
- `next/script`의 `Script` import (다른 곳에서 사용하지 않는 경우)

## GTM Console 설정 (코드 외 작업)

GTM 導入 후, GTM Web Console에서 다음 Tag를 설정해야 한다:

### Tag 1: Google Analytics 4

| 항목 | 설정 |
|------|------|
| Tag Type | Google Analytics: GA4 Configuration |
| Measurement ID | `G-M9E2FH8EK1` |
| Trigger | All Pages |

### Tag 2: Microsoft Clarity

| 항목 | 설정 |
|------|------|
| Tag Type | Custom HTML |
| HTML | Clarity tracking script |
| Trigger | All Pages |

## Constraints

- `@next/third-parties/google`는 Next.js 14+ 지원 (현 프로젝트 Next.js 16 호환)
- GTM ID는 환경변수로 관리하며, 소스 코드에 하드코딩하지 않는다
- 기존 GA4 직접 삽입 Script를 반드시 삭제한다 (이중 계측 방지)
- GTM Console에서 GA4 Tag 설정이 완료될 때까지 GA4 데이터 수집이 일시 중단될 수 있다

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| 이중 계측 | PV 등의 지표가 2배로 잡힘 | 기존 GA4 Script 삭제를 코드 변경과 동시에 수행 |
| GA4 데이터 공백 | GTM 설정 전까지 데이터 미수집 | GTM Console에서 GA4 Tag를 먼저 설정 후 배포 |
| GTM ID 미설정 | Script 미삽입으로 추적 불가 | 조건부 렌더링으로 에러 방지, `.env.example`에 Template 기재 |
