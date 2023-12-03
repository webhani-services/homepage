# Create Nextjs Project

- Create Network (only one time)

```bash
docker network create dev_webhani_hp_network
```

- Create Project

```bash
docker-compose run --rm app npx create-next-app@latest --ts --use-npm
```

- 一個上の directory (app) に作成された file をすべて移動
- `src` directory 作成
- `src` directory に `page`, `styles` directory を入れる
