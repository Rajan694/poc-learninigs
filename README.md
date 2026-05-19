# poc-learninigs — Monorepo

A full-stack monorepo containing a React frontend and three NestJS + Prisma backend microservices.

---

## Project Structure

```text
poc-learninigs/
├── frontend/
├── backend/
│   ├── userService/
│   ├── toDoService/
│   └── expenceManagerService/
├── docker-compose.yml
├── install-all.ps1
├── install-all.sh
├── start-all.ps1
└── start-all.sh
```

---

## Service Ports

| Service | Port | URL |
|---|---:|---|
| frontend | 5173 | http://localhost:5173 |
| userService (auth) | 3001 | http://localhost:3001 |
| toDoService | 3002 | http://localhost:3002 |
| expenceManagerService | 3003 | http://localhost:3003 |

---

## API Overview

### userService
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`

### toDoService
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

### expenceManagerService
- `GET /expenses`
- `POST /expenses`
- `PATCH /expenses/:id`
- `DELETE /expenses/:id`

---

## Local Development

Install dependencies:

```bash
./install-all.sh
```

or on Windows PowerShell:

```powershell
.\install-all.ps1
```

Start all services:

```bash
./start-all.sh
```

or on Windows PowerShell:

```powershell
.\start-all.ps1
```

---

## Docker (Windows + Ubuntu)

Start full backend stack:

```bash
docker compose up --build -d
```

View logs:

```bash
docker compose logs -f
```

Stop stack:

```bash
docker compose down
```

Stop and remove volumes:

```bash
docker compose down -v
```

Notes:
- Postgres and Redis are internal-only in Docker network (`app-network`) to avoid host port conflicts.
- Service-to-service hostnames: `user-db`, `todo-db`, `expense-db`, `redis`.
- Databases are isolated (`auth_db`, `todo_db`, `expense_db`) with separate volumes.
