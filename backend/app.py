# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from interview_logic import get_next_question, generate_follow_up, generate_feedback, get_roles

app = Flask(__name__)
CORS(app)

# Simple in-memory sessions: {user_id: {role, step, conversation:list[(q,a)]}}
sessions = {}

@app.route('/api/roles', methods=['GET'])
def roles():
    return jsonify({"roles": get_roles()})

@app.route('/api/start', methods=['POST'])
def start():
    data = request.json or {}
    user_id = data.get('user_id', 'default_user')
    role = data.get('role', 'software engineer')

    sessions[user_id] = {
        "role": role,
        "step": 0,
        "conversation": []
    }
    q = get_next_question(role, 0)
    return jsonify({"question": q, "step": 0})

@app.route('/api/reply', methods=['POST'])
def reply():
    data = request.json or {}
    user_id = data.get('user_id', 'default_user')
    answer = data.get('answer', '')
    if user_id not in sessions:
        return jsonify({"error": "session not found. Call /api/start first."}), 400

    session = sessions[user_id]
    role = session['role']
    step = session['step']
    question = get_next_question(role, step)
    # store the Q/A
    session['conversation'].append([question, answer])

    # check for follow-up
    follow_up = generate_follow_up(answer)
    if follow_up:
        return jsonify({"follow_up": follow_up, "step": step})

    # otherwise move to next question
    session['step'] = step + 1
    next_q = get_next_question(role, session['step'])
    if next_q is None:
        return jsonify({"next_question": None, "step": session['step'], "message": "Interview complete. Request feedback with /api/feedback"})
    return jsonify({"next_question": next_q, "step": session['step']})

@app.route('/api/feedback', methods=['POST'])
def feedback():
    data = request.json or {}
    user_id = data.get('user_id', 'default_user')
    if user_id not in sessions:
        return jsonify({"error": "session not found"}), 400
    conv = sessions[user_id]['conversation']
    fb = generate_feedback(conv)
    return jsonify({"feedback": fb})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
