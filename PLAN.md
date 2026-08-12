# PLAN.md — Todo API DevOps Mini Project

## 1. Mục tiêu

Xây dựng một REST API nhỏ để thực hành đồng thời:

- Git / GitHub
- Branching và merging
- REST API
- Swagger / OpenAPI để test API
- Docker
- Quy trình `main → dev → test → dev → main`

> **Nguyên tắc quan trọng:** `main` chỉ chứa skeleton ban đầu. Mọi code/feature được thực hiện trên `test`, sau đó merge vào `dev`. Chỉ khi `dev` ổn định mới merge vào `main`.

---

# 2. Scope của project

## Tên project

`todo-api-devops`

## Công nghệ

- Node.js
- Express.js
- Swagger / OpenAPI
- Docker
- Git / GitHub

## Không làm ở phiên bản đầu

Để project nhỏ và tập trung vào mục tiêu DevOps, chưa cần:

- Frontend
- Login / JWT
- User management
- Database
- Redis
- Kubernetes
- CI/CD
- Microservices

Có thể mở rộng sau nếu giảng viên yêu cầu.

---

# 3. API cần xây dựng

Project sử dụng Todo API.

Một Todo có dạng:

```json
{
  "id": 1,
  "title": "Learn Docker",
  "completed": false
}
```

## Endpoint

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/api/todos` | Lấy danh sách Todo |
| GET | `/api/todos/:id` | Lấy Todo theo ID |
| POST | `/api/todos` | Tạo Todo |
| PUT | `/api/todos/:id` | Cập nhật Todo |
| DELETE | `/api/todos/:id` | Xóa Todo |

## HTTP status cơ bản

- `200 OK` — request thành công
- `201 Created` — tạo resource thành công
- `400 Bad Request` — dữ liệu gửi lên không hợp lệ
- `404 Not Found` — không tìm thấy Todo
- `500 Internal Server Error` — lỗi server

---

# 4. Cấu trúc repository mục tiêu

Sau khi hoàn thành project:

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
│
├── tests/
│   └── todo.test.js
│
├── swagger/
│   └── openapi.yaml
│
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── PLAN.md
```

> Cấu trúc có thể thay đổi nhẹ trong quá trình làm. Không cần cố ép project phải giống 100% cấu trúc trên.

---

# 5. Git branching strategy

## Branch chính

Project sử dụng 3 branch:

```text
main
  │
  └── dev
        │
        └── test
```

Ý nghĩa:

### `main`

- Branch chính thức.
- Chỉ chứa skeleton ở giai đoạn đầu.
- Sau khi project hoàn thành và `dev` đã được kiểm tra mới merge vào `main`.
- Không code feature trực tiếp trên `main`.

### `dev`

- Branch phát triển.
- Nhận code từ `test`.
- Dùng để kiểm tra phiên bản đã được merge.
- Khi ổn định mới merge vào `main`.

### `test`

- Branch làm việc chính trong bài.
- Tạo từ `dev`.
- Code API, Swagger, Docker và sửa lỗi trên branch này.
- Sau khi hoàn thành/test OK mới merge vào `dev`.

---

# 6. PHASE 1 — Tạo GitHub repository

## Mục tiêu

Tạo repository rỗng trên GitHub.

Tên đề xuất:

```text
todo-api-devops
```

## Việc cần làm

- [ ] Tạo repository trên GitHub.
- [ ] Clone repository về máy.
- [ ] Kiểm tra remote.
- [ ] Kiểm tra branch hiện tại.

Lệnh tham khảo:

```bash
git clone <REPOSITORY_URL>
cd todo-api-devops

git remote -v
git branch
```

---

# 7. PHASE 2 — Tạo skeleton trên `main`

## Mục tiêu

`main` chỉ chứa khung xương project.

## Tạo các thư mục/file

```text
todo-api-devops/
├── src/
├── tests/
├── swagger/
├── package.json
├── Dockerfile
├── .gitignore
├── README.md
└── PLAN.md
```

Chưa cần triển khai API hoàn chỉnh.

