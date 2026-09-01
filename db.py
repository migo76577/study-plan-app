import json
import os
import secrets
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone

DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "data", "studyplan.db"))


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                access_code TEXT UNIQUE NOT NULL,
                mentor_name TEXT DEFAULT '',
                start_date TEXT DEFAULT '',
                end_date TEXT DEFAULT '',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS progress (
                student_id TEXT PRIMARY KEY,
                data TEXT NOT NULL DEFAULT '{}',
                updated_at TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(id)
            );
            """
        )


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def _now():
    return datetime.now(timezone.utc).isoformat()


def _empty_progress():
    return {"checks": {}, "fields": {}, "scores": {}}


def generate_access_code():
    return secrets.token_hex(3).upper()


def create_student(name, mentor_name="", start_date="", end_date=""):
    student_id = secrets.token_urlsafe(8)
    access_code = generate_access_code()
    now = _now()
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO students (id, name, access_code, mentor_name, start_date, end_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (student_id, name.strip(), access_code, mentor_name.strip(), start_date, end_date, now),
        )
        conn.execute(
            "INSERT INTO progress (student_id, data, updated_at) VALUES (?, ?, ?)",
            (student_id, json.dumps(_empty_progress()), now),
        )
    return {"id": student_id, "access_code": access_code, "name": name.strip()}


def login_student(access_code):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM students WHERE access_code = ?",
            (access_code.strip().upper(),),
        ).fetchone()
    if not row:
        return None
    return dict(row)


def get_student(student_id):
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    return dict(row) if row else None


def get_progress(student_id):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT data FROM progress WHERE student_id = ?", (student_id,)
        ).fetchone()
    if not row:
        return _empty_progress()
    return json.loads(row["data"])


def save_progress(student_id, data):
    now = _now()
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO progress (student_id, data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(student_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
            """,
            (student_id, json.dumps(data), now),
        )


def list_students():
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT s.*, p.data, p.updated_at AS last_active
            FROM students s
            LEFT JOIN progress p ON s.id = p.student_id
            ORDER BY s.created_at DESC
            """
        ).fetchall()
    return [dict(r) for r in rows]


def week_tasks_complete(progress_data, week_index):
    """True when every daily task and assignment checklist item is checked for the week."""
    from assignments_detail import ASSIGNMENTS
    from curriculum import WEEKS

    if week_index < 0 or week_index >= len(WEEKS):
        return False
    week = WEEKS[week_index]
    assignment = ASSIGNMENTS[week_index]
    checks = progress_data.get("checks", {})
    reqs = assignment.get("requirements") or week.get("assignment") or []

    for day, tasks in week["days"].items():
        for ti, _ in enumerate(tasks):
            if not checks.get(f"w{week_index}-d-{day}-t{ti}"):
                return False
    for ri, _ in enumerate(reqs):
        if not checks.get(f"w{week_index}-a-{ri}"):
            return False
    return True


def list_reflections(fields, max_week=10):
    items = []
    for w in range(1, max_week + 1):
        submitted_at = fields.get(f"reflection-w{w}-submitted-at")
        if submitted_at:
            items.append(
                {
                    "week": w,
                    "learned": fields.get(f"reflection-w{w}-learned", ""),
                    "hard": fields.get(f"reflection-w{w}-hard", ""),
                    "hours": fields.get(f"reflection-w{w}-hours", ""),
                    "confidence": fields.get(f"reflection-w{w}-confidence", ""),
                    "submitted_at": submitted_at,
                }
            )
    return sorted(items, key=lambda x: x["week"], reverse=True)


def regenerate_access_code(student_id):
    new_code = generate_access_code()
    with get_conn() as conn:
        row = conn.execute("SELECT id FROM students WHERE id = ?", (student_id,)).fetchone()
        if not row:
            return None
        conn.execute(
            "UPDATE students SET access_code = ? WHERE id = ?",
            (new_code, student_id),
        )
    return new_code


def validate_submit_checks(existing_checks, new_checks):
    """Reject new assignment submissions when week tasks are incomplete."""
    from assignments_detail import ASSIGNMENTS

    for assignment in ASSIGNMENTS:
        week_num = assignment["week"]
        key = f"submit-w{week_num}"
        if not new_checks.get(key):
            continue
        if existing_checks.get(key):
            continue
        wi = week_num - 1
        progress = {"checks": new_checks}
        if not week_tasks_complete(progress, wi):
            return (
                False,
                f"Complete all Week {week_num} tasks before marking the assignment submitted.",
            )
    return True, None


def apply_mentor_scores(checks, incoming_scores, existing_scores):
    """Only allow scores for assignments the student has marked submitted."""
    from assignments_detail import ASSIGNMENTS

    checks = checks or {}
    incoming = incoming_scores or {}
    existing = {str(k): v for k, v in (existing_scores or {}).items()}

    for assignment in ASSIGNMENTS:
        week = assignment["week"]
        wk = str(week)
        if wk not in incoming and week not in incoming:
            continue
        val = incoming.get(wk, incoming.get(week))
        if val is not None and str(val).strip() != "":
            if not checks.get(f"submit-w{week}"):
                return (
                    False,
                    f"Week {week} assignment has not been submitted — cannot award a score.",
                    None,
                )

    result = {}
    for assignment in ASSIGNMENTS:
        week = assignment["week"]
        wk = str(week)
        if not checks.get(f"submit-w{week}"):
            continue
        if wk in incoming or week in incoming:
            val = incoming.get(wk, incoming.get(week))
            if val is not None and str(val).strip() != "":
                result[wk] = val
        elif wk in existing and str(existing[wk]).strip() != "":
            result[wk] = existing[wk]

    return True, None, result


def is_week_unlocked(progress_data, week_num):
    """Week N unlocks after assignment N-1 is marked submitted."""
    if week_num <= 1:
        return True
    checks = progress_data.get("checks", {})
    return bool(checks.get(f"submit-w{week_num - 1}"))


def max_unlocked_week(progress_data):
    from curriculum import ASSIGNMENTS

    unlocked = 1
    for a in ASSIGNMENTS:
        if a["week"] == 1:
            continue
        if is_week_unlocked(progress_data, a["week"]):
            unlocked = a["week"]
        else:
            break
    return unlocked


def compute_stats(progress_data):
    from curriculum import ASSIGNMENTS, WEEKS

    checks = progress_data.get("checks", {})
    scores = progress_data.get("scores", {})

    total_tasks = 0
    done_tasks = 0
    weeks_done = 0

    for wi, week in enumerate(WEEKS):
        week_total = 0
        week_done = 0
        for day, tasks in week["days"].items():
            for ti, _ in enumerate(tasks):
                week_total += 1
                total_tasks += 1
                if checks.get(f"w{wi}-d-{day}-t{ti}"):
                    week_done += 1
                    done_tasks += 1
        for ri, _ in enumerate(week["assignment"]):
            week_total += 1
            total_tasks += 1
            if checks.get(f"w{wi}-a-{ri}"):
                week_done += 1
                done_tasks += 1
        if week_total and week_done == week_total:
            weeks_done += 1

    submitted = sum(1 for a in ASSIGNMENTS if checks.get(f"submit-w{a['week']}"))
    total_score = sum(int(scores.get(str(a["week"]), 0) or 0) for a in ASSIGNMENTS)
    pct = round((done_tasks / total_tasks) * 100) if total_tasks else 0

    return {
        "percent": pct,
        "done_tasks": done_tasks,
        "total_tasks": total_tasks,
        "weeks_done": weeks_done,
        "submitted": submitted,
        "total_score": total_score,
    }
