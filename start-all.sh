#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m'

SERVICES=(
    "userService (NestJS)|$ROOT_DIR/backend/userService|npm run start:dev|3001"
    "toDoService (NestJS)|$ROOT_DIR/backend/toDoService|npm run start:dev|3002"
    "expenceManagerService (NestJS)|$ROOT_DIR/backend/expenceManagerService|npm run start:dev|3003"
    "frontend (Vite)|$ROOT_DIR/frontend|npm run dev|5173"
)

pick_terminal() {
    if command -v gnome-terminal >/dev/null 2>&1; then
        echo "gnome-terminal"
        return
    fi
    if command -v x-terminal-emulator >/dev/null 2>&1; then
        echo "x-terminal-emulator"
        return
    fi
    if command -v konsole >/dev/null 2>&1; then
        echo "konsole"
        return
    fi
    if command -v xfce4-terminal >/dev/null 2>&1; then
        echo "xfce4-terminal"
        return
    fi
    if command -v xterm >/dev/null 2>&1; then
        echo "xterm"
        return
    fi
    echo ""
}

open_in_new_terminal() {
    local title="$1"
    local dir="$2"
    local cmd="$3"
    local port="$4"
    local terminal="$5"

    local launch_cmd="cd \"$dir\"; echo \"Starting $title on port $port...\"; $cmd; exec bash"

    case "$terminal" in
        gnome-terminal)
            gnome-terminal --title="$title" -- bash -lc "$launch_cmd" >/dev/null 2>&1 &
            ;;
        x-terminal-emulator)
            x-terminal-emulator -e bash -lc "$launch_cmd" >/dev/null 2>&1 &
            ;;
        konsole)
            konsole --new-tab -p tabtitle="$title" -e bash -lc "$launch_cmd" >/dev/null 2>&1 &
            ;;
        xfce4-terminal)
            xfce4-terminal --title="$title" --command "bash -lc '$launch_cmd'" >/dev/null 2>&1 &
            ;;
        xterm)
            xterm -T "$title" -e bash -lc "$launch_cmd" >/dev/null 2>&1 &
            ;;
        *)
            return 1
            ;;
    esac
}

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Starting all services...${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

TERMINAL_BIN="$(pick_terminal)"

for svc in "${SERVICES[@]}"; do
    IFS='|' read -r title dir cmd port <<< "$svc"

    if [ ! -d "$dir" ]; then
        echo -e "${RED}[SKIP] '${title}' - directory not found: ${dir}${NC}"
        continue
    fi

    echo -e "${YELLOW}[START] ${title}  -->  http://localhost:${port}${NC}"

    if [ -n "$TERMINAL_BIN" ]; then
        open_in_new_terminal "$title" "$dir" "$cmd" "$port" "$TERMINAL_BIN"
    else
        log_file="$ROOT_DIR/.${port}-${title// /_}.log"
        (
            cd "$dir" || exit 1
            nohup bash -lc "$cmd" > "$log_file" 2>&1 &
        )
        echo -e "${GRAY}  No GUI terminal found. Started in background, log: ${log_file}${NC}"
    fi
done

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  All services launched!${NC}"
echo -e "${GRAY}----------------------------------------${NC}"
echo -e "${GREEN}  Frontend              http://localhost:5173${NC}"
echo -e "${GREEN}  userService           http://localhost:3001${NC}"
echo -e "${GREEN}  toDoService           http://localhost:3002${NC}"
echo -e "${GREEN}  expenceManagerService http://localhost:3003${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
