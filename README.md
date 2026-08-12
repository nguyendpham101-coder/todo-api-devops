# todo-api-devops

Todo API DevOps mini project — practice Git branching, REST API, Swagger/OpenAPI, Docker, and the workflow `main → dev → test → dev → main`.

## 1. Project

A small REST API for managing todos, built with Node.js and Express. Data is stored in memory by default, or in PostgreSQL when running with Docker Compose. Redis is used as a cache layer.

A Todo looks like:

```json
{
  "id": 1,
  "title": "Learn Docker",
  "completed": false
}
```

## 2. Technologies

- Node.js
- Express.js
- Swagger / OpenAPI
- Docker
- Git / GitHub

## 3. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get a todo by id |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

Status codes:

- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `404 Not Found`
- `500 Internal Server Error`

## 4. Run locally

In-memory mode (no database needed):

```bash
npm install
npm start
```

Or run with auto-reload (development):

```bash
npm run dev
```

Then open:

```text
http://localhost:3000/health
```

With PostgreSQL + Redis, use Docker Compose (see section 7).

## 5. Swagger

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

The OpenAPI spec lives in `swagger/openapi.yaml`.

## 6. Tests

```bash
npm test
```

## 7. Docker

### Quick start with docker compose

```bash
docker compose up --build
```

This starts 3 services:

| Service | Image | Port |
|---|---|---|
| `api` | todo-api (built from Dockerfile) | 3000 |
| `postgres` | postgres:16-alpine | 5432 |
| `redis` | redis:7-alpine | 6379 |

Verify:

```text
http://localhost:3000/health
http://localhost:3000/api-docs
```

The API uses PostgreSQL to store todos and Redis for caching. Stop with:

```bash
docker compose down
```

Remove data volumes too:

```bash
docker compose down -v
```

### Build and run manually

Build the image:

```bash
docker build -t todo-api .
```

Run the container (in-memory mode, no DB):

```bash
docker run --name todo-api-container -p 3000:3000 todo-api
```

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | API port |
| `DATABASE_URL` | - | PostgreSQL connection string; if set, todos are stored in Postgres |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `USE_REDIS` | `false` | Enable Redis caching (`true` in docker compose) |

See `.env.example`.

## 8. Git workflow

The project uses 3 branches:

```text
main
  └── dev
        └── test
```

- `main` — official/stable branch, starts with skeleton only.
- `dev` — development branch, receives code merged from `test`.
- `test` — working branch where features are coded and tested.

Flow:

```text
main → dev → test
test → dev
dev → main
```

After features are verified, they are merged `test → dev`, then `dev → main`.

## 9. Project structure

```text
todo-api-devops/
├── src/
│   ├── controllers/
│   │   └── todo.controller.js
│   ├── routes/
│   │   └── todo.routes.js
│   ├── data/
│   │   ├── store.js
│   │   ├── todos.js
│   │   └── pg.js
│   ├── utils/
│   │   └── redis.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── todo.test.js
├── swagger/
│   └── openapi.yaml
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── .env.example
├── package.json
├── .gitignore
├── README.md
└── PLAN.md
```