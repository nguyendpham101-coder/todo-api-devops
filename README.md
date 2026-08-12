# todo-api-devops

Todo API DevOps mini project — practice Git branching, REST API, Swagger/OpenAPI, Docker, and the workflow `main → dev → test → dev → main`.

## 1. Project

A small REST API for managing todos, built with Node.js and Express. Data is kept in memory (no database needed for this version).

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

Build the image:

```bash
docker build -t todo-api .
```

Run the container:

```bash
docker run --name todo-api-container -p 3000:3000 todo-api
```

Verify inside Docker:

```text
http://localhost:3000/health
http://localhost:3000/api-docs
```

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
│   │   └── todos.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── todo.test.js
├── swagger/
│   └── openapi.yaml
├── Dockerfile
├── .dockerignore
├── package.json
├── .gitignore
├── README.md
└── PLAN.md
```