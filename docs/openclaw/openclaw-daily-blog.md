# OpenClaw를 이용한 daily-blog 자동 실행 가이드

## 개요

OpenClaw Gateway가 설치된 머신에서 매일 오전 8시에 Claude Code CLI를 직접 실행하여, 최신 기술 뉴스로부터 Blog 글을 생성하고 Branch 생성, Draft PR 발행까지 완전 자동으로 수행합니다.

API Key가 아닌, 머신에 설치된 Claude Code CLI에 직접 Prompt를 전달하여 실행하는 방식입니다.

## 사전 조건

- OpenClaw Gateway가 설정되어 있고, 대상 머신에서 동작 중일 것
- Claude Code CLI가 설치되어 있을 것 (`claude` 명령어 사용 가능)
- 대상 머신에 본 프로젝트가 clone 되어 있을 것
- GitHub 인증이 설정되어 있을 것 (SSH Key 또는 `gh auth login`)

## 실행 흐름

```text
[OpenClaw Scheduler (매일 오전 8:00)]
  ↓
[scripts/cron/daily-blog.sh 실행]
  ↓
[Project Directory로 자동 이동 (Script 기준 상대 경로로 계산)]
  ↓
[git fetch & master를 최신으로 업데이트]
  ↓
[Claude Code CLI를 비 Interactive 모드로 실행 (claude -p)]
  ↓
[Web 검색 → Topic 선정 → Blog 생성 → Branch 생성 → Push → Draft PR]
  ↓
[Log를 logs/daily-blog-{YYYY-MM-DD}.log에 저장]
```

## 실행 Script

Script는 `scripts/cron/daily-blog.sh`에 위치합니다.

### 동작 방식

- `PROJECT_DIR`은 Script 위치 기준 상대 경로로 자동 계산되므로, 어떤 머신에서든 동작합니다
- `claude -p "..."`로 Claude Code CLI를 비 Interactive 모드로 직접 실행합니다
- `--allowedTools`로 필요한 Tool 권한만 허용합니다
- 종료 코드를 반환하므로 OpenClaw에서 성공/실패 판정이 가능합니다

### Script 내용 확인

```bash
cat scripts/cron/daily-blog.sh
```

### 주요 처리

1. `master` Branch를 최신으로 업데이트
2. Claude Code CLI에 Prompt를 전달하여 실행
3. Claude Code가 Web 검색 → Topic 선정 → Blog 생성 → `blog/daily-{YYYY-MM-DD}` Branch 생성 → Push → Draft PR 생성
4. 전체 과정의 Log를 `logs/daily-blog-{YYYY-MM-DD}.log`에 저장

### Prompt 내용

Script 내 Prompt에서 Claude Code에 다음을 지시합니다:

- **Step 1**: Web 검색으로 최신 기술 뉴스 수집 (Web 개발, Cloud, AI/LLM, DevOps 등)
- **Step 2**: Top 3 Topic 자동 선정 (최소 1건은 LLM/AI 관련)
- **Step 3**: 각 Topic을 ja/en/ko 3개 Locale로 Blog 생성 (총 9개 파일)
- **Step 4**: `blog/daily-{YYYY-MM-DD}` Branch 생성 → Push → Draft PR 생성
- **규칙**: 사용자 확인 없음, Copyright/Tone 가이드라인 엄수

## OpenClaw에 전달할 내용

OpenClaw에 아래와 같이 전달하세요.

### OpenClaw Prompt

- Draft PR 생성

```text
매일 오전 8시(JST)에 아래의 Shell Script가 자동 실행되도록 스케줄을 설정해 주세요.

실행 스크립트: {PROJECT_DIR}/scripts/cron/daily-blog.sh

이 스크립트는 webhani 홈페이지 프로젝트 내에 위치한
블로그 자동 생성용 Shell Script입니다.
Claude Code CLI를 비인터랙티브(비대화형) 모드로 실행하여,
최신 기술 뉴스를 바탕으로 블로그 글 3개를 생성하고,
날짜별로 git 브랜치를 생성한 뒤 Draft PR을 발행합니다.

설정 조건:
- 스케줄: 매일 오전 8시(JST)
- 실행 방식: Shell Command로 실행
- 타임아웃: 600초(블로그 생성에 시간이 소요될 수 있음)
- 실행 유저: Claude Code CLI 및 git/gh 커맨드를 사용할 수 있는 사용자
- 실패 시: Log 파일(logs/daily-blog-{YYYY-MM-DD}.log)을 확인할 수 있도록 할 것
- 알림: 실패 시 알림 전송(선택 사항)
```

- public

