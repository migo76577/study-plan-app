"""Full assignment briefs — task, examples, rubrics, and motivation hooks."""

ASSIGNMENTS = [
    {
        "week": 1,
        "name": "Personal Profile Generator",
        "phase": "Python Foundations",
        "tagline": "Your first real Python app — turn user input into a polished profile card.",
        "why": "Every app you will ever build starts here: asking questions, storing answers, and showing results. By Thursday you'll have something you can demo to anyone.",
        "due": "Thursday, Week 1",
        "submit_via": "GitHub or shared folder",
        "task": "Build a Python script that asks the user for their personal details and prints a formatted profile card.",
        "requirements": [
            "Ask for: full name, age, university course/major, city, and one career goal",
            "Store each answer in a variable",
            "Calculate at least one derived value (e.g., years until age 30, year born)",
            "Print a formatted card using f-strings",
            "Add comments explaining each section of your code",
            "File must run without errors",
        ],
        "expected_output": """=============================
     STUDENT PROFILE
=============================
Name:   Jane Doe
Age:    20 years old
Course: Computer Science
City:   Nairobi
Goal:   Build apps with Python
Born:   ~2005
Years until 30: 10
=============================""",
        "bonus": [
            "Reject negative age or age over 120 with an error message",
            "Ask for GPA and print whether they are on Dean's List (GPA ≥ 3.5)",
        ],
        "rubric": [
            {"criteria": "Runs without errors", "points": 20, "good": "Script executes from start to finish"},
            {"criteria": "Uses variables correctly", "points": 20, "good": "At least 5 meaningful variables"},
            {"criteria": "Uses input() and f-strings", "points": 20, "good": "Interactive and formatted output"},
            {"criteria": "Includes calculation", "points": 15, "good": "At least one computed value"},
            {"criteria": "Code comments", "points": 15, "good": "Comments on each logical section"},
            {"criteria": "Clean formatting", "points": 10, "good": "Readable output, consistent style"},
        ],
        "practice_project": {
            "name": "Subject Score Analyzer",
            "when": "Optional · Days 5–6",
            "tagline": "Optional weekend practice — warms you up for Week 2's Grade Calculator.",
            "why": "This is not graded. It lets you practice input(), variables, and if/else before loops and validation get harder in Week 2.",
            "task": "Build a Python script that asks for subject scores and prints a short academic summary.",
            "steps": [
                "Base version (start here if new): ask for 3 subjects and scores, print total, average, and pass/fail (pass if average ≥ 50)",
                "Day 5: reject invalid scores — if score is negative or over 100, ask again",
                "Day 6: add a 4th subject and print a letter grade — A (80+), B (70–79), C (60–69), D (50–59), F (<50)",
            ],
            "expected_output": """--- Subject Score Analyzer ---
Math: 78
English: 65
Science: 82

Total: 225
Average: 75.0
Result: PASS
Letter grade: B""",
        },
    },
    {
        "week": 2,
        "name": "Grade Calculator with Feedback",
        "phase": "Python Foundations",
        "tagline": "Build the brain of every gradebook — loops, conditions, and smart feedback.",
        "why": "If/else and loops are the superpowers of programming. This assignment proves you can make a program think and repeat — the foundation of every game, app, and tool you'll write.",
        "due": "Thursday, Week 2",
        "submit_via": "GitHub or shared folder",
        "task": "Build a program that collects subject scores and gives detailed academic feedback.",
        "requirements": [
            "Ask how many subjects (or fixed 5 subjects)",
            "Collect each score using a loop",
            "Reject invalid scores (negative or greater than 100) — ask again",
            "Print: total, average, pass/fail (pass if average ≥ 50)",
            "Print grade band: A (80+), B (70–79), C (60–69), D (50–59), F (<50)",
            "Print highest and lowest subject score",
            "Count and print how many subjects scored below 50",
        ],
        "rubric": [
            {"criteria": "Correct if/elif/else logic for grades", "points": 25},
            {"criteria": "Uses at least one loop correctly", "points": 25},
            {"criteria": "Input validation works", "points": 20},
            {"criteria": "All 7 outputs printed correctly", "points": 20},
            {"criteria": "Clean, readable code", "points": 10},
        ],
    },
    {
        "week": 3,
        "name": "To-Do List Manager",
        "phase": "Python Foundations",
        "tagline": "Every productivity app starts here — your own command-line to-do manager.",
        "why": "Lists, dictionaries, and functions are how real software organizes data. You'll build the same patterns used in Notion, Todoist, and every task app on your phone.",
        "due": "Thursday, Week 3",
        "submit_via": "GitHub or shared folder",
        "task": "Build a command-line to-do list using functions and a list of dictionaries.",
        "requirements": [
            "add_task(tasks, task, priority) — add a new task",
            "view_tasks(tasks) — show all tasks with status",
            "mark_done(tasks, index) — mark a task complete",
            "count_pending(tasks) — return count of incomplete tasks",
            "Main menu loop: 1=Add, 2=View, 3=Mark Done, 4=Count Pending, 5=Exit",
        ],
        "sections": [
            {
                "title": "Data structure to use",
                "type": "code",
                "content": """tasks = [
    {"task": "Study SQL", "done": False, "priority": "high"},
    {"task": "Finish Assignment 2", "done": True, "priority": "medium"},
]""",
            },
        ],
        "bonus": [
            "delete_task(tasks, index)",
            "Filter view by priority (show only high priority tasks)",
        ],
    },
    {
        "week": 4,
        "name": "Expense Tracker (CSV)",
        "phase": "Python Intermediate",
        "tagline": "Real apps save data — yours will track expenses in a file that persists forever.",
        "why": "Files and CSV are how Python talks to Excel, databases, and the real world. After this week you'll never lose data when your program closes.",
        "due": "Thursday, Week 4",
        "submit_via": "GitHub or shared folder",
        "task": "Build a personal expense tracker that saves data to expenses.csv.",
        "requirements": [
            "Add a new expense",
            "View all expenses",
            "Show total spent (all time)",
            "Show total spent by category",
            "Handle bad input with try/except",
            "Data persists after program closes (saved to CSV)",
        ],
        "sections": [
            {
                "title": "CSV format",
                "type": "code",
                "content": """date,category,amount,note
2026-09-01,Food,450,Lunch at cafeteria
2026-09-01,Transport,100,Bus fare""",
            },
        ],
        "bonus": [
            "Show the single most expensive day",
            "Filter expenses by date range",
        ],
    },
    {
        "week": 5,
        "name": "Bank Account Class",
        "phase": "Python Intermediate",
        "tagline": "Think like a software engineer — model a bank account with classes and methods.",
        "why": "Object-oriented programming is how professional code is organized. Classes let you build systems that scale — this is the week you start thinking like a developer, not just a coder.",
        "due": "Thursday, Week 5",
        "submit_via": "GitHub or shared folder",
        "task": "Create a BankAccount class and simulate real banking operations.",
        "requirements": [
            "__init__(self, owner, balance=0)",
            "deposit(self, amount) — add money, reject negative amounts",
            "withdraw(self, amount) — subtract money, reject if insufficient funds",
            "get_balance(self) — return current balance",
            "display_statement(self) — print owner, balance, transaction count",
            "Create 2 accounts for different owners",
            "Perform at least 5 transactions across both accounts",
            "Print a statement for each account at the end",
        ],
        "bonus": [
            "Store transaction history in a list and display it",
            "Add a transfer(other_account, amount) method",
        ],
    },
    {
        "week": 6,
        "name": "Library Database",
        "phase": "SQL Foundations",
        "tagline": "Enter the world of databases — query a library of books like a real data analyst.",
        "why": "SQL is one of the most in-demand skills in tech. Every company stores data in tables — after this assignment you'll speak the language of data.",
        "due": "Thursday, Week 6",
        "submit_via": "library.sql file",
        "task": "Design a library database, populate it with realistic data, and write 15 queries that prove you can find anything.",
        "requirements": [
            "CREATE books and members tables",
            "Insert 10+ books and 5+ members with realistic data",
            "15 SELECT queries (see query list below)",
            "At least one GROUP BY query",
            "At least one UPDATE and DELETE",
            "Submit library.sql file",
        ],
        "sections": [
            {
                "title": "Step 1 — Create tables",
                "type": "code",
                "content": """CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    year INTEGER,
    copies_available INTEGER DEFAULT 1
);

CREATE TABLE members (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    join_date TEXT
);""",
            },
            {
                "title": "Step 3 — Write these 15 queries",
                "type": "ordered_list",
                "items": [
                    "Select all books",
                    "Books published after 2010",
                    "Books by a specific author (use WHERE)",
                    "Books sorted by year (newest first)",
                    "Books with \"the\" in the title (use LIKE)",
                    "Count total books",
                    "Count books per genre (GROUP BY)",
                    "Genres with more than 2 books (HAVING)",
                    "Members who joined in 2025 or 2026",
                    "Top 5 oldest books (ORDER BY year ASC LIMIT 5)",
                    "Books with zero copies available",
                    "Update a book's copies_available",
                    "Delete a member (then verify with SELECT)",
                    "Average publication year by genre",
                    "Your own creative query — explain what it does in a comment",
                ],
            },
        ],
        "callout": {
            "type": "info",
            "text": "From this week onward, your evening block includes SQL. Install DB Browser for SQLite. All SQL assignments are submitted as .sql files.",
        },
    },
    {
        "week": 7,
        "name": "University Enrollment System",
        "phase": "SQL Foundations",
        "tagline": "Master JOINs — connect students, courses, and grades across multiple tables.",
        "why": "JOINs are where SQL gets powerful. This is the skill that separates beginners from people who can actually answer business questions with data.",
        "due": "Thursday, Week 7",
        "submit_via": "enrollment.sql + short explanation doc",
        "task": "Build a university enrollment database and write 20 queries that join students, courses, and grades.",
        "requirements": [
            "students, courses, enrollments tables with foreign keys",
            "8+ students across 3 departments",
            "6+ courses and 20+ enrollment records with grades (0–100)",
            "Average grade per course",
            "Students enrolled in more than 3 courses",
            "Courses with zero enrollments (LEFT JOIN)",
            "Top 3 students by average grade",
            "Department with the most students",
            "Students who failed any course (grade < 50)",
            "Total credits each student is taking this semester",
            "Explain your 3 hardest queries in writing",
        ],
        "sections": [
            {
                "title": "Tables to create",
                "type": "code",
                "content": """students    (id, name, email, department)
courses     (id, course_name, credits, instructor)
enrollments (id, student_id, course_id, grade, semester)""",
            },
        ],
    },
    {
        "week": 8,
        "name": "Campus Café Case Study",
        "phase": "SQL Foundations",
        "tagline": "Design a café database from scratch and answer real business questions with SQL.",
        "why": "This is a real-world case study — the kind of problem you'd solve as a data analyst. ER diagrams, foreign keys, and business queries all come together here.",
        "due": "Thursday, Week 8",
        "submit_via": "SQL file + ER diagram",
        "task": "Design a campus café database, build it with foreign keys, and answer 10 business questions with SQL.",
        "requirements": [
            "ER diagram: menu_items, orders, order_items, staff",
            "Foreign keys on all relationships",
            "Best-selling item query",
            "Revenue by day",
            "Items never ordered (LEFT JOIN)",
            "CASE WHEN for Premium/Standard items",
        ],
        "sections": [
            {
                "title": "Step 1 — Design your ER diagram",
                "type": "list",
                "items": [
                    "menu_items (id, name, category, price)",
                    "orders (id, order_date, staff_id, customer_name)",
                    "order_items (order_id, item_id, quantity)",
                    "staff (id, name, role)",
                ],
            },
            {
                "title": "Step 3 — Answer these 10 business questions",
                "type": "ordered_list",
                "items": [
                    "What is the best-selling menu item (by quantity)?",
                    "What is the total revenue?",
                    "Revenue by day",
                    "Which staff member handled the most orders?",
                    "Menu items that have never been ordered",
                    "Average order value",
                    "Most popular category",
                    "Orders above average value (subquery)",
                    "Classify items as Premium or Standard using CASE WHEN (price > 500 = Premium)",
                    "Daily revenue ranked best to worst",
                ],
            },
        ],
    },
    {
        "week": 9,
        "name": "Contact Book (Python + SQLite)",
        "phase": "Python + SQL",
        "tagline": "The magic moment — Python and SQLite working together in one app.",
        "why": "This is the skill combo that powers most small apps and startups. Python for logic, SQLite for storage — you'll build a complete app that could ship tomorrow.",
        "due": "Thursday, Week 9",
        "submit_via": "GitHub or shared folder",
        "task": "Build a menu-driven contact book that stores data in SQLite and uses safe, parameterized queries.",
        "requirements": [
            "Add contact (name, phone, email)",
            "Search contact by name (partial match)",
            "List all contacts",
            "Delete contact by name",
            "Count total contacts",
            "Menu-driven CLI loop",
            "Uses parameterized queries (NEVER string concatenation in SQL)",
            "try/except for database errors",
        ],
        "sections": [
            {
                "title": "Code pattern to follow",
                "type": "code",
                "content": """import sqlite3

conn = sqlite3.connect("contacts.db")
cursor = conn.cursor()

# Always use ? placeholders
cursor.execute(
    "INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)",
    (name, phone, email),
)
conn.commit()
conn.close()""",
            },
        ],
        "bonus": ["Add an update contact feature"],
    },
    {
        "week": 10,
        "name": "Student Performance System (Capstone)",
        "phase": "Capstone",
        "tagline": "Your graduation project — a full system YOU designed, built, and will demo live.",
        "why": "Ten weeks of learning come together here. This is proof you can build real software — the project you'll put on your portfolio and talk about in interviews.",
        "due": "Saturday, Week 10",
        "submit_via": "GitHub + live demo",
        "task": "Build a complete Student Performance System with a SQLite database, Python CLI, and a 15-minute presentation for your mentor.",
        "requirements": [
            "students, subjects, scores tables with foreign keys",
            "6 menu options all working",
            "6+ Python functions",
            "Input validation throughout",
            "Parameterized SQL queries throughout",
            "try/except error handling",
            "README with run instructions",
            "15-min live demo prepared",
        ],
        "sections": [
            {
                "title": "Database (3+ related tables)",
                "type": "code",
                "content": """students  (id, name, email, department, enrollment_year)
subjects  (id, subject_name, credits)
scores    (id, student_id, subject_id, score, semester, year)""",
            },
            {
                "title": "Python CLI menu",
                "type": "ordered_list",
                "items": [
                    "Add new student",
                    "Record a score for a student",
                    "View individual student report (all scores + average)",
                    "Class statistics: overall average, pass rate, best subject",
                    "Export a student report to CSV",
                    "Exit",
                ],
            },
            {
                "title": "Presentation checklist (15 minutes)",
                "type": "list",
                "items": [
                    "Demo each menu option live",
                    "Explain your database design (why 3 tables?)",
                    "Show one SQL query and explain it",
                    "Share one thing that was hard and how you solved it",
                    "Share what you want to learn next",
                ],
            },
        ],
        "rubric": [
            {"criteria": "Database design (tables, relationships, keys)", "points": 20},
            {"criteria": "All 6 menu features work correctly", "points": 25},
            {"criteria": "Code quality (functions, validation, error handling)", "points": 20},
            {"criteria": "SQL safety (parameterized queries)", "points": 10},
            {"criteria": "README and project organization", "points": 10},
            {"criteria": "Presentation/demo", "points": 15},
        ],
        "callout": {
            "type": "success",
            "text": "This is your graduation project. You have 6 days (Mon–Sat). Submit on Saturday. You will present this to your mentor in a 15-minute demo. You've got this.",
        },
    },
]
