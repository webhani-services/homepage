# Google Tag Manager 설정 가이드

> 이 문서는 Google Tag Manager (GTM) Console에서 Tag, Trigger를 설정하는 방법을 설명합니다.
> 코드 변경 작업은 [specification.md](./specification.md)과 [task.md](./task.md)를 참조하세요.

## 목차

- [Google Tag Manager 설정 가이드](#google-tag-manager-설정-가이드)
  - [목차](#목차)
  - [1. GTM Container 생성](#1-gtm-container-생성)
  - [2. Google Tag (GA4 연동) 설정](#2-google-tag-ga4-연동-설정)
    - [설정 순서](#설정-순서)
    - [확인 사항](#확인-사항)
  - [3. GA4 Page View Event Tag 설정](#3-ga4-page-view-event-tag-설정)
    - [설정 순서](#설정-순서-1)
    - [확인 사항](#확인-사항-1)
  - [4. Microsoft Clarity Tag 설정](#4-microsoft-clarity-tag-설정)
    - [설정 순서](#설정-순서-2)
  - [5. Preview Mode로 동작 검증](#5-preview-mode로-동작-검증)
    - [검증 순서](#검증-순서)
    - [검증 체크리스트](#검증-체크리스트)
    - [Troubleshooting](#troubleshooting)
  - [6. Container 공개 (Publish)](#6-container-공개-publish)
    - [공개 순서](#공개-순서)
    - [공개 후 확인](#공개-후-확인)
  - [프로젝트 정보](#프로젝트-정보)
  - [참고 자료](#참고-자료)

---

## 1. GTM Container 생성

> 이미 Container가 있는 경우 (`GTM-P6BQ225N`) 이 단계를 건너뛰세요.

1. [Google Tag Manager](https://tagmanager.google.com/)에 접속
2. **Create Account** 클릭
3. Account 정보 입력:
   - **Account Name**: `webhani`
   - **Country**: `Japan`
4. Container 정보 입력:
   - **Container Name**: `homepage`
   - **Target Platform**: `Web`
5. **Create** → 이용약관 동의
6. Container ID 확인 (형식: `GTM-XXXXXXX`)
7. 이 ID를 `.env`의 `NEXT_PUBLIC_GTM_ID`에 설정

```dotenv
NEXT_PUBLIC_GTM_ID=GTM-P6BQ225N
```

> **참고**: 코드 측에서는 `@next/third-parties/google`의 `GoogleTagManager` 컴포넌트가
> GTM Console에서 제공하는 `<head>` script와 `<body>` noscript iframe을 자동으로 삽입합니다.
> 수동으로 스니펫을 붙여넣을 필요가 없습니다.

## 2. Google Tag (GA4 연동) 설정

Google Tag는 GA4와의 연결을 확립하는 **기반 Tag**입니다. 이 Tag가 있어야 GA4 Event Tag가 동작합니다.

### 설정 순서

1. 좌측 메뉴에서 **Tags** → **New** 클릭
2. **Tag Configuration** 클릭 → **Google Tag** 선택
3. 설정 입력:
   - **Tag ID**: `G-M9E2FH8EK1` (GA4 Measurement ID)
4. **Triggering** 클릭 → **All Pages** 선택
5. Tag 이름을 `Google Tag - GA4`로 변경
6. **Save** 클릭

### 확인 사항

| 항목     | 값             |
| -------- | -------------- |
| Tag Type | Google Tag     |
| Tag ID   | `G-M9E2FH8EK1` |
| Trigger  | All Pages      |

## 3. GA4 Page View Event Tag 설정

Page View 이벤트를 GA4에 전송하기 위한 Tag입니다.

### 설정 순서

1. **Tags** → **New** 클릭
2. **Tag Configuration** → **Google Analytics: GA4 Event** 선택
3. 설정 입력:
   - **Measurement ID**: `G-M9E2FH8EK1`
   - **Event Name**: `page_view`
4. **Triggering** → **All Pages** 선택
5. Tag 이름을 `GA4 - Page View`로 변경
6. **Save**

### 확인 사항

| 항목           | 값                          |
| -------------- | --------------------------- |
| Tag Type       | Google Analytics: GA4 Event |
| Measurement ID | `G-M9E2FH8EK1`              |
| Event Name     | `page_view`                 |
| Trigger        | All Pages                   |

> **참고**: Google Tag (섹션 2)를 설정하면 기본 page_view는 자동 전송됩니다.
> 추가적인 Event Parameter를 커스터마이즈하고 싶은 경우에만 이 Tag를 별도로 생성하세요.

## 4. Microsoft Clarity Tag 설정

Clarity는 GTM의 Custom HTML Tag로 설정합니다.

### 설정 순서

1. **Tags** → **New** 클릭
2. **Tag Configuration** → **Custom HTML** 선택
3. 아래 스크립트를 HTML 필드에 입력:

```html
<script type="text/javascript">
  (function (c, l, a, r, i, t, y) {
    G - M9E2FH8EK1;
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
</script>
```

4. `YOUR_CLARITY_PROJECT_ID`를 실제 Clarity Project ID로 교체
5. **Triggering** → **All Pages** 선택
6. Tag 이름을 `Clarity`로 변경
7. **Save**

> **Clarity Project ID 확인 방법**: [clarity.microsoft.com](https://clarity.microsoft.com/) →
> 프로젝트 선택 → Settings → Overview → Project ID

## 5. Preview Mode로 동작 검증

Container를 공개하기 전에 반드시 Preview Mode에서 동작을 검증합니다.

### 검증 순서

1. GTM Console 우측 상단의 **Preview** 클릭
2. 사이트 URL 입력 (예: `http://localhost:8080`) → **Connect**
3. Tag Assistant 창에서 동작 확인

### 검증 체크리스트

- [ ] **Tags Fired 확인**: `Google Tag - GA4`가 표시됨
- [ ] **Tags Fired 확인**: `Clarity`가 표시됨
- [ ] **Browser DevTools → Network**: `gtm.js` 로드 확인
- [ ] **Browser DevTools → Console**: `dataLayer` 객체 존재 확인
- [ ] **GA4 Real-time Report**: 이벤트 수신 확인

### Troubleshooting

| 문제                     | 원인                        | 해결 방법                                                           |
| ------------------------ | --------------------------- | ------------------------------------------------------------------- |
| GTM이 로드되지 않음      | `NEXT_PUBLIC_GTM_ID` 미설정 | `.env`에 `NEXT_PUBLIC_GTM_ID=GTM-P6BQ225N` 설정 후 개발 서버 재시작 |
| Tag가 발화하지 않음      | Trigger가 설정되지 않음     | Tag의 Triggering에서 **All Pages**가 선택되어 있는지 확인           |
| GA4에 데이터가 안 들어옴 | Measurement ID 오류         | Tag ID가 `G-M9E2FH8EK1`과 정확히 일치하는지 확인                    |
| Preview가 연결되지 않음  | 팝업 차단                   | 브라우저의 팝업 차단을 해제하고 다시 시도                           |

## 6. Container 공개 (Publish)

Preview Mode에서 모든 동작이 확인되면 Container를 공개합니다.

### 공개 순서

1. GTM Console 우측 상단의 **Submit** 클릭
2. **Version Name** 입력 (예: `v1.0 - Initial GTM Setup`)
3. **Version Description** 입력:
   ```
   - Google Tag (GA4 Configuration: G-M9E2FH8EK1) 추가
   - GA4 Page View Event Tag 추가
   - Microsoft Clarity Custom HTML Tag 추가
   ```
4. **Publish** 클릭

### 공개 후 확인

- [ ] 프로덕션 사이트에서 Browser DevTools → Network 탭에서 `gtm.js` 로드 확인
- [ ] GA4 Real-time Report에서 Page View 이벤트 수신 확인
- [ ] Clarity Dashboard에서 세션 기록 시작 확인
- [ ] 기존 GA4 직접 로드 (`gtag.js?id=G-M9E2FH8EK1`)가 **없는** 것을 확인 (이중 계측 방지)

---

## 프로젝트 정보

| 항목               | 값                                                         |
| ------------------ | ---------------------------------------------------------- |
| GTM Container ID   | `GTM-P6BQ225N`                                             |
| GA4 Measurement ID | `G-M9E2FH8EK1`                                             |
| 코드 구현 방식     | `@next/third-parties/google` - `GoogleTagManager` 컴포넌트 |
| 환경 변수          | `NEXT_PUBLIC_GTM_ID`                                       |

## 참고 자료

- [Google Tag Manager 공식 문서](https://developers.google.com/tag-platform/tag-manager/web)
- [Next.js Third Parties - Google Tag Manager](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-tag-manager)
- [GA4 이벤트 설정 가이드](https://support.google.com/analytics/answer/9234069)
- [Microsoft Clarity GTM 설정 가이드](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-gtm)
