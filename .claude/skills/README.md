# Claude Code Skills

Claude Code의 Skill 예시 모음입니다. `.claude/skills/<skill-name>/SKILL.md` 에 배치하여 사용합니다.

## Skill 목록

| Skill | Description |
|-------|-------------|
| `create-pr` | 변경 사항을 Commit 하고 PR Template에 따라 Draft PR 생성 |
| `handle-pr-reviews` | PR Review Comment 확인, 수정, 답변 자동화 |
| `release-pr-list` | Release PR의 포함 PR/Author 목록을 정리하고 PR description 갱신 |
| `cc-feature-implementer` | TDD 기반 단계적 Feature 구현 계획 생성 |

## 사용 방법

1. 사용할 Skill 폴더를 프로젝트의 `.claude/skills/` 디렉토리에 복사
2. Claude Code가 자동으로 Skill을 인식하여 관련 작업 시 활용

## Directory 구조

```
skills/
├── README.md                    # 이 파일
├── create-pr/
│   └── SKILL.md                 # PR 생성 Skill
├── handle-pr-reviews/
│   └── SKILL.md                 # PR Review 대응 Skill
├── release-pr-list/
│   └── SKILL.md                 # Release PR 목록 정리 Skill
└── cc-feature-implementer/
    ├── README.md                # Skill 상세 Guide
    ├── SKILL.md                 # Skill 정의
    └── plan-template.md         # Implementation Plan Template
```
