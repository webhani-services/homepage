# Feature Implementer Skill

## 개요

**Feature Implementer (feature-planner)** Skill은 TDD(Test-Driven Development) 기반의 단계적 Feature 구현 계획을 생성하는 Claude Code Skill입니다.

**주요 기능:**

- Phase 기반 Feature 계획 생성 (3-7 단계로 구조화)
- TDD Workflow 통합 (Red-Green-Refactor Cycle)
- Quality Gate 및 검증 Checkpoint 자동 포함
- 구현 진행 상황 추적 (Markdown Checkbox 기반)
- Rollback Strategy 및 Risk Assessment 자동 생성

**사용 대상:**

- 복잡한 Feature를 단계적으로 구현해야 하는 개발자
- TDD 방식으로 품질 높은 Code를 작성하고자 하는 팀
- 명확한 검증 기준과 함께 작업 진행을 추적하고 싶은 프로젝트

---

## 사용 방법

### Skill 호출

Claude Code에서 다음과 같이 호출합니다:

```
User: [Feature 설명] 기능을 구현하고 싶습니다. 단계별 계획을 만들어주세요.
```

또는 명시적으로:

```
User: /feature-planner를 사용해서 [기능명] 구현 계획을 작성해주세요.
```

### Workflow

1. **Requirements 분석**: Codebase 구조 파악 및 의존성 확인
2. **Phase 분해**: Feature를 3-7개 Phase로 분할 (각 1-4시간 규모)
3. **Plan 문서 작성**: `docs/plans/PLAN_<feature-name>.md` 생성
4. **사용자 승인**: Plan 확정 전 명시적 승인 요청
5. **문서 생성 및 안내**: 생성된 Plan 위치 및 다음 단계 안내

---

## 생성되는 Plan 구조

생성된 Implementation Plan은 다음 항목을 포함합니다:

### 기본 정보

- Feature 설명 및 목표
- Success Criteria
- Architecture 결정 사항 및 근거

### Phase별 구성 (TDD 기반)

각 Phase는 다음과 같이 구조화됩니다:

```markdown
### Phase N: [Phase 이름]

**🔴 RED: Write Failing Tests First**

- Test 작성 (Feature 구현 전 실패하는 Test 먼저 작성)

**🟢 GREEN: Implement to Make Tests Pass**

- 최소한의 Code로 Test 통과시키기

**🔵 REFACTOR: Clean Up Code**

- Test가 통과하는 상태를 유지하며 Code 품질 개선

**Quality Gate ✋**

- Build, Test, Code Quality, Security, Documentation 검증
```

### 추가 섹션

- **Test Strategy**: Test 유형별 Coverage 목표 및 전략
- **Risk Assessment**: 위험 요소 및 완화 전략
- **Rollback Strategy**: Phase별 Rollback 방법
- **Progress Tracking**: 진행률 및 시간 추적
- **Notes & Learnings**: 구현 중 발견한 Insight 기록

---

## 주요 특징

### 1. TDD 중심 Workflow

모든 Phase에서 **Test-First Development**를 강제합니다:

- **Red Phase**: 실패하는 Test 먼저 작성
- **Green Phase**: Test를 통과시키는 최소 구현
- **Refactor Phase**: Test를 유지하며 Code 품질 개선

### 2. 엄격한 Quality Gate

각 Phase 완료 시 다음 항목을 반드시 검증:

- Build/Compile 성공
- 모든 Test 통과
- Code Coverage 목표 달성 (일반적으로 ≥80%)
- Linting 및 Type Check 통과
- Security 취약점 없음
- Performance 저하 없음

### 3. 점진적 Delivery

각 Phase는:

- 독립적으로 동작 가능한 기능 제공
- 1-4시간 이내 완료 가능
- 명확한 Success Criteria 보유
- 독립적으로 Rollback 가능

### 4. 체계적인 문서화

- 구현 진행 상황 실시간 추적
- Architecture 결정 사항 기록
- Risk 및 Blocker 문서화
- 향후 참고를 위한 Learning 기록

---

## Test Strategy

### Test Pyramid 구조

| Test 유형             | Coverage 목표  | 목적                           |
| --------------------- | -------------- | ------------------------------ |
| **Unit Tests**        | ≥80%           | Business Logic, Core Algorithm |
| **Integration Tests** | Critical Paths | Component 상호작용, Data Flow  |
| **E2E Tests**         | Key User Flows | 전체 시스템 동작 검증          |

### Test Coverage Command 예시

```bash
# JavaScript/TypeScript
jest --coverage

# Python
pytest --cov=src --cov-report=html

# Go
go test -cover ./...

# Java
mvn jacoco:report

# .NET
dotnet test /p:CollectCoverage=true
```

---

## Phase Sizing Guide

| Scope  | Phase 수 | 총 시간   | 예시                                  |
| ------ | -------- | --------- | ------------------------------------- |
| Small  | 2-3      | 3-6시간   | Dark Mode Toggle, Form Component 추가 |
| Medium | 4-5      | 8-15시간  | 인증 시스템, 검색 기능                |
| Large  | 6-7      | 15-25시간 | AI 검색, Real-time Collaboration      |

---

## 파일 구조

