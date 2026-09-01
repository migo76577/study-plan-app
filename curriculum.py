WEEKS = [
    {
        "title": "Week 1 — Python Basics",
        "days": {
            "Monday": [
                "Morning: Install Python & editor, first print() program",
                "Day: Coddy — variables (30 min)",
                "Evening: Write 5 print statements with your info",
            ],
            "Tuesday": [
                "Morning: Data types — int, float, str, bool",
                "Day: Coddy — strings & numbers",
                "Evening: Convert age to int, calculate birth year",
            ],
            "Wednesday": [
                "Morning: input() and f-strings",
                "Day: Coddy — input exercises",
                "Evening: Build a simple greeting script",
            ],
            "Thursday": [
                "Morning: Operators +, -, *, /, //, % — review week",
                "Day: Coddy — mixed practice",
                "Evening: SUBMIT Assignment 1 — Profile Generator",
            ],
            "Friday": [
                "Morning: Build Subject Score Analyzer (see brief above)",
                "Day: Coddy (30 min)",
                "Evening: Add input validation to your script",
            ],
            "Saturday": [
                "Morning: Add 4th subject & letter grade to your script",
                "Day: Coddy (30 min)",
                "Evening: Weekly reflection (10 min)",
            ],
            "Sunday": [
                "Morning: Review anything unclear from Week 1",
                "Day: Rest",
                "Evening: Plan Week 2 (15 min)",
            ],
        },
        "assignment": [
            "Ask for: name, age, course, city, career goal",
            "Use at least 5 variables",
            "Calculate one derived value (e.g. years until 30)",
            "Print formatted card with f-strings",
            "Add comments explaining each section",
            "Bonus: Validate age (reject negative or > 120)",
        ],
    },
    {
        "title": "Week 2 — Conditions & Loops",
        "days": {
            "Monday": [
                "Morning: if / elif / else, comparison operators",
                "Day: Coddy — conditions",
                "Evening: Write 5 if-statement examples",
            ],
            "Tuesday": [
                "Morning: and, or, not — nested conditions",
                "Day: Coddy — logic",
                "Evening: Build pass/fail checker for one score",
            ],
            "Wednesday": [
                "Morning: for loops and range()",
                "Day: Coddy — loops",
                "Evening: Print multiplication table for one number",
            ],
            "Thursday": [
                "Morning: while loops, break, continue — review",
                "Day: Coddy — mixed",
                "Evening: SUBMIT Assignment 2 — Grade Calculator",
            ],
            "Friday": [
                "Morning: Start Number Guessing Game",
                "Day: Coddy (30 min)",
                "Evening: Add random number & limited tries",
            ],
            "Saturday": [
                "Morning: Finish guessing game with hints",
                "Day: Coddy (30 min)",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review Week 2", "Rest", "Plan Week 3"],
        },
        "assignment": [
            "Collect scores using a loop",
            "Reject invalid scores (< 0 or > 100)",
            "Print total, average, pass/fail",
            "Print grade band A/B/C/D/F",
            "Print highest and lowest score",
            "Count subjects below 50",
        ],
    },
    {
        "title": "Week 3 — Lists, Dicts & Functions",
        "days": {
            "Monday": [
                "Morning: Lists — create, index, append",
                "Day: Coddy — lists",
                "Evening: Store 5 names, print each",
            ],
            "Tuesday": [
                "Morning: Dictionaries — keys, values, .get()",
                "Day: Coddy — dicts",
                "Evening: Phone book with 3 contacts",
            ],
            "Wednesday": [
                "Morning: Functions — def, return",
                "Day: Coddy — functions",
                "Evening: 3 math functions",
            ],
            "Thursday": [
                "Morning: Combine lists + dicts + functions",
                "Day: Coddy",
                "Evening: SUBMIT Assignment 3 — To-Do Manager",
            ],
            "Friday": [
                "Morning: Start Student Gradebook",
                "Day: Coddy",
                "Evening: add_score() function",
            ],
            "Saturday": [
                "Morning: Finish gradebook",
                "Day: Coddy",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review Week 3", "Rest", "Plan Week 4"],
        },
        "assignment": [
            "add_task(tasks, task, priority)",
            "view_tasks(tasks)",
            "mark_done(tasks, index)",
            "count_pending(tasks)",
            "Menu loop: Add, View, Mark Done, Count, Exit",
            "Bonus: delete_task() function",
        ],
    },
    {
        "title": "Week 4 — Files & CSV",
        "days": {
            "Monday": [
                "Morning: Reading files with open() and with",
                "Day: Coddy",
                "Evening: Read file, print line count",
            ],
            "Tuesday": [
                "Morning: Writing files, append mode",
                "Day: Coddy",
                "Evening: Write diary entry to file",
            ],
            "Wednesday": [
                "Morning: try / except error handling",
                "Day: Coddy",
                "Evening: Wrap input in try/except",
            ],
            "Thursday": [
                "Morning: CSV module reader/writer",
                "Day: Coddy",
                "Evening: SUBMIT Assignment 4 — Expense Tracker",
            ],
            "Friday": [
                "Morning: Start file-based gradebook",
                "Day: Coddy",
                "Evening: Save/load CSV",
            ],
            "Saturday": [
                "Morning: Finish gradebook project",
                "Day: Coddy",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review Week 4", "Rest", "Plan Week 5"],
        },
        "assignment": [
            "Add expense function",
            "View all expenses",
            "Total spent (all time)",
            "Total by category",
            "Save/load from expenses.csv",
            "try/except for bad input",
        ],
    },
    {
        "title": "Week 5 — OOP Basics",
        "days": {
            "Monday": [
                "Morning: What is OOP? Classes vs functions",
                "Day: Coddy",
                "Evening: List 3 real-world objects",
            ],
            "Tuesday": [
                "Morning: __init__, self, methods",
                "Day: Coddy",
                "Evening: Simple Dog class",
            ],
            "Wednesday": [
                "Morning: Student class with add_score()",
                "Day: Coddy",
                "Evening: average() method",
            ],
            "Thursday": [
                "Morning: Multiple classes together",
                "Day: Coddy",
                "Evening: SUBMIT Assignment 5 — Bank Account",
            ],
            "Friday": [
                "Morning: OOP gradebook refactor",
                "Day: Coddy",
                "Evening: Student + Gradebook classes",
            ],
            "Saturday": [
                "Morning: Finish OOP project",
                "Day: Coddy",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review Week 5", "Rest", "Mid-program check-in with mentor"],
        },
        "assignment": [
            "BankAccount class with __init__",
            "deposit() — reject negative",
            "withdraw() — no overdraft",
            "get_balance() and display_statement()",
            "2 accounts, 5+ transactions",
            "Bonus: transaction history list",
        ],
    },
    {
        "title": "Week 6 — SQL Basics",
        "days": {
            "Monday": [
                "Morning: Tables, rows, columns, data types",
                "Day: SQLBolt Lesson 1",
                "Evening: Draw first table on paper",
            ],
            "Tuesday": [
                "Morning: SELECT, WHERE, ORDER BY, LIMIT",
                "Day: SQLBolt 2",
                "Evening: Write 5 SELECT queries",
            ],
            "Wednesday": [
                "Morning: INSERT, UPDATE, DELETE",
                "Day: SQLBolt 3",
                "Evening: Insert 10 test rows",
            ],
            "Thursday": [
                "Morning: LIKE, IN, BETWEEN",
                "Day: SQLBolt 4",
                "Evening: SUBMIT Assignment 6 — Library DB",
            ],
            "Friday": [
                "Morning: Build library schema",
                "Day: SQLBolt 5–6",
                "Evening: Write 5 more queries",
            ],
            "Saturday": [
                "Morning: Complete all 15 queries",
                "Day: SQLBolt",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review SQL basics", "Rest", "Plan Week 7"],
        },
        "assignment": [
            "CREATE books and members tables",
            "Insert 10+ books and 5+ members",
            "15 SELECT queries (see full plan doc)",
            "At least one GROUP BY query",
            "At least one UPDATE and DELETE",
            "Submit library.sql file",
        ],
    },
    {
        "title": "Week 7 — SQL JOINs",
        "days": {
            "Monday": [
                "Morning: COUNT, SUM, AVG, GROUP BY",
                "Day: SQLBolt 6",
                "Evening: 5 aggregate queries",
            ],
            "Tuesday": [
                "Morning: INNER JOIN",
                "Day: SQLBolt 7",
                "Evening: Draw table relationships",
            ],
            "Wednesday": [
                "Morning: LEFT JOIN, multiple JOINs",
                "Day: SQLBolt 8",
                "Evening: 3 JOIN queries",
            ],
            "Thursday": [
                "Morning: Foreign keys, HAVING",
                "Day: SQLBolt 9",
                "Evening: SUBMIT Assignment 7 — Enrollment",
            ],
            "Friday": [
                "Morning: Build enrollment database",
                "Day: SQLBolt 10",
                "Evening: Hard queries",
            ],
            "Saturday": [
                "Morning: Finish 20 queries",
                "Day: SQLBolt",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review JOINs", "Rest", "Plan Week 8"],
        },
        "assignment": [
            "students, courses, enrollments tables",
            "8+ students, 6+ courses, 20+ enrollments",
            "Average grade per course",
            "Students in 3+ courses",
            "Courses with zero enrollments (LEFT JOIN)",
            "Explain 3 hardest queries in writing",
        ],
    },
    {
        "title": "Week 8 — Advanced SQL",
        "days": {
            "Monday": [
                "Morning: Subqueries",
                "Day: SQLBolt",
                "Evening: 3 subquery examples",
            ],
            "Tuesday": [
                "Morning: CASE WHEN",
                "Day: SQLBolt",
                "Evening: Classify data with CASE",
            ],
            "Wednesday": [
                "Morning: Database design, ER diagrams",
                "Day: SQLBolt",
                "Evening: Draw Campus Café ER diagram",
            ],
            "Thursday": [
                "Morning: Review advanced SQL",
                "Day: SQLBolt",
                "Evening: SUBMIT Assignment 8 — Campus Café",
            ],
            "Friday": [
                "Morning: Build café database",
                "Day: SQL practice",
                "Evening: 5 business queries",
            ],
            "Saturday": [
                "Morning: Finish 10 business queries",
                "Day: SQL practice",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review Week 8", "Rest", "Plan Week 9"],
        },
        "assignment": [
            "ER diagram: menu_items, orders, order_items, staff",
            "Foreign keys on all relationships",
            "Best-selling item query",
            "Revenue by day",
            "Items never ordered (LEFT JOIN)",
            "CASE WHEN for Premium/Standard items",
        ],
    },
    {
        "title": "Week 9 — Python + SQLite",
        "days": {
            "Monday": [
                "Morning: What is SQLite? Create DB file",
                "Day: Read sqlite3 docs",
                "Evening: Create DB in DB Browser",
            ],
            "Tuesday": [
                "Morning: connect, execute, commit",
                "Day: Coddy",
                "Evening: Insert 3 rows from Python",
            ],
            "Wednesday": [
                "Morning: fetchall(), looping results",
                "Day: Coddy",
                "Evening: SELECT and print from Python",
            ],
            "Thursday": [
                "Morning: Parameterized queries (?)",
                "Day: Coddy",
                "Evening: SUBMIT Assignment 9 — Contact Book",
            ],
            "Friday": [
                "Morning: Start contact book CLI",
                "Day: Coddy",
                "Evening: Add + search features",
            ],
            "Saturday": [
                "Morning: Finish all menu options",
                "Day: Coddy",
                "Evening: Weekly reflection",
            ],
            "Sunday": ["Review Python+SQL", "Rest", "Plan capstone"],
        },
        "assignment": [
            "Add, search, list, delete, count contacts",
            "SQLite database with contacts table",
            "Menu-driven CLI loop",
            "Parameterized queries only (no string concat)",
            "try/except for errors",
            "Bonus: update contact feature",
        ],
    },
    {
        "title": "Week 10 — Capstone",
        "days": {
            "Monday": [
                "Morning: Design 3-table database schema",
                "Day: Plan on paper",
                "Evening: Create tables in SQLite",
            ],
            "Tuesday": [
                "Morning: Add student + record score functions",
                "Day: Code",
                "Evening: View student report",
            ],
            "Wednesday": [
                "Morning: Class statistics functions",
                "Day: Code",
                "Evening: Export to CSV feature",
            ],
            "Thursday": [
                "Morning: Input validation + error handling",
                "Day: Test all features",
                "Evening: Write README.md",
            ],
            "Friday": [
                "Morning: Load sample data, full test run",
                "Day: Fix bugs",
                "Evening: Prepare presentation",
            ],
            "Saturday": [
                "Morning: Final polish",
                "Day: Practice demo",
                "Evening: SUBMIT capstone + reflection",
            ],
            "Sunday": [
                "Capstone presentation with mentor",
                "Celebrate!",
                "Discuss what to learn next",
            ],
        },
        "assignment": [
            "students, subjects, scores tables with foreign keys",
            "6 menu options all working",
            "6+ Python functions",
            "Input validation throughout",
            "README with run instructions",
            "15-min live demo prepared",
        ],
    },
]

from assignments_detail import ASSIGNMENTS

# Keep week checklists in sync with assignment requirements
for i, assignment in enumerate(ASSIGNMENTS):
    WEEKS[i]["assignment"] = assignment["requirements"]
