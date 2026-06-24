# Docker Compose Cheatsheet

This guide covers the end-to-end lifecycle of running your POC entirely using Docker Compose (without Kubernetes).

### 1. Start the Environment
```bash
docker compose up --build -d
```
> **Description:** Builds any changed images and starts all your backend services, frontend, and databases in the background (`-d`).

---

### 2. View Status & Health
```bash
docker compose ps
```
> **Description:** Lists all running containers for this project, showing their exact state and port mappings.

---

### 3. View Logs
```bash
docker compose logs -f
```
> **Description:** Streams the logs from all containers in real-time. (Press `Ctrl + C` to stop viewing).
> *Pro-tip: Add a service name to see logs for just one container, e.g., `docker compose logs -f expence-manager-service`.*

---

### 4. Dispose of the Environment (Cleanup)
```bash
docker compose down
```
> **Description:** Stops and removes all containers, networks, and images created by `up`.

**Wipe Everything (Including Database Volumes):**
```bash
docker compose down -v
```
> **Description:** Shuts down the environment and **permanently deletes** the database volumes (`-v`). Use this if you want to start with a totally fresh database next time.