## Khởi tạo Node.js

```bash
npm init -y
```

## Tạo `.gitignore`

Các file/thư mục không nên commit:

```text
node_modules/
.env
coverage/
```

## Commit

```bash
git add .
git commit -m "chore: initialize project skeleton"
git push origin main
```

## Kiểm tra

- [ ] `main` có skeleton.
- [ ] `main` chưa có implementation API hoàn chỉnh.
- [ ] Commit đầu tiên đã được push lên GitHub.

---

# 8. PHASE 3 — Tạo branch `dev`

## Mục tiêu

Tạo branch phát triển từ `main`.

```bash
git switch main
git pull origin main

git switch -c dev
git push -u origin dev
```

Kiểm tra:

```bash
git branch
```

Kết quả mong muốn:

```text
* dev
  main
```

## Nguyên tắc

Từ thời điểm này:

```text
main = stable / official
dev  = development
```

Không code feature trực tiếp trên `main`.

---

# 9. PHASE 4 — Tạo branch `test`

## Mục tiêu

Tạo branch `test` từ `dev`.

```bash
git switch dev
git pull origin dev

git switch -c test
git push -u origin test
```

Kết quả:

```text
main
dev
test   ← bắt đầu làm việc ở đây
```

Chuyển sang `test` trước khi code:

```bash
git switch test
```

---

# 10. PHASE 5 — Setup Express API

## Mục tiêu

Tạo server Express cơ bản.

## Cài dependency

```bash
npm install express
```

Nếu cần development tool:

```bash
npm install -D nodemon
```

## Tạo

```text
src/
├── app.js
└── server.js
```

## Yêu cầu

Server phải:

- Chạy được.
- Có endpoint kiểm tra server.
- Có thể trả JSON.

Ví dụ:

