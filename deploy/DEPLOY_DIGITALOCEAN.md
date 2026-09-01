# Deploy on DigitalOcean Droplet

Host the study plan app on a Ubuntu droplet with **Nginx + Gunicorn + systemd**.

**Repo:** https://github.com/migo76577/study-plan-app

---

## What you need

- A [DigitalOcean](https://www.digitalocean.com) account
- Your GitHub repo pushed to `migo76577/study-plan-app`
- ~15 minutes for first setup

**Recommended droplet:** Ubuntu 24.04, **Basic $6/mo** (1 GB RAM) or **$12/mo** (2 GB RAM if builds feel slow)

---

## Step 1 — Create the droplet

1. DigitalOcean → **Create → Droplets**
2. **Image:** Ubuntu 24.04 LTS
3. **Plan:** Basic → Regular → $6/mo (1 GB) minimum
4. **Authentication:** SSH key (recommended) or password
5. **Hostname:** `study-plan-app`
6. Click **Create Droplet**
7. Copy the **IP address** (e.g. `164.92.xxx.xxx`)

---

## Step 2 — SSH into the droplet

From your Mac:

```bash
ssh root@YOUR_DROPLET_IP
```

---

## Step 3 — Run one-time setup

On the droplet:

```bash
apt-get update && apt-get install -y git
git clone https://github.com/migo76577/study-plan-app.git /var/www/study-plan-app
cd /var/www/study-plan-app
bash deploy/setup-droplet.sh
```

This installs Python, Node, Nginx, clones the app, builds the React frontend, and starts the service.

---

## Step 4 — Configure secrets

Edit the environment file:

```bash
nano /var/www/study-plan-app/.env
```

Set at minimum:

```env
FLASK_ENV=production
SECRET_KEY=already-generated-by-setup-script
MENTOR_KEY=your-strong-private-password
DATABASE_PATH=/var/www/study-plan-app/data/studyplan.db
SESSION_COOKIE_SECURE=false
```

Save, then restart:

```bash
systemctl restart study-plan
```

---

## Step 5 — Point Nginx at your IP or domain

```bash
nano /etc/nginx/sites-available/study-plan
```

Change:

```
server_name YOUR_DOMAIN_OR_IP;
```

to your droplet IP or domain, e.g.:

```
server_name 164.92.xxx.xxx;
```

Or if you have a domain:

```
server_name study.yourdomain.com;
```

Then:

```bash
nginx -t
systemctl reload nginx
```

---

## Step 6 — Test

Open in your browser:

- **Student app:** `http://YOUR_DROPLET_IP`
- **Mentor dashboard:** `http://YOUR_DROPLET_IP/mentor`

Register a test student, save the access code, log in at `/mentor` with your `MENTOR_KEY`.

---

## Step 7 — HTTPS (recommended)

If you have a domain pointing to the droplet:

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d study.yourdomain.com
```

Then update `.env`:

```bash
nano /var/www/study-plan-app/.env
# Set:
SESSION_COOKIE_SECURE=true
```

```bash
systemctl restart study-plan
```

---

## Updating after code changes

Push to GitHub, then on the droplet:

```bash
bash /var/www/study-plan-app/deploy/deploy.sh
```

Or manually:

```bash
cd /var/www/study-plan-app
git pull origin main
./venv/bin/pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..
systemctl restart study-plan
```

---

## Useful commands

| Task | Command |
|------|---------|
| App status | `systemctl status study-plan` |
| App logs | `journalctl -u study-plan -f` |
| Nginx logs | `tail -f /var/log/nginx/error.log` |
| Restart app | `systemctl restart study-plan` |
| Edit env | `nano /var/www/study-plan-app/.env` |

---

## Firewall (optional but recommended)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## Share with your mentee

Send her:

1. App URL: `https://study.yourdomain.com` (or `http://IP`)
2. Tell her to click **First time** → register → **save her access code**
3. Mentor URL stays private: `/mentor` + your `MENTOR_KEY`

---

## Troubleshooting

**502 Bad Gateway**
- App not running: `systemctl status study-plan`
- Check logs: `journalctl -u study-plan -n 50`

**Blank page / no CSS**
- Frontend not built: `cd /var/www/study-plan-app/frontend && npm run build`
- Restart: `systemctl restart study-plan`

**Progress lost after reboot**
- Data lives in `/var/www/study-plan-app/data/studyplan.db` — it persists on the droplet disk
- Do not delete the `data/` folder

**Build runs out of memory on 1 GB droplet**
- Add swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`
- Or upgrade to 2 GB droplet

---

## Files in `deploy/`

| File | Purpose |
|------|---------|
| `setup-droplet.sh` | One-time server setup |
| `deploy.sh` | Pull + rebuild + restart |
| `study-plan.service` | systemd unit for Gunicorn |
| `nginx-study-plan.conf` | Nginx reverse proxy |
