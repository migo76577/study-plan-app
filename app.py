import json
import os

from datetime import timedelta

from flask import Flask, jsonify, request, send_from_directory, session

import db
from curriculum import ASSIGNMENTS, WEEKS

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-change-me-in-production")

_is_production = os.environ.get("FLASK_ENV") == "production" or bool(os.environ.get("RENDER"))
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("SESSION_COOKIE_SECURE", "true" if _is_production else "false").lower()
    == "true",
    PERMANENT_SESSION_LIFETIME=timedelta(days=30),
)


@app.before_request
def make_session_permanent():
    session.permanent = True

MENTOR_KEY = os.environ.get("MENTOR_KEY", "mentor123")

db.init_db()

DIST_DIR = os.path.join(os.path.dirname(__file__), "static", "dist")


def require_mentor():
    key = request.headers.get("X-Mentor-Key") or request.args.get("key")
    return key == MENTOR_KEY


def serve_spa():
    if not os.path.isdir(DIST_DIR):
        return (
            "Frontend not built. Run: cd frontend && npm install && npm run build",
            503,
        )
    return send_from_directory(DIST_DIR, "index.html")


@app.route("/")
def index():
    return serve_spa()


@app.route("/week/<int:week_num>")
def week_page(week_num):
    if week_num < 1 or week_num > len(WEEKS):
        return serve_spa()
    return serve_spa()


@app.route("/assignments")
def assignments_page():
    return serve_spa()


@app.route("/reflection")
def reflection_page():
    return serve_spa()


@app.route("/mentor")
def mentor_page():
    return serve_spa()


@app.route("/mentor/<path:subpath>")
def mentor_subpages(subpath):
    return serve_spa()


@app.route("/assets/<path:filename>")
def vite_assets(filename):
    return send_from_directory(os.path.join(DIST_DIR, "assets"), filename)


@app.route("/api/curriculum")
def curriculum():
    return jsonify({"weeks": WEEKS, "assignments": ASSIGNMENTS})


@app.route("/api/students", methods=["POST"])
def create_student():
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Name is required"}), 400
    student = db.create_student(
        name=name,
        mentor_name=body.get("mentor_name", ""),
        start_date=body.get("start_date", ""),
        end_date=body.get("end_date", ""),
    )
    session.permanent = True
    session["student_id"] = student["id"]
    return jsonify(student)


@app.route("/api/login", methods=["POST"])
def login():
    body = request.get_json(silent=True) or {}
    code = (body.get("access_code") or "").strip()
    if not code:
        return jsonify({"error": "Access code is required"}), 400
    student = db.login_student(code)
    if not student:
        return jsonify({"error": "Invalid access code"}), 404
    session.permanent = True
    session["student_id"] = student["id"]
    return jsonify(
        {
            "id": student["id"],
            "name": student["name"],
            "access_code": student["access_code"],
            "mentor_name": student["mentor_name"],
            "start_date": student["start_date"],
            "end_date": student["end_date"],
        }
    )


@app.route("/api/me")
def me():
    student_id = session.get("student_id")
    if not student_id:
        return jsonify({"logged_in": False})
    student = db.get_student(student_id)
    if not student:
        session.pop("student_id", None)
        return jsonify({"logged_in": False})
    progress = db.get_progress(student_id)
    stats = db.compute_stats(progress)
    return jsonify(
        {
            "logged_in": True,
            "id": student["id"],
            "name": student["name"],
            "access_code": student["access_code"],
            "mentor_name": student["mentor_name"],
            "start_date": student["start_date"],
            "end_date": student["end_date"],
            "progress": progress,
            "stats": stats,
            "max_unlocked_week": db.max_unlocked_week(progress),
        }
    )


