# interview_logic.py
# core rule-based interview + follow-up + feedback generator

INTERVIEW_QUESTIONS = {
    "software engineer": [
        "Tell me briefly about yourself and why you applied for this Software Engineer role.",
        "Explain the difference between a process and a thread.",
        "What is a REST API and when would you use it?",
        "Describe a technical problem you solved and how you approached it."
    ],
    "sales associate": [
        "Tell me about your background and why you want this sales role.",
        "How would you handle a hesitant customer?",
        "Describe a time you exceeded a sales target.",
        "How do you handle rejection?"
    ],
    "retail associate": [
        "Tell me about your background and why you applied for retail.",
        "How do you handle difficult customers?",
        "Describe a time you worked under pressure.",
        "Why do you want to work in retail?"
    ]
}

def get_roles():
    return list(INTERVIEW_QUESTIONS.keys())

def get_next_question(role, step):
    role = role.lower()
    questions = INTERVIEW_QUESTIONS.get(role, [])
    if step < len(questions):
        return questions[step]
    return None

def generate_follow_up(answer):
    if not answer or answer.strip() == "":
        return "I didn't quite catch that — can you try answering again with a bit more detail?"
    a = answer.lower()
    if len(a) < 25:
        return "Could you expand on that a bit more — maybe give an example?"
    if "team" in a:
        return "Nice — what was your specific contribution in the team?"
    if "problem" in a or "issue" in a or "bug" in a:
        return "How did you identify the root cause and which tools or methods did you use?"
    # return None if no follow up required
    return None

def score_answer(answer):
    score = 0
    a = (answer or "").strip().lower()
    if len(a) > 40:
        score += 2
    elif len(a) > 15:
        score += 1
    if any(k in a for k in ["team", "i", "we", "led", "implemented", "improved", "reduced", "designed"]):
        score += 1
    return score

def generate_feedback(conversation):
    """
    conversation: list of (question, answer) tuples
    """
    total_score = 0
    feedback_items = []
    for q, a in conversation:
        sc = score_answer(a)
        total_score += sc
        if sc < 2:
            feedback_items.append({
                "question": q,
                "note": "Provide more detail and examples. Keep structure: Situation -> Task -> Action -> Result (STAR)."
            })
        else:
            feedback_items.append({"question": q, "note": "Good answer — include specific metrics if possible."})

    # Normalize overall rating
    max_possible = len(conversation) * 3  # approximate
    percent = int((total_score / max_possible) * 100) if max_possible > 0 else 0
    if percent >= 75:
        level = "Excellent"
    elif percent >= 45:
        level = "Good"
    else:
        level = "Needs Improvement"

    return {
        "overall_score": total_score,
        "percent_estimate": percent,
        "level": level,
        "items": feedback_items
    }
