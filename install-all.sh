#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m'

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Installing dependencies for all projects${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

mapfile -t package_files < <(find "$ROOT_DIR" -type f -name "package.json" -not -path "*/node_modules/*" | sort)

for pkg in "${package_files[@]}"; do
    dir="$(dirname "$pkg")"
    relative_path="${dir#$ROOT_DIR/}"

    echo -e "${YELLOW}[INSTALL] ${relative_path}${NC}"
    echo -e "${GRAY}  Path: ${dir}${NC}"

    (
        cd "$dir" || exit 1
        npm install
    )
    exit_code=$?

    if [ "$exit_code" -eq 0 ]; then
        echo -e "${GREEN}  [OK] Done${NC}"
    else
        echo -e "${RED}  [FAIL] Exit code: ${exit_code}${NC}"
    fi

    echo ""
done

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  All installations complete!${NC}"
echo -e "${CYAN}========================================${NC}"
