#!/bin/bash
# One-time setup on a fresh Ubuntu 22.04/24.04 DigitalOcean droplet.
# Run as root: bash deploy/setup-droplet.sh

set -euo pipefail

APP_DIR="/var/www/study-plan-app"
REPO_URL="${REPO_URL:-https://github.com/migo76577/study-plan-app.git}"

echo "==> Installing system packages..."
apt-get update
apt-get install -y python3 python3-pip python3-venv nginx git curl

# Node.js 20 (for React build)
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "==> Cloning app..."
mkdir -p /var/www
if [ -d "$APP_DIR/.git" ]; then
  echo "Repo already exists at $APP_DIR — skipping clone"
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "==> Python virtualenv + dependencies..."
cd "$APP_DIR"
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

echo "==> Building React frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build

echo "==> Creating data directory..."
mkdir -p "$APP_DIR/data"
chown -R www-data:www-data "$APP_DIR/data"

if [ ! -f "$APP_DIR/.env" ]; then
  echo "==> Creating .env — EDIT THIS BEFORE GOING LIVE"
  SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
  cat > "$APP_DIR/.env" <<EOF
FLASK_ENV=production
SECRET_KEY=$SECRET
MENTOR_KEY=CHANGE_ME_TO_A_STRONG_PASSWORD
DATABASE_PATH=$APP_DIR/data/studyplan.db
SESSION_COOKIE_SECURE=false
PORT=8000
EOF
  chmod 600 "$APP_DIR/.env"
  echo "Created $APP_DIR/.env — set MENTOR_KEY, then re-run deploy.sh"
fi

chown -R www-data:www-data "$APP_DIR"

echo "==> Installing systemd service..."
cp "$APP_DIR/deploy/study-plan.service" /etc/systemd/system/study-plan.service
systemctl daemon-reload
systemctl enable study-plan
systemctl restart study-plan

echo "==> Nginx site..."
cp "$APP_DIR/deploy/nginx-study-plan.conf" /etc/nginx/sites-available/study-plan
ln -sf /etc/nginx/sites-available/study-plan /etc/nginx/sites-enabled/study-plan
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo ""
echo "============================================"
echo "Setup complete!"
echo "1. Edit: nano $APP_DIR/.env  (set MENTOR_KEY)"
echo "2. Edit nginx server_name: nano /etc/nginx/sites-available/study-plan"
echo "3. systemctl restart study-plan && systemctl reload nginx"
echo "4. Optional HTTPS: certbot --nginx -d yourdomain.com"
echo "App URL: http://YOUR_DROPLET_IP"
echo "Mentor:  http://YOUR_DROPLET_IP/mentor"
echo "============================================"
