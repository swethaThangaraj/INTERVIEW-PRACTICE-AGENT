import React, { useState, useRef, useEffect } from 'react';
import Message from './components/Message';

const userId = "user_" + Math.random().toString(36).slice(2,9);

function useSpeechRecognition(onResult) {
  // wrapper for browser SpeechRecognition
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    recognitionRef.current = rec;
  }, [onResult]);

  const start = () => {
    if (recognitionRef.current) recognitionRef.current.start();
    else alert('SpeechRecognition API not supported in this browser.');
  };
  const stop = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };
  return { start, stop, available: !!recognitionRef.current };
}

export default function App() {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState('software engineer');
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [step, setStep] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const chatRef = useRef();

  useEffect(() => {
    fetch('/api/roles')
      .then(r => r.json())
      .then(d => {
        setRoles(d.roles || []);
        if (d.roles && d.roles.length > 0) setRole(d.roles[0]);
      })
      .catch(()=> {});
  }, []);

  useEffect(() => {
    // scroll chat
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // text-to-speech
  function speak(text) {
    if (!window.speechSynthesis) return;
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(ut);
  }

  const onSpeechResult = (text) => {
    setAnswer(text);
  };
  const { start: startRec, available: voiceAvailable } = useSpeechRecognition(onSpeechResult);

  function addMessage(who, text) {
    setMessages(prev => [...prev, { who, text }]);
  }

  async function startInterview() {
    try {
      const res = await fetch('/api/start', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user_id: userId, role })
      });
      const data = await res.json();
      addMessage('bot', data.question || 'No question received.');
      setStep(data.step || 0);
      setInterviewStarted(true);
      speak(data.question || 'Interview started.');
    } catch (e) {
      alert('Error starting interview: ' + e.message);
    }
  }

  async function sendReply() {
    if (!answer || answer.trim()==='') {
      alert('Please enter or speak your answer.');
      return;
    }
    const myAnswer = answer;
    addMessage('user', myAnswer);
    setAnswer('');
    try {
      const res = await fetch('/api/reply', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({user_id: userId, answer: myAnswer})
      });
      const data = await res.json();
      if (data.follow_up) {
        addMessage('bot', data.follow_up);
        speak(data.follow_up);
      } else if (data.next_question) {
        addMessage('bot', data.next_question);
        speak(data.next_question);
        setStep(data.step || step+1);
      } else if (data.message) {
        addMessage('bot', data.message);
        speak(data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Error sending reply: ' + e.message);
    }
  }

  async function requestFeedback() {
    try {
      const res = await fetch('/api/feedback', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({user_id: userId})
      });
      const data = await res.json();
      const fb = data.feedback;
      if (fb) {
        addMessage('bot', `Feedback: Level=${fb.level}, Score Estimate=${fb.percent_estimate}%`);
        speak(`Overall feedback: ${fb.level}. Estimated score ${fb.percent_estimate} percent.`);
        // add detailed
        fb.items.forEach(it => {
          addMessage('bot', `${it.question} -> ${it.note}`);
        });
      }
    } catch (e) {
      alert('Error fetching feedback: ' + e.message);
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h2>Interview Practice Partner</h2>
        <div className="small">User: <strong>{userId}</strong></div>
      </div>

      <div style={{marginTop:8}}>
        <label>Role: </label>
        <select className="role-select" value={role} onChange={e=>setRole(e.target.value)}>
          {roles.map(r=> <option key={r}>{r}</option>)}
        </select>
        <button className="button" onClick={startInterview}>Start Interview</button>
        <button className="button secondary" onClick={() => {
          setMessages([]); setInterviewStarted(false); setStep(0);
          // new user id?
        }}>Reset</button>
      </div>

      <div ref={chatRef} className="chat-window">
        {messages.map((m,i) => <Message key={i} who={m.who === 'user' ? 'user' : 'bot'} text={m.text} />)}
      </div>

      <div className="toolbar">
        <input style={{flex:1, padding:8}} placeholder="Type your answer or use mic" value={answer}
               onChange={e=>setAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendReply(); }}/>
        <button className="button" onClick={sendReply}>Send</button>
        <button className="button secondary" onClick={() => {
          if (voiceAvailable) startRec();
          else alert('Voice recognition not supported in this browser.');
        }}>Use Mic</button>
        <button className="button" onClick={requestFeedback}>Get Feedback</button>
      </div>

      <div className="footer">
        <p className="small">Voice Input: browser Web Speech API. Text-to-Speech: browser speechSynthesis.</p>
        <p className="small">Test personas: Confused (answer "I don't know"), Efficient (very short answers), Chatty (long off-topic answers), Edge-case (empty / invalid answers).</p>
      </div>
    </div>
  );
}