```text
매일 오전 8시(JST)에 아래의 Shell Script가 자동 실행되도록 스케줄을 설정해 주세요.

실행 스크립트: {PROJECT_DIR}/scripts/cron/daily-blog.sh

이 스크립트는 webhani 홈페이지 프로젝트 내에 위치한
블로그 자동 생성용 Shell Script입니다.
Claude Code CLI를 비인터랙티브(비대화형) 모드로 실행하여,
최신 기술 뉴스를 바탕으로 블로그 글 3개를 생성하고,
날짜별로 git 브랜치를 생성한 뒤 Draft PR을 발행합니다.
CI 가 성공하면 master 브랜치로 merge 합니다.
local 에서 master branch 로 checkout 하고, git pull 을 해서 master branch 를 최신으로 업데이트 합니다.

설정 조건:
- 스케줄: 매일 오전 8시(JST)
- 실행 방식: Shell Command로 실행
- 타임아웃: 600초(블로그 생성에 시간이 소요될 수 있음)
- 실행 유저: Claude Code CLI 및 git/gh 커맨드를 사용할 수 있는 사용자
- 실패 시: Log 파일(logs/daily-blog-{YYYY-MM-DD}.log)을 확인할 수 있도록 할 것
- 알림: 실패 시 알림 전송(선택 사항)
```

### 보충 설명

OpenClaw에 위 내용을 전달할 때, 다음을 확인하세요:

- `{PROJECT_DIR}`은 실제 Project Path로 치환할 것 (예: `/home/user/homepage`)
- OpenClaw가 동작하는 사용자로 `claude` 명령어와 `gh` 명령어가 실행 가능할 것
- `scripts/cron/daily-blog.sh`에 실행 권한 (`chmod +x`)이 부여되어 있을 것

## OpenClaw Scheduler 설정 (수동 설정 시)

OpenClaw 관리 화면에서 수동으로 설정하는 경우의 절차입니다.

### Step 1: Script 실행 권한 확인

```bash
chmod +x scripts/cron/daily-blog.sh
```

### Step 2: OpenClaw에 등록

OpenClaw 설정 화면에서 아래를 등록:

| 항목            | 값                                           |
| --------------- | -------------------------------------------- |
| Trigger         | Schedule (Cron)                              |
| Cron Expression | `0 8 * * *` (매일 오전 8:00 JST)             |
| Action          | Shell Command                                |
| Command         | `{PROJECT_DIR}/scripts/cron/daily-blog.sh`   |
| Timeout         | 600s (Blog 생성에 시간이 걸리므로 여유를 둠) |

`{PROJECT_DIR}`은 실제 Project Path로 치환하세요.

### Step 3: 동작 확인

수동으로 한 번 실행하여 Test합니다:

```bash
./scripts/cron/daily-blog.sh
```

실행 후, 다음을 확인:

- `logs/daily-blog-{오늘 날짜}.log`가 생성되었는지
- GitHub에 `blog/daily-{오늘 날짜}` Branch가 생성되었는지
- Draft PR이 생성되었는지

## Prompt 커스터마이징

Prompt를 변경하려면 `scripts/cron/daily-blog.sh` 내 `PROMPT` 블록을 수정하세요.

### Draft가 아닌 Published로 생성하는 경우

Step 3의 행을 변경:

```text
   - status는 "published"로 저장
```

### 특정 분야에 집중하는 경우

Step 1의 대상 분야를 좁힙니다:

```text
1. Web 검색으로 오늘의 최신 기술 뉴스를 수집하세요. 대상 분야:
   - AI/LLM (Claude, GPT, AI Coding Assistant 등)으로 한정
```

### Branch만 생성하고 PR은 생성하지 않는 경우

Step 4에서 PR 관련 행을 삭제:

```text
4. 생성 완료 후, 아래 git 작업을 실행하세요:
   - `master` Branch에서 새 Branch 생성: `blog/daily-{YYYY-MM-DD}`
   - 생성된 MDX 파일을 모두 `git add`
   - Commit 메시지: "add daily blog posts: {YYYY-MM-DD}"
   - 생성한 Branch에 push
```

## Log 관리

Log는 `logs/daily-blog-{YYYY-MM-DD}.log`에 저장됩니다 (`.gitignore`에 추가됨).

```bash
# 최신 Log 확인
tail -50 logs/daily-blog-$(date +%Y-%m-%d).log

# 오래된 Log 삭제 (30일 이상)
find logs/ -name "daily-blog-*.log" -mtime +30 -delete
```

## 트러블슈팅

| 문제                        | 원인                     | 조치                                                         |
| --------------------------- | ------------------------ | ------------------------------------------------------------ |
| `claude: command not found` | PATH가 설정되지 않음     | Script 내 PATH 설정 확인, 필요 시 Claude Code 경로 추가      |
| Web 검색 실패               | WebSearch Tool 권한 부족 | `--allowedTools`에 `WebSearch`가 포함되어 있는지 확인        |
| git push 실패               | 인증 문제                | SSH Key / GitHub Token 설정 확인                             |
| Branch가 이미 존재함        | 같은 날 2회 실행됨       | Script에 `git branch -D blog/daily-${DATE} 2>/dev/null` 추가 |
| Topic에 LLM/AI 미포함       | Prompt 제약이 약함       | "반드시 1건 이상" 문구 강조                                  |
| Timeout으로 중단됨          | 생성 시간이 김           | OpenClaw Timeout을 900s 이상으로 설정                        |
| 글 품질이 낮음              | Prompt 지시가 부족함     | `daily-blog.md` 가이드라인 참조를 명시                       |