```text
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

## Test

Chạy:

```bash
npm start
```

Kiểm tra:

```text
http://localhost:3000/health
```

## Commit

```bash
git add .
git commit -m "feat: setup express api"
git push
```

---

# 11. PHASE 6 — Implement Todo API

## Mục tiêu

Triển khai 5 endpoint Todo.

## Dữ liệu

Ban đầu có thể dùng array trong memory:

```text
todos[]
```

Không cần database.

## Implement

### GET `/api/todos`

Trả về danh sách Todo.

### GET `/api/todos/:id`

Trả về một Todo.

Nếu không tồn tại:

```text
404
```

### POST `/api/todos`

Request:

```json
{
  "title": "Learn Docker"
}
```

Tạo Todo mới.

### PUT `/api/todos/:id`

Request:

```json
{
  "title": "Learn Docker deeply",
  "completed": true
}
```

Cập nhật Todo.

### DELETE `/api/todos/:id`

Xóa Todo.

## Kiểm tra

Test từng endpoint bằng tool tạm thời hoặc Swagger nếu Swagger đã được setup.

## Commit

```bash
git add .
git commit -m "feat: implement todo api"
git push
```

---

# 12. PHASE 7 — Setup Swagger / OpenAPI

## Mục tiêu

Có Swagger UI để test API trực tiếp trên browser.

## Cài package

Có thể dùng:

```bash
npm install swagger-ui-express yamljs
```

Hoặc thư viện OpenAPI tương đương nếu muốn.

## Tạo

```text
swagger/
└── openapi.yaml
```

## Swagger phải mô tả

- `/health`
- `/api/todos`
- `/api/todos/{id}`

Cho mỗi endpoint cần mô tả:

- HTTP method
- parameters
- request body nếu có
- response
- status code
- schema Todo

## Swagger UI

Đề xuất:

```text
GET /api-docs
```

Sau khi chạy server:

```text
http://localhost:3000/api-docs
```

## Test bằng Swagger

- [ ] GET todos
- [ ] GET todo theo ID
- [ ] POST todo
- [ ] PUT todo
- [ ] DELETE todo
- [ ] Kiểm tra trường hợp ID không tồn tại
- [ ] Kiểm tra request không hợp lệ

## Commit

```bash
git add .
git commit -m "feat: add swagger documentation"
git push
```

---

# 13. PHASE 8 — Dockerize API

## Mục tiêu

Chạy được API bên trong Docker container.

## Tạo Dockerfile

Dockerfile cần:

1. Chọn Node.js base image.
2. Set working directory.
3. Copy package files.
4. Install dependencies.
5. Copy source code.
6. Expose port.
7. Start application.

## Tạo `.dockerignore`

Ví dụ:

```text
node_modules/
npm-debug.log
.git/
.gitignore
coverage/
```

## Build image

```bash
docker build -t todo-api .
```

## Run container

```bash
docker run --name todo-api-container -p 3000:3000 todo-api
```

## Kiểm tra

Mở:

```text
http://localhost:3000/health
```

Sau đó:

```text
http://localhost:3000/api-docs
```

Swagger phải hoạt động bên trong Docker.

## Commit

```bash
git add .
git commit -m "feat: add docker support"
git push
```

---

# 14. PHASE 9 — Test toàn bộ trên `test`

Trước khi merge, kiểm tra toàn bộ project.

## API

- [ ] Server start thành công.
- [ ] `/health` trả về `200`.
- [ ] GET `/api/todos` hoạt động.
- [ ] GET `/api/todos/:id` hoạt động.
- [ ] POST `/api/todos` hoạt động.
- [ ] PUT `/api/todos/:id` hoạt động.
- [ ] DELETE `/api/todos/:id` hoạt động.
- [ ] ID không tồn tại trả về `404`.
- [ ] Request không hợp lệ được xử lý.

## Swagger

- [ ] `/api-docs` mở được.
- [ ] Swagger hiển thị toàn bộ endpoint.
- [ ] Có thể `Try it out`.
- [ ] Response hiển thị đúng.
- [ ] Status code đúng.

## Docker

- [ ] `docker build` thành công.
- [ ] Container start thành công.
- [ ] API hoạt động trong container.
- [ ] Swagger hoạt động trong container.

---

# 15. PHASE 10 — Merge `test` → `dev`

Khi `test` đã hoàn thành:

```bash
git status
git push
```

Chuyển sang `dev`:

```bash
git switch dev
git pull origin dev
```

Merge:

```bash
git merge test
```

Push:

```bash
git push origin dev
```

## Kiểm tra trên `dev`

- [ ] Code merge không conflict.
- [ ] Server chạy.
- [ ] API hoạt động.
- [ ] Swagger hoạt động.
- [ ] Docker build được.
- [ ] Docker container chạy được.

> Nếu có lỗi sau khi merge, sửa lỗi theo workflow của project. Không coi `dev` là bản chính thức.

---

# 16. PHASE 11 — Merge `dev` → `main`

Chỉ thực hiện khi `dev` đã ổn định.

```bash
git switch main
git pull origin main
```

Merge:

```bash
git merge dev
```

Push:

```bash
git push origin main
```

Kết quả:

```text
main
 ├── API
 ├── Swagger
 ├── Docker
 └── phiên bản đã kiểm tra
```

---

# 17. PHASE 12 — Kiểm tra Git history

Kiểm tra:

```bash
git log --oneline --graph --all
```

Mục tiêu là history thể hiện được quá trình phát triển.

Ví dụ:

```text
*   merge dev into main
|| * merge test into dev
| || | * add docker
| | * add swagger
| | * implement todo api
| | * setup express
|/
* initialize project skeleton
```

Không nhất thiết history phải giống chính xác ví dụ trên.

Điều quan trọng là thể hiện được:

```text
main
  ↓
dev
  ↓
test
  ↓
code / test
  ↓
test → dev
  ↓
