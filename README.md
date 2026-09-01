# Study Plan App

A hosted web app for tracking the 10-week Python & SQL study plan. Built with **Flask + React + Tailwind**.

## Features

- Student login with a personal **access code** (works on any device)
- **React UI** with responsive layout — sidebar week nav on desktop, mobile bottom nav
- **Week locking** — submit Assignment N to unlock Week N+1 (self-paced; mentor score not required to advance)
- **Daily task gate** — assignment submit is blocked until all week tasks are checked off
- Rich assignment briefs with examples, rubrics, and checklists
- Weekly reflections (read-only after submit)
- Auto-save progress to the server
- **Mentor-only scores** — mentees see scores; only mentors can award them
- **Mentor dashboard** at `/mentor` — React page to view students, score assignments, read reflections, reset access codes

## Run locally

### 1. Backend (Flask)

```bash
cd study-plan-app
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # optional — edit MENTOR_KEY if you like
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run build    # outputs to ../static/dist
```

### 3. Start server

```bash
cd ..   # back to study-plan-app
PORT=5001 python app.py
```

Open http://localhost:5001

> On macOS, port 5000 is often used by AirPlay. Use `PORT=5001` or disable AirPlay Receiver.

### Frontend dev mode (optional)

Run Flask on 5001 and Vite dev server with API proxy:

```bash
# Terminal 1
PORT=5001 python app.py

# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:5173

**Default mentor key (local only):** `mentor123` — change before deploying!

## Deploy on Render

1. Push this repo to GitHub (first commit — see checklist below)
2. In [Render](https://render.com), create a **Blueprint** from your repo (`render.yaml` is included)
3. Set **`MENTOR_KEY`** to a strong secret when prompted
4. Deploy — first build runs Python deps + `npm run build` (a few minutes)

**Plan:** `render.yaml` uses **Starter** with a **1 GB persistent disk** so SQLite data survives redeploys. Render’s **free** tier cannot attach disks — student progress would be lost on every restart.

**After deploy:** run the smoke test below on your live URL.

### Pre-deploy checklist

- [ ] Code on GitHub (`git init`, commit, push)
- [ ] Strong `MENTOR_KEY` chosen (not `mentor123`)
- [ ] Smoke test passed locally
- [ ] Starter plan OK (~$7/mo for always-on + persistent disk)

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Production | Flask session secret |
| `MENTOR_KEY` | Production | Password for mentor dashboard |
| `DATABASE_PATH` | Optional | SQLite file path (default: `./data/studyplan.db`; Render: `/var/data/studyplan.db`) |
| `SESSION_COOKIE_SECURE` | Production | Set `true` when served over HTTPS (auto on Render) |
| `PORT` | Optional | Port (default: 5000) |

## How progress works

### Week locking
- Week 1 is always open
- Week N+1 unlocks when the student marks **Assignment N** as submitted
- Locked weeks show in the sidebar; direct URLs show a lock screen
- Mentor scores do **not** gate week unlock — mentees advance at their own pace after submitting

### Assignment submission
- Students must check off **all daily tasks and assignment checklist items** for the week before they can mark the assignment submitted
- This is enforced in the UI and on the server

### Scores
- Only mentors can award scores via `/mentor`
- Mentees see scores as read-only (“Pending review” until scored)

### Access codes
- Shown once at registration — students should copy and save them
- If a student loses their code, the mentor can view or **reset** it from `/mentor`

## Smoke test checklist

Before onboarding mentees:

- [ ] Register a test student and save the access code
- [ ] Log in from a second browser/device with the same code
- [ ] Complete Week 1 daily tasks on the Dashboard
- [ ] Submit Assignment 1 on the week page — Week 2 unlocks
- [ ] Submit a weekly reflection — form becomes read-only
- [ ] Log in to `/mentor`, score the assignment, read the reflection
- [ ] Confirm mentee sees the score on Assignments page

## Project structure

```
study-plan-app/
  app.py                 # Flask API + serves React build
  db.py                  # SQLite + week unlock + validation
  curriculum.py          # Weekly plan data
  assignments_detail.py  # Full assignment briefs
  render.yaml            # Render deploy blueprint
  frontend/              # React + Tailwind (Vite) — includes /mentor page
  static/dist/           # Production build (run npm run build)
  data/                  # SQLite DB (auto-created locally)
```
