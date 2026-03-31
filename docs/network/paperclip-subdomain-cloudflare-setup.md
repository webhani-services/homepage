# paperclip.webhani.com 설정 가이드

> 이 문서는 `webhani.com`이 이미 Cloudflare에서 관리되고 있고, Mac mini에서 `docker compose`로 실행하는 `paperclip` 서비스를 `paperclip.webhani.com`으로 공개하는 방법을 정리합니다. 이 문서는 `Docker Compose + 새 Cloudflare Tunnel Container` 방식만 다룹니다.

## 목표

- `www.webhani.com`은 기존처럼 Vercel 유지
- `paperclip.webhani.com`은 Cloudflare Tunnel을 통해 Mac mini의 `paperclip` 서비스로 연결
- `cloudflared`도 `docker compose` 안에서 함께 실행
- `paperclip` 전용 Tunnel을 새로 생성해서 사용

## 현재 전제

- `webhani.com` authoritative DNS는 Cloudflare
- Cloudflare DNS에서 `www`는 Vercel용 `CNAME`으로 연결되어 있음
- Cloudflare DNS에서 `llm-api`는 이미 `Tunnel` Record로 운영 중
- Cloudflare Tunnel `webhani-connectors`에 `paperclip.webhani.com` route를 추가해둔 상태
- Mac mini에서는 아래 `docker compose` 구성을 사용 중

핵심 서비스:

- `paperclip`: 앱 컨테이너
- `cloudflared`: Tunnel 컨테이너
- `db`: Postgres 컨테이너

현재 `paperclip` 서비스는 내부적으로 `3100` 포트에서 실행됩니다.

```yaml
paperclip:
  ports:
    - "${PAPERCLIP_PORT:-3100}:3100"

cloudflared:
  image: cloudflare/cloudflared:latest
  command:
    - tunnel
    - --no-autoupdate
    - run
    - --token
    - "${CLOUDFLARE_TUNNEL_TOKEN:?CLOUDFLARE_TUNNEL_TOKEN must be set}"
```

## 권장 아키텍처

```text
Cloudflare (webhani.com zone)
  ├─ www.webhani.com -> Vercel
  └─ paperclip.webhani.com -> Cloudflare Tunnel
                                      |
                                      v
                          cloudflared container
                                      |
                                      v
                           http://paperclip:3100
```

## 핵심 원리

`cloudflared`가 같은 `docker compose` 안에서 실행되므로 origin 주소는 `localhost`가 아니라 Compose service name을 써야 합니다.

현재 구성에서 `paperclip`은 service name이고, Compose network 안에서는 내부 hostname처럼 동작합니다.

따라서 Tunnel의 Service URL은 아래 값으로 정의합니다.

```text
http://paperclip:3100
```

왜 `localhost`가 아닌가:

- `localhost`는 `cloudflared` 컨테이너 자기 자신을 가리킴
- 실제 앱은 `paperclip` 컨테이너에서 실행 중
- 컨테이너 간 통신은 service name 기반으로 해야 함

이 원리는 아래 설정과 같습니다.

```text
DATABASE_URL=...@db:5432/...
```

여기서도 `db`는 Compose service name입니다.

## Cloudflare 설정 방식

이 구성에서는 Cloudflare DNS 화면에서 `A` 또는 `CNAME`을 수동으로 만들지 않습니다.

대신 Cloudflare Tunnel 관리 화면에서 `paperclip.webhani.com` Public Hostname을 추가합니다.

권장 순서:

1. Cloudflare에서 `paperclip` 전용 Tunnel 새로 생성
2. 발급된 Tunnel Token을 `.env`에 설정
3. `docker compose --profile cloudflare-tunnel up -d`로 `cloudflared` 컨테이너 기동
4. 새 Tunnel의 Public Hostname으로 `paperclip.webhani.com` 추가
5. Service는 `http://paperclip:3100`으로 지정

현재 추가된 route 정보:

| 항목 | 값 |
| --- | --- |
| Tunnel name | `webhani-connectors` |
| Public hostname | `paperclip.webhani.com` |
| Path | `*` |
| Service | `http://paperclip:3100` |

## 새 Tunnel 생성 절차

이 문서의 기준은 `cloudflared`를 Mac mini 호스트가 아니라 Docker 컨테이너로 실행하는 방식입니다.

### 1. Cloudflare Dashboard에서 Tunnel 생성

Cloudflare Tunnel을 생성하고, `docker` 방식 또는 `token` 방식 안내를 확인합니다.

생성 후 Tunnel Token을 발급받습니다.

예:

```text
CLOUDFLARE_TUNNEL_TOKEN=<issued-token>
```

### 2. `.env`에 Tunnel Token 설정

예시:

```dotenv
CLOUDFLARE_TUNNEL_TOKEN=xxxxxxxxxxxxxxxx
PAPERCLIP_PUBLIC_URL=https://paperclip.webhani.com
PAPERCLIP_ALLOWED_HOSTNAMES=paperclip.webhani.com
```

권장 값:

- `PAPERCLIP_PUBLIC_URL=https://paperclip.webhani.com`
- `PAPERCLIP_ALLOWED_HOSTNAMES=paperclip.webhani.com`

### 3. `docker compose`로 실행

Tunnel profile을 함께 올립니다.

```bash
docker compose --profile cloudflare-tunnel up -d
```

이 명령은 아래를 함께 기동합니다.

- `db`
- `paperclip`
- `cloudflared`

