from flask import Flask, render_template, request, redirect, url_for, session
import pandas as pd
import os
import random

app = Flask(__name__)
app.secret_key = "adaptive_secret_key"

# ----------------------------
# INITIAL FILE SETUP
# ----------------------------

if not os.path.exists("users.xlsx"):
    df = pd.DataFrame(columns=["Email", "UserID"])
    df.to_excel("users.xlsx", index=False)

if not os.path.exists("results"):
    os.makedirs("results")


# ----------------------------
# HELPER FUNCTIONS
# ----------------------------

def save_user(email, userid):
    df = pd.read_excel("users.xlsx")
    if userid not in df["UserID"].values:
        new_user = pd.DataFrame([[email, userid]], columns=["Email", "UserID"])
        df = pd.concat([df, new_user])
        df.to_excel("users.xlsx", index=False)


def adjust_difficulty(current_level, is_correct):
    if is_correct:
        return min(current_level + 1, 3)
    else:
        return max(current_level - 1, 1)


def load_questions():
    return pd.read_excel("question_bank.xlsx")


def generate_summary(section_scores):
    strengths = []
    weaknesses = []

    for section, score in section_scores.items():
        if score >= 70:
            strengths.append(section)
        else:
            weaknesses.append(section)

    return strengths, weaknesses


# ----------------------------
# ROUTES
# ----------------------------

@app.route("/")
def login_page():
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    userid = request.form["userid"]

    save_user(email, userid)

    session["userid"] = userid
    session["email"] = email
    session["current_section"] = "Aptitude"
    session["difficulty"] = 1

    session["score"] = {
        "Aptitude": {"correct": 0, "wrong": 0},
        "Logical Reasoning": {"correct": 0, "wrong": 0},
        "Verbal": {"correct": 0, "wrong": 0},
        "Coding": {"correct": 0, "wrong": 0},
    }

    session["question_count"] = 0
    session["max_questions"] = 12  # 3 per section

    return redirect(url_for("home"))


@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/assessment")
def assessment():
    if "userid" not in session:
        return redirect(url_for("login_page"))

    questions = load_questions()

    current_section = session["current_section"]
    difficulty = session["difficulty"]

    filtered = questions[
        (questions["Section"] == current_section) &
        (questions["Difficulty"] == difficulty)
    ]

    if filtered.empty:
        filtered = questions[questions["Section"] == current_section]

    question = filtered.sample().iloc[0]

    session["current_answer"] = question["Answer"]
    session["current_question"] = question["Question"]
    session["options"] = [
        question["OptionA"],
        question["OptionB"],
        question["OptionC"],
        question["OptionD"]
    ]

    return render_template(
        "assessment.html",
        question=question["Question"],
        options=session["options"],
        section=current_section,
        difficulty=difficulty
    )


@app.route("/submit", methods=["POST"])
def submit():
    selected = request.form["option"]
    correct_answer = session["current_answer"]

    current_section = session["current_section"]
    difficulty = session["difficulty"]

    is_correct = (selected == correct_answer)

    if is_correct:
        session["score"][current_section]["correct"] += 1
    else:
        session["score"][current_section]["wrong"] += 1

    session["difficulty"] = adjust_difficulty(difficulty, is_correct)
    session["question_count"] += 1

    # Change section every 3 questions
    if session["question_count"] % 3 == 0:
        sections = list(session["score"].keys())
        current_index = sections.index(current_section)
        if current_index + 1 < len(sections):
            session["current_section"] = sections[current_index + 1]
            session["difficulty"] = 1
        else:
            return redirect(url_for("result"))

    return redirect(url_for("assessment"))


@app.route("/result")
def result():
    userid = session["userid"]
    scores = session["score"]

    result_data = []
    section_percentages = {}
    total_correct = 0
    total_questions = 0

    for section, data in scores.items():
        correct = data["correct"]
        wrong = data["wrong"]
        total = correct + wrong
        percentage = (correct / total * 100) if total > 0 else 0

        section_percentages[section] = round(percentage, 2)

        total_correct += correct
        total_questions += total

        result_data.append({
            "Section": section,
            "Correct": correct,
            "Wrong": wrong,
            "Percentage": round(percentage, 2)
        })

    overall_percentage = round((total_correct / total_questions) * 100, 2)

    strengths, weaknesses = generate_summary(section_percentages)

    df = pd.DataFrame(result_data)
    df.loc[len(df.index)] = [
        "Overall",
        total_correct,
        total_questions - total_correct,
        overall_percentage
    ]

    df.to_excel(f"results/results_{userid}.xlsx", index=False)

    return render_template(
    "result.html",
    overall=overall_percentage,
    section_data=section_percentages,
    strengths=strengths,
    weaknesses=weaknesses
)


@app.route("/admin")
def admin():
    df = pd.read_excel("users.xlsx")
    users = df.to_dict(orient="records")

    result_files = os.listdir("results")

    return render_template(
        "admin.html",
        users=users,
        result_files=result_files
    )


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login_page"))


# ----------------------------
# MAIN
# ----------------------------

if __name__ == "__main__":
    app.run(debug=True)