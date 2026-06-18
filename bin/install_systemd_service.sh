#!/bin/bash
set -e

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root (using sudo)."
  exit 1
fi

# Detect directory of this project
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVICE_FILE="/etc/systemd/system/tallysheet.service"

# Find paths for docker and docker-compose to keep systemd commands absolute
DOCKER_BIN=$(which docker || echo "/usr/bin/docker")
DOCKER_COMPOSE_BIN=$(which docker-compose || echo "")

if [ -n "$DOCKER_COMPOSE_BIN" ]; then
  EXEC_START="${DOCKER_COMPOSE_BIN} up -d"
  EXEC_STOP="${DOCKER_COMPOSE_BIN} down"
else
  EXEC_START="${DOCKER_BIN} compose up -d"
  EXEC_STOP="${DOCKER_BIN} compose down"
fi

echo "Creating systemd service file at ${SERVICE_FILE}..."

cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Tallysheet Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${PROJECT_DIR}
ExecStart=${EXEC_START}
ExecStop=${EXEC_STOP}
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo "Reloading systemd daemon..."
systemctl daemon-reload

echo "Enabling tallysheet service on system boot..."
systemctl enable tallysheet.service

echo "Tallysheet systemd service successfully installed!"
echo "To manage the container service, use:"
echo "  sudo systemctl start tallysheet.service"
echo "  sudo systemctl stop tallysheet.service"
echo "  sudo systemctl status tallysheet.service"