`cloudflared`는 Token 기반으로 Cloudflare Tunnel에 연결됩니다.

### 4. Cloudflare Dashboard에서 Public Hostname 추가

새 Tunnel에 대해 아래 값을 추가합니다.

| 항목 | 값 |
| --- | --- |
| Subdomain | `paperclip` |
| Domain | `webhani.com` |
| Type | `HTTP` |
| URL | `paperclip:3100` |

핵심은 `localhost:3100`이 아니라 `paperclip:3100`이라는 점입니다.

현재 Dashboard에 반영된 값:

```text
Tunnel: webhani-connectors
Public hostname: paperclip.webhani.com
Path: *
Service: http://paperclip:3100
```

즉, domain 연결 정보 자체는 이미 Cloudflare 쪽에 추가된 상태입니다. 남은 작업은 Mac mini 쪽 `cloudflared`가 이 Tunnel에 연결될 수 있도록 올바른 Tunnel token을 `.env`에 설정하고 컨테이너를 실행하는 것입니다.

## compose 기준 동작 방식

현재 `compose.yml`의 중요한 부분은 아래입니다.

```yaml
paperclip:
  ports:
    - "${PAPERCLIP_PORT:-3100}:3100"

cloudflared:
  depends_on:
    paperclip:
      condition: service_started
```

이 구성에서:

- 외부 사용자는 `https://paperclip.webhani.com`으로 접근
- Cloudflare는 Tunnel로 요청을 전달
- `cloudflared` 컨테이너는 `http://paperclip:3100`으로 요청 전달
- `paperclip` 컨테이너가 응답

## 실행 및 검증

### 1. 컨테이너 기동

```bash
docker compose --profile cloudflare-tunnel up -d
```

### 2. 컨테이너 상태 확인

```bash
docker compose ps
```

정상 기대값:

- `db` 실행 중
- `paperclip` 실행 중
- `cloudflared` 실행 중

### 3. Tunnel 컨테이너에서 origin 확인

`cloudflared` 컨테이너 기준으로 `paperclip` 서비스에 접근 가능한지 확인합니다.

```bash
docker compose exec cloudflared wget -qO- http://paperclip:3100
```

응답이 오면 Compose network 기준 origin 연결은 정상입니다.

### 4. 외부 접속 확인

브라우저에서 아래 URL 접속:

```text
https://paperclip.webhani.com
```

확인 항목:

- 로그인 또는 앱 초기 화면이 열리는지
- `www.webhani.com`은 기존처럼 그대로 동작하는지
- Cloudflare Dashboard에 `paperclip`용 Tunnel Record가 생성되었는지

## Troubleshooting

### `paperclip.webhani.com`이 열리지 않는 경우

확인 순서:

1. `docker compose ps`에서 `cloudflared`와 `paperclip`이 실행 중인지 확인
2. `docker compose exec cloudflared wget -qO- http://paperclip:3100`이 성공하는지 확인
3. Cloudflare Tunnel `webhani-connectors`에 `paperclip.webhani.com -> http://paperclip:3100`이 등록되어 있는지 확인
4. `.env`의 `CLOUDFLARE_TUNNEL_TOKEN`이 올바른지 확인

### `localhost:3100`으로 넣었더니 안 되는 경우

현재 문서 기준에서는 정상입니다. 이유는 `cloudflared`가 컨테이너 안에서 실행되기 때문입니다.

즉:

- `localhost:3100` -> `cloudflared` 컨테이너 자신
- `paperclip:3100` -> 실제 앱 컨테이너

따라서 이 구성에서는 반드시 아래 값을 사용합니다.

```text
http://paperclip:3100
```

### `www.webhani.com`에 영향이 갈까 걱정되는 경우

`www` Record를 수정하지 않고 `paperclip` Public Hostname만 추가하면 보통 `www.webhani.com`에는 영향이 없습니다.

## 운영 체크리스트

- [ ] Cloudflare DNS에서 `www` 기존 Vercel 연결 유지 확인
- [ ] Cloudflare에서 `paperclip` 전용 Tunnel 새로 생성
- [ ] Cloudflare Tunnel `webhani-connectors`에 `paperclip.webhani.com` Public Hostname 추가 확인
- [ ] Service URL을 `http://paperclip:3100`으로 설정
- [ ] `.env`에 `CLOUDFLARE_TUNNEL_TOKEN` 설정
- [ ] `.env`에 `PAPERCLIP_PUBLIC_URL=https://paperclip.webhani.com` 설정
- [ ] `.env`에 `PAPERCLIP_ALLOWED_HOSTNAMES=paperclip.webhani.com` 설정
- [ ] `docker compose --profile cloudflare-tunnel up -d` 실행
- [ ] `docker compose exec cloudflared wget -qO- http://paperclip:3100` 검증
- [ ] 외부에서 `https://paperclip.webhani.com` 접속 테스트

## 최종 결론

현재 환경에서는 아래 방식으로 확정하는 것이 가장 맞습니다.

1. Cloudflare는 기존 `webhani.com` Zone 유지
2. `www.webhani.com`은 기존 Vercel 설정 유지
3. `paperclip` 전용 Cloudflare Tunnel을 새로 생성
4. `paperclip.webhani.com`은 새 Tunnel의 Public Hostname으로 추가
5. Mac mini에서는 `docker compose`로 `paperclip`과 `cloudflared`를 함께 실행
6. Tunnel origin은 `http://paperclip:3100`으로 설정
