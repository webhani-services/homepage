# launchd를 이용한 daily-blog 자동 실행 가이드

## 개요

macOS의 launchd Scheduler를 이용해 매일 아침 7시에 Claude Code CLI를 직접 실행합니다. 최신 기술 뉴스로부터 Blog 글을 생성하고, Branch 생성과 Draft PR 발행, CI 통과 후 master Merge까지 완전 자동으로 수행합니다.

API Key가 아닌, 머신에 설치된 Claude Code CLI에 직접 Prompt를 전달하여 실행하는 방식입니다.

> **참고**: 과거에는 OpenClaw Gateway의 Scheduler로 실행했으나, 현재는 OpenClaw를 사용하지 않으므로 macOS 네이티브 Scheduler인 **launchd**로 전환했습니다. 별도 Daemon이나 Gateway 없이 OS가 직접 예약 실행합니다.

## 사전 조건

- macOS 머신 (LaunchAgent는 사용자 GUI Session에서 동작)
- Claude Code CLI가 설치되어 있을 것 (`claude` — `~/.local/bin`)
- `gh` CLI, `gtimeout` (coreutils) 설치 — `/opt/homebrew/bin`
- GitHub 인증이 설정되어 있을 것 (`gh auth login` 또는 SSH Key)
- 본 Project가 머신에 clone 되어 있을 것

## 실행 흐름

```text
[launchd (매일 아침 7:00, 시스템 로컬 시각)]
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
[CI 통과 시 PR ready → master Merge → local master 갱신 → Branch 삭제]
  ↓
[Log를 logs/daily-blog-{YYYY-MM-DD}.log에 저장]
```

## 실행 Script

Script는 `scripts/cron/daily-blog.sh`에 위치합니다.

### 동작 방식

- `PROJECT_DIR`은 Script 위치 기준 상대 경로로 자동 계산되므로, 어떤 머신에서든 동작합니다
- `claude -p "..."`로 Claude Code CLI를 비 Interactive 모드로 직접 실행합니다
- `--allowedTools`로 필요한 Tool 권한만 허용합니다
- launchd / cron은 PATH를 최소(`/usr/bin:/bin`)로 띄우므로, Script 상단에서 `~/.local/bin`(claude)·`/opt/homebrew/bin`(gh, gtimeout)을 PATH에 명시적으로 추가합니다
- Lock File 배타 제어, 실패 시 Branch 복구 Trap, 30일 Log Rotation, 동일 날짜 Branch 존재 시 Skip 등 안전장치 내장
- 종료 코드를 반환하므로 launchd에서 성공/실패 판정이 가능합니다

### 주요 처리

1. `master` Branch를 최신으로 업데이트
2. Claude Code CLI에 Prompt를 전달하여 실행
3. Claude Code가 Web 검색 → Topic 선정 → Blog 생성 → `blog/daily-{YYYY-MM-DD}` Branch 생성 → Push → Draft PR 생성
4. CI 통과 시 PR을 ready for review로 변경 → master로 Merge → local master 갱신 → 작업 Branch 삭제
5. 전체 과정의 Log를 `logs/daily-blog-{YYYY-MM-DD}.log`에 저장

### Prompt 내용

Script 내 Prompt에서 Claude Code에 다음을 지시합니다:

- **Step 1**: Web 검색으로 최신 기술 뉴스 수집 (Web 개발, Cloud, AI/LLM, DevOps 등)
- **Step 2**: Top 3 Topic 자동 선정 (최소 1건은 LLM/AI 관련)
- **Step 3**: 각 Topic을 ja/en/ko 3개 Locale로 Blog 생성 (총 9개 파일)
- **Step 4**: `blog/daily-{YYYY-MM-DD}` Branch 생성 → Push → Draft PR 생성
- **규칙**: 사용자 확인 없음, Copyright/Tone 가이드라인 엄수

## launchd 설정

### LaunchAgent plist

`~/Library/LaunchAgents/com.webhani.daily-blog.plist`에 배치합니다.

| 항목                  | 값                                                              |
| --------------------- | -------------------------------------------------------------- |
| Label                 | `com.webhani.daily-blog`                                       |
| StartCalendarInterval | `Hour 7 / Minute 0` (매일 아침 7시, 시스템 로컬 시각)          |
| ProgramArguments      | `/bin/bash <PROJECT_DIR>/scripts/cron/daily-blog.sh`           |
| EnvironmentVariables  | `PATH`에 `~/.local/bin`·`/opt/homebrew/bin` 포함, `HOME` 명시  |
| RunAtLoad             | `false` (로그인 시 즉시 실행하지 않고 예약 시각에만)           |
| StandardOutPath       | `<PROJECT_DIR>/logs/launchd-daily-blog.out`                    |
| StandardErrorPath     | `<PROJECT_DIR>/logs/launchd-daily-blog.err`                    |

