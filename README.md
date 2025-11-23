Interview Practice Partner AI Agent
Overview
A conversational AI system that simulates real interview scenarios to help users improve their interview skills through adaptive questioning and feedback.

Features
Role-based mock interviews
Intelligent follow-up generation
Real-time feedback system
Voice interaction support
Multiple user persona handling

Technology Stack
Frontend: React
Backend: Python Flask
Voice: Web Speech API
Logic: Rule-based interview engine

Architecture
User → React UI → Flask API → Interview Logic Engine → Feedback Generator

Design Decisions
Focus on conversational quality over automation
Rule-based logic for explainability
Modular separation of UI and logic
Lightweight architecture for fast performance

How to Run
Start backend:
cd backend
pip install -r requirements.txt
python app.py


Start frontend:
cd frontend
npm install
npm start
