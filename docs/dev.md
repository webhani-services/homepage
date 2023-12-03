# Setup dev

- Copy `.env` file

```bash
cp .env.sample .env
```

- Create Network (only one time)

```bash
docker network create dev_nextjs_template_network
```

- docker build

```bash
docker-compose build --no-cache
```

- Install package

```bash
docker-compose run --rm app npm install
```

- Run docker

```bash
docker-compose up
```

- Access to `http://localhost:3000`