@app.route("/api/week/<int:week_num>/access")
def week_access(week_num):
    if week_num < 1 or week_num > len(WEEKS):
        return jsonify({"error": "Invalid week"}), 400
    student_id = session.get("student_id")
    if not student_id:
        return jsonify({"error": "Not logged in", "unlocked": False}), 401
    progress = db.get_progress(student_id)
    unlocked = db.is_week_unlocked(progress, week_num)
    if not unlocked:
        return jsonify(
            {
                "unlocked": False,
                "week": week_num,
                "message": f"Submit Assignment {week_num - 1} to unlock Week {week_num}.",
                "max_unlocked_week": db.max_unlocked_week(progress),
            }
        ), 403
    return jsonify({"unlocked": True, "week": week_num})


@app.route("/api/progress", methods=["PUT"])
def save_progress():
    student_id = session.get("student_id")
    if not student_id:
        return jsonify({"error": "Not logged in"}), 401
    body = request.get_json(silent=True) or {}
    existing = db.get_progress(student_id)
    new_checks = body.get("checks", {})
    existing_checks = existing.get("checks", {})
    ok, err = db.validate_submit_checks(existing_checks, new_checks)
    if not ok:
        return jsonify({"error": err}), 400
    # Scores are mentor-only — preserve existing scores when mentee saves progress
    data = {
        "checks": new_checks,
        "fields": body.get("fields", {}),
        "scores": existing.get("scores", {}),
    }
    db.save_progress(student_id, data)
    stats = db.compute_stats(data)
    return jsonify({"ok": True, "stats": stats})


@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop("student_id", None)
    return jsonify({"ok": True})


@app.route("/api/mentor/students")
def mentor_students():
    if not require_mentor():
        return jsonify({"error": "Unauthorized"}), 401
    students = []
    for row in db.list_students():
        progress = json.loads(row.get("data") or "{}")
        stats = db.compute_stats(progress)
        students.append(
            {
                "id": row["id"],
                "name": row["name"],
                "access_code": row["access_code"],
                "mentor_name": row["mentor_name"],
                "start_date": row["start_date"],
                "end_date": row["end_date"],
                "last_active": row.get("last_active"),
                "stats": stats,
            }
        )
    return jsonify(students)


@app.route("/api/mentor/students/<student_id>/progress")
def mentor_student_progress(student_id):
    if not require_mentor():
        return jsonify({"error": "Unauthorized"}), 401
    student = db.get_student(student_id)
    if not student:
        return jsonify({"error": "Not found"}), 404
    progress = db.get_progress(student_id)
    fields = progress.get("fields", {})
    return jsonify(
        {
            "student": student,
            "progress": progress,
            "stats": db.compute_stats(progress),
            "reflections": db.list_reflections(fields),
        }
    )


@app.route("/api/mentor/students/<student_id>/scores", methods=["PUT"])
def mentor_update_scores(student_id):
    if not require_mentor():
        return jsonify({"error": "Unauthorized"}), 401
    if not db.get_student(student_id):
        return jsonify({"error": "Not found"}), 404
    body = request.get_json(silent=True) or {}
    progress = db.get_progress(student_id)
    checks = progress.get("checks", {})
    existing_scores = progress.get("scores", {})
    ok, err, scores = db.apply_mentor_scores(checks, body.get("scores", {}), existing_scores)
    if not ok:
        return jsonify({"error": err}), 400
    progress["scores"] = scores
    db.save_progress(student_id, progress)
    return jsonify({"ok": True, "stats": db.compute_stats(progress)})


@app.route("/api/mentor/students/<student_id>/reset-code", methods=["POST"])
def mentor_reset_access_code(student_id):
    if not require_mentor():
        return jsonify({"error": "Unauthorized"}), 401
    if not db.get_student(student_id):
        return jsonify({"error": "Not found"}), 404
    new_code = db.regenerate_access_code(student_id)
    if not new_code:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True, "access_code": new_code})


@app.route("/<path:path>")
def spa_catch_all(path):
    if path.startswith(("api/", "assets/", "static/")):
        return jsonify({"error": "Not found"}), 404
    return serve_spa()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
