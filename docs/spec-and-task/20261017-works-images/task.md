# Works 이미지 통일 Task

- [x] `scripts/render-works-images.py` 작성 (numpy + PIL, 2x Supersampling + Glow)
- [x] 4장 생성 (1600×800, 카드와 같은 2:1) → sharp-cli 1200px / q80 압축 (합계 7.8MB → 119KB)
- [x] `public/images/works/*-motif.jpg` 로 교체. 파일명을 바꿔 next/image 최적화 Cache / CDN / 브라우저 Cache 에 남은 이전 이미지가 표시되지 않게 함
- [x] Production Build 에서 카드 표시 확인 (Desktop / Mobile)

재생성 방법:

```bash
python3 -I scripts/render-works-images.py /tmp/works 1600 800
for n in cloud ec system ai-chatbot; do
  npx sharp-cli -i /tmp/works/$n.png -o public/images/works/$n-motif.jpg -f jpeg -q 80 resize 1200
done
```