> launchd의 `StartCalendarInterval`은 cron과 달리, 머신이 슬립 중이어서 예약 시각을 놓쳐도 **다음에 깨어날 때 실행**합니다. 항상 켜진 머신이 아니어도 누락이 적습니다.

### 등록 / 갱신 / 해제

```bash
# 등록 (또는 plist 수정 후 재적용)
launchctl bootout "gui/$(id -u)/com.webhani.daily-blog" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" ~/Library/LaunchAgents/com.webhani.daily-blog.plist

# 등록 확인 (Label이 보이면 정상)
launchctl list | grep webhani

# 스케줄 상세 확인
launchctl print "gui/$(id -u)/com.webhani.daily-blog"

# 해제 (자동 실행 중단)
launchctl bootout "gui/$(id -u)/com.webhani.daily-blog"
```

> plist 내용을 수정한 뒤에는 반드시 `bootout` → `bootstrap`으로 재적용해야 변경이 반영됩니다.

### 즉시 1회 수동 실행 (Test)

launchd 스케줄을 기다리지 않고 바로 한 번 돌려 동작을 확인합니다:

```bash
# launchd 경유로 즉시 실행 (실제 예약 실행과 동일 환경)
launchctl kickstart -k "gui/$(id -u)/com.webhani.daily-blog"

# 또는 Script를 직접 실행 (터미널 환경에서)
./scripts/cron/daily-blog.sh
```

실행 후, 다음을 확인:

- `logs/daily-blog-{오늘 날짜}.log`가 생성되었는지
- `logs/launchd-daily-blog.err`에 launchd 레벨 오류가 없는지
- GitHub에 `blog/daily-{오늘 날짜}` Branch와 PR이 생성되었는지

## Prompt 커스터마이징

Prompt를 변경하려면 `scripts/cron/daily-blog.sh` 내 `PROMPT` 블록을 수정하세요.

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

Log는 `logs/daily-blog-{YYYY-MM-DD}.log`에 저장됩니다 (`.gitignore`의 `/logs`로 제외됨). launchd 부트스트랩 출력은 `logs/launchd-daily-blog.out` / `.err`에 별도 기록됩니다.

```bash
# 최신 Log 확인
tail -50 logs/daily-blog-$(date +%Y-%m-%d).log

# launchd 레벨 오류 확인 (claude를 못 찾는 등 PATH 문제)
cat logs/launchd-daily-blog.err

# 오래된 Log 삭제 (30일 이상) — Script가 자동으로도 수행
find logs/ -name "daily-blog-*.log" -mtime +30 -delete
```

## 트러블슈팅

| 문제                        | 원인                          | 조치                                                                        |
| --------------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| `claude: command not found` | launchd PATH에 `~/.local/bin` 누락 | plist `EnvironmentVariables.PATH`와 Script L24 PATH 확인                |
| `gh`/`gtimeout` not found   | launchd PATH에 `/opt/homebrew/bin` 누락 | 동일 — 두 곳 PATH에 homebrew 경로 포함 확인                          |
| 예약 시각에 실행 안 됨      | plist 미적용 / 미등록         | `launchctl list \| grep webhani`로 확인, 없으면 `bootstrap` 재실행          |
| plist 수정이 반영 안 됨     | 재적용 누락                   | `bootout` → `bootstrap` 순서로 재적용                                        |
| git push 실패               | 인증 문제                     | `gh auth status` 확인, SSH Key / Token 설정 확인                            |
| Branch가 이미 존재함        | 같은 날 2회 실행됨            | Script가 `origin/blog/daily-${DATE}` 존재 시 자동 Skip                       |
| Topic에 LLM/AI 미포함       | Prompt 제약이 약함            | "반드시 1건 이상" 문구 강조                                                  |
| Timeout으로 중단됨          | 생성 시간이 김                | Script 내 `TIMEOUT_SECONDS`(기본 1800s) 조정                                |
| 글 품질이 낮음              | Prompt 지시가 부족함          | `.claude/commands/daily-blog.md` 가이드라인 참조를 명시                      |
