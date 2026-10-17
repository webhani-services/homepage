# Works 이미지 통일 Specification

## 배경

Works 카드 이미지 4장이 실사 사진 3장 (책상 위 노트북 / 대시보드 / 타이핑하는 손) 과 보라색 Isometric 일러스트 1장으로 섞여 있어 통일감이 없고, 보라색은 Brand Color (Amber) 와도 맞지 않았다. 또한 미압축 원본 (최대 5616px, 합계 7.8MB) 이었다.

## 방침

- Hero Particle 영상과 같은 톤 (배경 `#0f0f0f` + Amber Palette + 같은 Tone Map) 의 추상 이미지를 Script 로 직접 생성 → 라이선스 문제 없음, 재생성 가능
- 카드마다 실적 내용을 상징하는 Motif 1개
  - `cloud`: 구름 모양 Silhouette 안을 채운 Node Mesh (클라우드 기반)
  - `ec`: Isometric 상품 Tile Grid, 일부만 점등 (EC 사이트)
  - `system`: 3-Tier Block 과 직교 Data Path, Data Packet (업무 시스템)
  - `ai-chatbot`: Particle Swarm 이 중심 Core 로 모이는 형태 (AI 챗봇)
- 카드 비율 (Desktop 약 2:1, Mobile 약 1.2:1) 에 맞춰 2:1 로 생성하고, 모든 Motif 를 Safe Zone (높이 12~68% = Caption 위, 폭 중앙 60% = Mobile Crop 범위) 안에 배치
- 파일명을 `*-motif.jpg` 로 변경 (같은 URL 이면 next/image 최적화 Cache 와 CDN 에 이전 이미지가 남음). `AreaWorks` 는 경로만 변경

## 범위 밖

- 고객 Quote Block (실제 고객 Comment 수령 후 별도 작업)
