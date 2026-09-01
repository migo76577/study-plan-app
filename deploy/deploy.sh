#!/bin/bash
# Run on the droplet after each git push to update the app.
# Run as root: bash /var/www/study-plan-app/deploy/deploy.sh

set -euo pipefail

APP_DIR="/var/www/study-plan-app"
cd "$APP_DIR"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Updating Python deps..."
./venv/bin/pip install -r requirements.txt

echo "==> Building frontend..."
cd frontend
npm install
npm run build
cd "$APP_DIR"

chown -R www-data:www-data "$APP_DIR/data" "$APP_DIR/static/dist" 2>/dev/null || true
chown -R www-data:www-data "$APP_DIR"

echo "==> Restarting app..."
systemctl restart study-plan

echo "Deploy done. Check: systemctl status study-plan"
