# poc-learninigs — Monorepo

A full-stack monorepo containing a React frontend and three NestJS backend microservices.

---

## 📁 Project Structure

```
poc-learninigs/
├── frontend/               # React + Vite + TypeScript app
├── backend/
│   ├── mainService/        # NestJS — Main API service
│   ├── sideServiceOne/     # NestJS — Side service #1
│   └── sideServiceTwo/     # NestJS — Side service #2
├── install-all.ps1         # Installs npm dependencies in all projects
├── start-all.ps1           # Starts all projects in separate terminals
└── README.md               # This file
```

---

## 🌐 Service Ports

| Service        | Port  | URL                        |
|----------------|-------|----------------------------|
| frontend       | 5173  | http://localhost:5173       |
| mainService    | 3000  | http://localhost:3000       |
| sideServiceOne | 3001  | http://localhost:3001       |
| sideServiceTwo | 3002  | http://localhost:3002       |

---

## ⚡ Quick Start

### 1. Install all dependencies
```powershell
.\install-all.ps1
```

### 2. Start all services (each in its own terminal window)
```powershell
.\start-all.ps1
```

---

## 🛠 Individual Commands

Each project supports standard npm scripts:

```bash
# Development (watch mode)
npm run start:dev        # NestJS services
npm run dev              # Frontend (Vite)

# Production build
npm run build

# Lint
npm run lint
```

---

## 🔧 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, TailwindCSS, React Router
- **Backend**: NestJS 11, TypeScript, Express
- **Tools**: ESLint, Prettier
