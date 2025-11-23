#  Interview Practice Agent

A conversational AI-powered interview simulation tool designed to help users practice real-world interview scenarios through dynamic dialogue, adaptive follow-ups, and structured feedback.

This project was built specifically to demonstrate strong **conversational quality, agentic behaviour, intelligence, and adaptability**, as required in the assignment evaluation criteria.

---

##  Overview

The Interview Practice Agent simulates realistic HR interviews for multiple roles such as:

* Software Engineer
* Sales Associate
* Retail Associate

The system behaves like a real interviewer:

* Asks structured questions
* Adapts based on user responses
* Requests clarification when answers lack depth
* Provides detailed feedback using the STAR method framework

It also supports different user personas for evaluation:

* Confused User
* Efficient User
* Chatty User
* Edge Case User

---

## System Architecture

```
Frontend (React)  --->  Backend API (Flask)  --->  Interview Logic Engine
        |                     |
        |                     └── Session Memory
        |
        └── Voice Input / Output (Web Speech API)
```

### 1. Frontend (React)

Responsible for:

* Chat interface
* Voice-to-text input
* Displaying conversation flow
* Initiating interview sessions
* Sending answers and receiving responses

Key Features:

* Real-time chatbot UI
* Role selection
* Microphone integration
* Feedback rendering

Files:

* `frontend/src/App.js` – Main interface logic
* `Message.js` – Chat message component
* `Chat.css` – Styling

---

### 2. Backend (Flask)

Handles:

* Session management
* Interview progression
* Follow-up logic
* Feedback generation

API Endpoints:

| Endpoint      | Method | Description                       |
| ------------- | ------ | --------------------------------- |
| /api/roles    | GET    | Returns available interview roles |
| /api/start    | POST   | Starts a new interview session    |
| /api/reply    | POST   | Processes candidate answer        |
| /api/feedback | POST   | Returns structured feedback       |

Files:

* `app.py` – API routes + session logic
* `interview_logic.py` – Core AI rule engine

---

##  Intelligence Design

### Adaptive Question Flow

Questions are served sequentially based on role and stage:

```python
get_next_question(role, step)
```

### Follow-Up Logic

Triggered when answers are:

* Too short
* Vague
* Empty

Sample logic:

```python
if len(answer) < 25:
   return "Could you expand on that with an example?"
```

### Feedback Engine

Scores answers based on:

* Length
* Keywords
* Clarity

Feedback method: STAR (Situation, Task, Action, Result)

Returns:

* Score
* Level (Excellent / Good / Needs Improvement)
* Question-wise improvement notes

---

## Design Decisions

### Why Flask?

* Lightweight & fast
* Simple REST API handling
* Suitable for session-based interaction

### Why React?

* Modern UI framework
* State management for conversational UI
* Easy voice + text integration

### Why Rule-Based AI?

* Predictable evaluation
* Clear control over logic
* Consistent scoring for demonstration

### Voice Integration

Used browser Web Speech API for:

* Speech-to-text input
* Text-to-speech responses

This enhances realism and interview experience.

---

##  Demo Personas Implemented

### Confused User

Answers like:
"I don’t know" or "Not sure"

Agent Response:

* Requests clarification
* Encourages detailed answers

### Efficient User

Short responses

Agent Response:

* Follow-up prompts for expansion

### Chatty User

Long off-topic answers

Agent Response:

* Redirects to structured response

### Edge Case User

Empty / Invalid input

Agent Response:

* Gracefully handles and retries

---

## ⚙️ Setup Instructions

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Server runs on:

```
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

Ensure proxy is correctly set in package.json:

```json
"proxy": "http://localhost:5000"
```

---

## 🎥 Demo Video Guidelines Followed

✔ Pure product demonstration
✔ No code walkthrough
✔ Voice interaction showcased
✔ Multiple personas tested
✔ Real interview flow

---

##  Folder Structure

```
interview-practice-agent/
├── backend/
│   ├── app.py
│   ├── interview_logic.py
│   ├── requirements.txt
│   └── sample_sessions.json
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── components/
├── README.md
└── demo_script.md
```

---

## Evaluation Alignment

| Criteria                 | How it's addressed                       |
| ------------------------ | ---------------------------------------- |
| Conversational Quality   | Human-like flow & adaptive follow-ups    |
| Agentic Behaviour        | Dynamic session logic                    |
| Technical Implementation | Clean frontend-backend separation        |
| Intelligence             | Feedback scoring & role-based interviews |
| Adaptability             | Persona handling & input variation       |

---

##  Conclusion

This project delivers an intelligent, interactive interview practice experience that adapts in real-time to simulate realistic interviews. By focusing on conversation quality, clarity, and structured evaluation, it provides users with meaningful performance feedback and improvement insights.

Designed to meet all specified assignment requirements and optimized for evaluators' expectations.

---

 Author: Swetha T
 Submission Type: AI Agent Demo