dev → main
```

---

# 18. PHASE 13 — Hoàn thiện README

README nên giải thích:

## 1. Project

Todo API DevOps mini project.

## 2. Technologies

- Node.js
- Express
- Swagger
- Docker
- Git

## 3. API endpoints

Liệt kê các endpoint.

## 4. Run locally

Ví dụ:

```bash
npm install
npm start
```

## 5. Swagger

```text
http://localhost:3000/api-docs
```

## 6. Docker

```bash
docker build -t todo-api .
docker run -p 3000:3000 todo-api
```

## 7. Git workflow

Giải thích:

```text
main → dev → test
test → dev
dev → main
```

---

# 19. Checklist cuối cùng

## Git / GitHub

- [ ] Repository đã tạo.
- [ ] `main` tồn tại.
- [ ] `dev` tồn tại.
- [ ] `test` tồn tại.
- [ ] Skeleton được tạo trên `main`.
- [ ] Code được thực hiện trên `test`.
- [ ] `test` merge vào `dev`.
- [ ] `dev` được kiểm tra.
- [ ] `dev` merge vào `main`.
- [ ] Git history rõ ràng.

## API

- [ ] Express server chạy.
- [ ] `/health` hoạt động.
- [ ] GET todos.
- [ ] GET todo by ID.
- [ ] POST todo.
- [ ] PUT todo.
- [ ] DELETE todo.
- [ ] Error handling cơ bản.

## Swagger

- [ ] OpenAPI file tồn tại.
- [ ] Swagger UI hoạt động.
- [ ] Có toàn bộ endpoint.
- [ ] Test được API bằng Swagger.
- [ ] Response/status code đúng.

## Docker

- [ ] Dockerfile tồn tại.
- [ ] `.dockerignore` tồn tại.
- [ ] Build image thành công.
- [ ] Container chạy.
- [ ] API hoạt động trong container.
- [ ] Swagger hoạt động trong container.

## Documentation

- [ ] README hoàn chỉnh.
- [ ] Có hướng dẫn chạy local.
- [ ] Có hướng dẫn Docker.
- [ ] Có Swagger URL.
- [ ] Có mô tả Git workflow.

---

# 20. Thứ tự thực hiện thực tế

Không làm tất cả cùng lúc.

Làm đúng thứ tự:

```text
[1] Tạo GitHub repo
        ↓
[2] Tạo skeleton
        ↓
[3] Commit skeleton → main
        ↓
[4] Tạo dev
        ↓
[5] Tạo test
        ↓
[6] Code Express
        ↓
[7] Code Todo API
        ↓
[8] Thêm Swagger
        ↓
[9] Test API bằng Swagger
        ↓
[10] Thêm Docker
        ↓
[11] Test API trong Docker
        ↓
[12] Merge test → dev
        ↓
[13] Test lại trên dev
        ↓
[14] Merge dev → main
        ↓
[15] Hoàn thiện README
        ↓
[16] Kiểm tra Git history
        ↓
DONE
```

---

# 21. Tiêu chí hoàn thành

Project được xem là hoàn thành khi:

1. Có GitHub repository.
2. Có 3 branch `main`, `dev`, `test`.
3. `main` ban đầu chỉ có skeleton.
4. Feature được phát triển trên `test`.
5. `test` được merge vào `dev`.
6. `dev` được kiểm tra trước khi merge vào `main`.
7. REST API chạy được.
8. Swagger UI test được API.
9. Docker chạy được API.
10. README giải thích cách chạy project.
11. Git history thể hiện rõ workflow.

## Final workflow

```text
                    ┌─────────────┐
                    │    MAIN     │
                    │  skeleton   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     DEV     │
                    │ development │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    TEST     │
                    │             │
                    │ API         │
                    │ Swagger     │
                    │ Docker      │
                    │ Testing     │
                    └──────┬──────┘
                           │
                       merge test
                           │
                           ▼
                    ┌─────────────┐
                    │     DEV     │
                    │ verify      │
                    └──────┬──────┘
                           │
                         OK
                           │
                           ▼
                    ┌─────────────┐
                    │    MAIN     │
                    │   stable    │
                    └─────────────┘
```

**Mục tiêu của bài không phải làm một Todo API thật lớn. Mục tiêu là chứng minh được bạn hiểu và thực hiện được quy trình từ code → test → merge → Docker → stable branch.**