```
anthropic/claude-code/skills/cc-feature-implementer/
├── README.md            # 이 파일 (Skill 사용 가이드)
├── SKILL.md             # Skill 정의 및 상세 지침
└── plan-template.md     # Implementation Plan Template
```

**주의:** `.claude/skills/` 디렉토리에 배포 시 `README.md`는 제외합니다.

---

## 사용 예시

### Example 1: 간단한 Feature 추가

```
User: 사용자 Profile 페이지에 Avatar 업로드 기능을 추가하고 싶습니다.

Claude: Avatar 업로드 기능 구현 계획을 만들겠습니다.
먼저 Codebase를 분석하여 기존 Profile 구조를 파악하겠습니다.

[Codebase 분석 수행]

Small Scope로 판단되어 3개 Phase로 구성합니다:
- Phase 1: Image Upload Component 및 Test 작성
- Phase 2: Backend API Endpoint 구현
- Phase 3: Profile 페이지 통합 및 E2E Test

이 계획으로 진행해도 될까요?
```

### Example 2: 복잡한 Feature 계획

```
User: 실시간 알림 시스템을 추가해야 합니다. WebSocket을 사용할 예정입니다.

Claude: 실시간 알림 시스템은 Large Scope로 판단됩니다.
6개 Phase로 계획을 구성하겠습니다:

Phase 1: WebSocket Server 기초 구조 + Test
Phase 2: 알림 Data Model 및 Repository Layer
Phase 3: 알림 생성 및 전송 Business Logic
Phase 4: Client WebSocket 연결 관리
Phase 5: UI Notification Component 구현
Phase 6: End-to-End Integration 및 Performance Test

각 Phase는 TDD 방식으로 진행되며, Quality Gate를 통과해야 다음 단계로 진행합니다.
```

---

## Best Practices

### 1. Plan 작성 전 충분한 분석

Skill 실행 전에 다음을 준비하세요:

- 구현하려는 Feature의 명확한 설명
- 기존 Codebase 구조에 대한 이해
- 예상되는 기술적 제약사항

### 2. Phase 크기 적절히 유지

- 각 Phase는 1-4시간 내 완료 가능해야 함
- 너무 큰 Phase는 추가 분해 고려
- 각 Phase가 독립적으로 Test 가능해야 함

### 3. Quality Gate 엄격히 준수

- 모든 Test가 통과하기 전에는 다음 Phase로 이동하지 않음
- Coverage 목표 미달성 시 추가 Test 작성
- Build 실패나 Linting Error는 즉시 수정

### 4. TDD Cycle 준수

- 반드시 Test를 먼저 작성 (Red Phase)
- Test가 실패하는 이유를 명확히 이해
- 최소한의 Code로 Test 통과 (Green Phase)
- Test 통과 후 Refactoring 진행 (Refactor Phase)

### 5. 문서 지속적 업데이트

- 각 Phase 완료 시 Checkbox 체크
- 발견한 Issue나 Learning을 Notes 섹션에 기록
- Architecture 결정 변경 시 문서 반영

---

## Troubleshooting

### Q: Plan 생성 후 Phase 순서를 변경하고 싶습니다

**A**: `docs/plans/PLAN_<feature-name>.md` 파일을 직접 편집하여 Phase 순서를 조정할 수 있습니다. 단, 의존성 관계를 반드시 확인하세요.

### Q: Quality Gate 항목이 프로젝트와 맞지 않습니다

**A**: Plan Template의 Quality Gate 섹션을 프로젝트에 맞게 커스터마이징하세요. 예를 들어, Type Check가 없는 프로젝트라면 해당 항목을 제거합니다.

### Q: Test Coverage 목표를 달성하기 어렵습니다

**A**:

- Business Logic에 집중하여 ≥80% 달성
- UI/Presentation Layer는 Integration Test로 대체 고려
- Legacy Code는 점진적 개선 계획 수립

### Q: Phase가 예상보다 오래 걸립니다

**A**:

- Phase를 더 작은 단위로 분해
- Blocker를 Notes 섹션에 기록
- 필요시 Plan을 수정하여 현실적인 추정치로 조정

---

## 관련 문서

### 프로젝트 내부 참조

- [Task 작성 Prompt](../../../prompts/development/task.md) - 일반적인 Task 작성 가이드
- [GitHub Action Workflow](../../../prompts/development/github-action.md) - CI/CD 통합 참고

### Claude Code 공식 문서

- [Skills 작성 가이드](https://docs.anthropic.com/claude-code/skills)
- [Agent 활용 방법](https://docs.anthropic.com/claude-code/agents)

### TDD 참고 자료

- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Kent Beck
- [Growing Object-Oriented Software, Guided by Tests](http://www.growing-object-oriented-software.com/) - Steve Freeman, Nat Pryce

---

## 버전 정보

- **마지막 업데이트**: 2025-12-24
- **Skill Version**: 1.0
- **호환 Claude Code 버전**: 0.1.0 이상

---

## 기여 및 피드백

이 Skill에 대한 개선 사항이나 문제점을 발견하셨다면:

1. 구체적인 사용 사례와 함께 Issue 등록
2. 개선 제안 시 Before/After 예시 포함
3. 새로운 Best Practice 발견 시 공유

---

## License

이 Skill은 `develop-with-llm-reference` 프로젝트의 일부로, 학습 및 참고 목적으로 제공됩니다.
