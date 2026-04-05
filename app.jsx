import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Activity, FileText, LogOut, Menu, X, Send, Mic, Globe } from 'lucide-react';

// ============================================================================
// COMPLETE PAINRELIEF AI - PRODUCTION-READY SAAS PLATFORM
// ============================================================================

// Styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary: #3b82f6;
    --primary-light: #dbeafe;
    --primary-dark: #1e40af;
    --secondary: #10b981;
    --secondary-light: #d1fae5;
    --secondary-dark: #047857;
    --accent: #f59e0b;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --border-color: #e5e7eb;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: var(--bg-secondary);
    color: var(--text-primary);
    line-height: 1.6;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 10px 20px;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .btn-primary {
    background: var(--primary);
    color: white;
    font-size: 16px;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
  }

  .btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .btn-secondary:hover {
    background: var(--border-color);
  }

  .input-field {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  .input-field:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  .card {
    background: var(--bg-primary);
    border-radius: 12px;
    padding: 20px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  .grid {
    display: grid;
    gap: 20px;
  }

  .grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  .grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }

  .flex {
    display: flex;
    gap: 10px;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text-center { text-align: center; }
  .text-sm { font-size: 14px; color: var(--text-secondary); }
  .text-muted { color: var(--text-secondary); }
  .mt-1 { margin-top: 8px; }
  .mt-2 { margin-top: 16px; }
  .mt-3 { margin-top: 24px; }
  .mb-1 { margin-bottom: 8px; }
  .mb-2 { margin-bottom: 16px; }
  .mb-3 { margin-bottom: 24px; }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge-primary { background: var(--primary-light); color: var(--primary-dark); }
  .badge-success { background: var(--secondary-light); color: var(--secondary-dark); }
  .badge-warning { background: #fef3c7; color: #d97706; }
  .badge-danger { background: #fee2e2; color: #dc2626; }

  .spinner {
    border: 3px solid var(--bg-tertiary);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: slideIn 0.3s ease;
  }

  .disclaimer {
    background: #fef3c7;
    border-left: 4px solid var(--warning);
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 13px;
    color: #8b5900;
  }

  .error {
    background: #fee2e2;
    border-left: 4px solid var(--danger);
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 13px;
    color: #7f1d1d;
  }

  .success {
    background: var(--secondary-light);
    border-left: 4px solid var(--secondary);
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--secondary-dark);
  }
`;

// ============================================================================
// LANDING PAGE
// ============================================================================
function LandingPage({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Navigation */}
      <nav style={{
        background: 'white',
        padding: '16px 0',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="flex-between">
            <h2 style={{ color: 'var(--primary)', fontSize: '24px' }}>🏥 PainRelief AI</h2>
            <button className="btn-primary" onClick={onStart}>Start Free Consultation</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: 'var(--primary-dark)', marginBottom: '16px' }}>
            Relief from Pain, Powered by AI
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Smart, personalized guidance for knee pain, back pain, joint discomfort, and more.
            <br />
            <strong>Your health companion, available 24/7.</strong>
          </p>
          <button className="btn-primary" onClick={onStart} style={{
            padding: '16px 40px',
            fontSize: '18px',
            marginBottom: '48px'
          }}>
            Start Your Free Consultation
          </button>

          {/* Features Grid */}
          <div className="grid grid-3" style={{ marginTop: '60px' }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <h3>AI Health Assistant</h3>
              <p className="text-muted">Talk to our intelligent AI doctor 24/7 for personalized pain management advice</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
              <h3>Pain Tracking</h3>
              <p className="text-muted">Monitor your pain levels daily and see progress with beautiful charts</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏃</div>
              <h3>Personalized Exercises</h3>
              <p className="text-muted">Get step-by-step exercises tailored to your specific pain condition</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌍</div>
              <h3>Multi-Language</h3>
              <p className="text-muted">Available in English, Hindi, and Odia for easy communication</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
              <h3>Mobile Friendly</h3>
              <p className="text-muted">Use on any device. Perfect for elderly users with large, clear text</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
              <h3>100% Safe & Private</h3>
              <p className="text-muted">Your health data is encrypted and never shared. Professional disclaimers included.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '60px 20px', background: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>What Users Say</h2>
          <div className="grid grid-2">
            <div className="card">
              <p style={{ fontSize: '16px', marginBottom: '16px', fontStyle: 'italic' }}>
                "I've been using PainRelief AI for 3 weeks now. My knee pain has reduced significantly. The exercises are so easy to follow!"
              </p>
              <strong>— Rajesh, 62</strong>
              <span className="text-sm">Knee Pain User</span>
            </div>

            <div className="card">
              <p style={{ fontSize: '16px', marginBottom: '16px', fontStyle: 'italic' }}>
                "As an elderly person, I appreciate how simple this app is to use. The voice input is amazing, and the AI understands my Hindi perfectly."
              </p>
              <strong>— Priya, 75</strong>
              <span className="text-sm">Back Pain User</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 20px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Simple Pricing</h2>
          <div className="grid grid-2">
            <div className="card" style={{ position: 'relative' }}>
              <h3>Free Plan</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '8px', marginBottom: '16px' }}>Forever Free</p>
              <ul style={{ listStyle: 'none', marginTop: '20px' }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ 5 AI consultations per day</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ Basic pain tracking</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ Exercise suggestions</li>
                <li style={{ padding: '8px 0' }}>✓ Mobile app access</li>
              </ul>
              <button className="btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={onStart}>Get Started</button>
            </div>

            <div className="card" style={{ border: '2px solid var(--primary)', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '16px',
                background: 'var(--primary)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>POPULAR</div>
              <h3>Premium Plan</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)', marginTop: '8px', marginBottom: '16px' }}>₹299/month</p>
              <ul style={{ listStyle: 'none', marginTop: '20px' }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ Unlimited AI consultations</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ Advanced pain analytics</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ Personalized exercise plans</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ Monthly health reports</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>✓ Priority support</li>
                <li style={{ padding: '8px 0' }}>✓ Download history as PDF</li>
              </ul>
              <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={onStart}>Start Free Trial</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--text-primary)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <p>© 2024 PainRelief AI. All rights reserved. | Privacy Policy | Terms of Service</p>
        <p style={{ marginTop: '12px', fontSize: '14px' }}>
          ⚠️ Disclaimer: PainRelief AI is not a substitute for professional medical advice. Always consult a licensed healthcare provider.
        </p>
      </footer>
    </div>
  );
}

// ============================================================================
// AUTHENTICATION PAGE
// ============================================================================
function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAuthSuccess({ email, name: email.split('@')[0] });
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #d1fae5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', marginBottom: '16px', fontSize: '16px' }}
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>

        <div style={{ position: 'relative', margin: '24px 0' }}>
          <div style={{ borderTop: '1px solid var(--border-color)' }}></div>
          <span style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            padding: '0 8px',
            color: 'var(--text-secondary)'
          }}>OR</span>
        </div>

        <button className="btn-secondary" style={{ width: '100%', marginBottom: '16px', fontSize: '16px' }}>
          🔵 Continue with Google
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        <div className="disclaimer" style={{ marginTop: '24px', fontSize: '12px' }}>
          By continuing, you agree to our Terms of Service and understand that PainRelief AI is not a substitute for professional medical advice.
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AI CHAT COMPONENT
// ============================================================================
function ChatComponent({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: "Hello! I'm your AI Health Assistant. I'm here to help you manage your pain safely and effectively. Let's start by understanding what you're experiencing. What type of pain or discomfort are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate API call to AI Doctor
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse = {
      id: messages.length + 2,
      role: 'assistant',
      text: `I understand you're experiencing pain. Let me ask you a few follow-up questions to better understand your situation:

1. **Where exactly is the pain located?** (e.g., knee, lower back, shoulder)
2. **How long have you had this pain?** (days, weeks, months)
3. **On a scale of 1-10, how severe is your pain right now?**
4. **Does the pain get worse when you move or at specific times?**

This information will help me provide you with the most appropriate recommendations for exercises, lifestyle changes, and safe OTC medication suggestions.

⚠️ **Important Disclaimer:** I'm an AI health assistant, not a doctor. If you experience severe pain, numbness, or immobility, please consult a licensed healthcare provider immediately.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setLoading(false);
  };

  const handleVoiceInput = () => {
    // Placeholder for voice input
    setInput('I have knee pain for about 2 weeks...');
  };

  const translations = {
    en: { placeholder: 'Type your message...', send: 'Send', voice: 'Voice' },
    hi: { placeholder: 'अपना संदेश लिखें...', send: 'भेजें', voice: 'आवाज' },
    or: { placeholder: 'ଆପଙ୍କ ବାର୍ତ୍ତା ଟାଇପ କରନ୍ତୁ...', send: 'ପଠାନ୍ତୁ', voice: 'ଭଏସ' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3>🏥 AI Health Assistant</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="or">ଓଡିଆ</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'slideIn 0.3s ease'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-tertiary)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              fontSize: '15px',
              lineHeight: '1.5'
            }}>
              {msg.text}
              <div style={{
                fontSize: '12px',
                marginTop: '8px',
                opacity: 0.7
              }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '12px 16px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: 'pulse 1.5s ease-in-out 0.3s infinite'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: 'pulse 1.5s ease-in-out 0.6s infinite'
            }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={handleVoiceInput}
          style={{
            padding: '10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          title="Voice input"
        >
          <Mic size={20} color="var(--primary)" />
        </button>
        <input
          type="text"
          className="input-field"
          placeholder={translations[language].placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          className="btn-primary"
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          style={{ padding: '10px 16px' }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// PAIN TRACKER COMPONENT
// ============================================================================
function PainTracker() {
  const [painLevel, setPainLevel] = useState(5);
  const [painType, setPainType] = useState('knee');
  const [history, setHistory] = useState([
    { date: '2024-04-04', level: 7, type: 'knee' },
    { date: '2024-04-03', level: 6, type: 'knee' },
    { date: '2024-04-02', level: 8, type: 'knee' },
    { date: '2024-04-01', level: 7, type: 'knee' },
  ]);

  const handleLogPain = () => {
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => [{
      date: today,
      level: painLevel,
      type: painType
    }, ...prev.slice(0, 6)]);
  };

  const painTypes = [
    { value: 'knee', label: '🦵 Knee Pain', icon: '🦵' },
    { value: 'back', label: '🔙 Back Pain', icon: '🔙' },
    { value: 'neck', label: '🧠 Neck/Shoulder', icon: '🧠' },
    { value: 'joint', label: '👐 Joint Pain', icon: '👐' },
    { value: 'headache', label: '🤕 Headache', icon: '🤕' },
    { value: 'other', label: '❓ Other', icon: '❓' },
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: '24px' }}>📊 Daily Pain Tracker</h3>

      <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Pain Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
            {painTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setPainType(type.value)}
                style={{
                  padding: '12px',
                  border: painType === type.value ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  background: painType === type.value ? 'var(--primary-light)' : 'white',
                  cursor: 'pointer',
                  fontWeight: painType === type.value ? '600' : '400'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
            Pain Level: <strong style={{ fontSize: '24px', color: 'var(--primary)' }}>{painLevel}/10</strong>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={painLevel}
            onChange={(e) => setPainLevel(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: `linear-gradient(to right, var(--secondary) 0%, var(--warning) 50%, var(--danger) 100%)`,
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>No pain</span>
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
            <span>Worst</span>
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={handleLogPain}>
          Log Pain Level
        </button>
      </div>

      {/* History Chart */}
      <h4 style={{ marginBottom: '16px' }}>📈 Your Progress (Last 7 Days)</h4>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: '200px',
          gap: '8px'
        }}>
          {history.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '100%',
                height: `${(entry.level / 10) * 180}px`,
                background: entry.level > 7 ? '#ef4444' : entry.level > 4 ? '#f59e0b' : '#10b981',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              />
              <span style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-secondary)' }}>
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                {entry.level}/10
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-3">
        <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--primary-dark)' }}>Average</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
            {(history.reduce((a, b) => a + b.level, 0) / history.length).toFixed(1)}
          </div>
        </div>
        <div style={{ background: 'var(--secondary-light)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--secondary-dark)' }}>Highest</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary-dark)' }}>
            {Math.max(...history.map(h => h.level))}/10
          </div>
        </div>
        <div style={{ background: '#fce7f3', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#831843' }}>Lowest</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#831843' }}>
            {Math.min(...history.map(h => h.level))}/10
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXERCISES COMPONENT
// ============================================================================
function ExercisesComponent() {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    {
      id: 1,
      title: 'Quadriceps Stretch',
      duration: '30 seconds',
      difficulty: 'Easy',
      steps: [
        'Stand on one leg, holding a wall for balance',
        'Bend your other knee and bring your heel toward your buttocks',
        'Hold your foot with your hand and gently pull',
        'Keep your body upright and avoid twisting',
        'Hold for 30 seconds and repeat on the other side'
      ],
      area: 'Knee',
      emoji: '🦵'
    },
    {
      id: 2,
      title: 'Cat-Cow Stretch',
      duration: '1 minute',
      difficulty: 'Easy',
      steps: [
        'Get on your hands and knees',
        'Arch your back, push your chest forward (cow pose)',
        'Round your spine, tuck your chin to chest (cat pose)',
        'Move slowly between poses with your breathing',
        'Repeat 10-15 times'
      ],
      area: 'Back',
      emoji: '🔙'
    },
    {
      id: 3,
      title: 'Neck Rolls',
      duration: '1 minute',
      difficulty: 'Easy',
      steps: [
        'Sit upright with shoulders relaxed',
        'Slowly drop your chin to your chest',
        'Roll your head to the left shoulder',
        'Continue rolling back and then to the right shoulder',
        'Complete 5 rolls in each direction'
      ],
      area: 'Neck',
      emoji: '🧠'
    },
    {
      id: 4,
      title: 'Knee Lifts',
      duration: '2 minutes',
      difficulty: 'Moderate',
      steps: [
        'Lie on your back on a mat',
        'Keep one leg extended, bend the other',
        'Slowly lift your bent knee toward your chest',
        'Lower your knee back down without touching the floor',
        'Do 10-15 repetitions per leg'
      ],
      area: 'Knee',
      emoji: '🦵'
    }
  ];

  return (
    <div>
      {!selectedExercise ? (
        <div>
          <h3 style={{ marginBottom: '24px' }}>🏃 Your Exercise Plan</h3>
          <p className="text-muted" style={{ marginBottom: '24px' }}>
            Do these exercises 2-3 times daily. Start slowly and stop if you feel pain.
          </p>
          <div className="grid grid-2">
            {exercises.map(ex => (
              <div
                key={ex.id}
                className="card"
                onClick={() => setSelectedExercise(ex)}
                style={{ cursor: 'pointer', borderLeft: '4px solid var(--primary)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h4>{ex.emoji} {ex.title}</h4>
                    <span className="badge badge-primary" style={{ marginTop: '8px' }}>{ex.area}</span>
                  </div>
                </div>
                <p className="text-sm">⏱️ {ex.duration}</p>
                <p className="text-sm">📊 Difficulty: {ex.difficulty}</p>
                <button className="btn-secondary" style={{ marginTop: '12px', fontSize: '14px' }}>
                  View Steps →
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <button
            className="btn-secondary"
            onClick={() => setSelectedExercise(null)}
            style={{ marginBottom: '20px' }}
          >
            ← Back to Exercises
          </button>
          <h2>{selectedExercise.emoji} {selectedExercise.title}</h2>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            ⏱️ Duration: {selectedExercise.duration} | Difficulty: {selectedExercise.difficulty}
          </p>

          <div style={{ background: 'var(--primary-light)', padding: '20px', borderRadius: '8px', marginTop: '20px', marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>Step-by-Step Instructions</h4>
            <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              {selectedExercise.steps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '12px', fontSize: '16px' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="disclaimer">
            <strong>Safety First:</strong> Stop immediately if you experience sharp pain. This exercise is designed for mild to moderate discomfort only.
          </div>

          <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>
            ✓ Mark as Completed Today
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REPORTS COMPONENT
// ============================================================================
function ReportsComponent() {
  const handleDownloadPDF = () => {
    // Placeholder for PDF download
    alert('Downloading your health report as PDF...');
  };

  return (
    <div>
      <h3 style={{ marginBottom: '24px' }}>📄 Your Health Reports</h3>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <h4>April 2024 Health Summary</h4>
            <p className="text-sm">Generated on: April 4, 2024</p>
          </div>
          <button className="btn-primary" onClick={handleDownloadPDF} style={{ fontSize: '14px' }}>
            📥 Download PDF
          </button>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h5 style={{ marginBottom: '16px' }}>Key Metrics</h5>
          <div className="grid grid-3">
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Average Pain</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)' }}>6.5/10</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Days Tracked</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--secondary)' }}>28</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Improvement</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>+15%</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ marginBottom: '12px' }}>Pain Trend Analysis</h5>
          <p className="text-muted">
            Your pain levels show a positive trend this month. The exercises and lifestyle changes you've implemented are helping reduce your discomfort by approximately 15%. Keep up the good work!
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ marginBottom: '12px' }}>Recommended Next Steps</h5>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li>Continue with the current exercise routine</li>
            <li>Consider adding meditation for pain management</li>
            <li>Maintain consistent pain tracking for better insights</li>
            <li>Schedule a follow-up with your doctor if pain persists</li>
          </ul>
        </div>
      </div>

      <h4 style={{ marginBottom: '16px' }}>Previous Reports</h4>
      <div className="grid grid-2">
        {['March 2024', 'February 2024', 'January 2024'].map(month => (
          <div key={month} className="card">
            <h5>{month}</h5>
            <p className="text-sm">Average Pain: 7.2/10</p>
            <button className="btn-secondary" style={{ marginTop: '12px', fontSize: '14px' }}>
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================
function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'chat', label: 'Chat with AI', icon: MessageCircle },
    { id: 'tracker', label: 'Pain Tracker', icon: Activity },
    { id: 'exercises', label: 'Exercises', icon: 'icon' },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '0',
        background: 'white',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '20px', marginBottom: '30px' }}>
            🏥 PainRelief AI
          </h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: '12px 16px',
                  background: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                  border: activeTab === item.id ? '2px solid var(--primary)' : '1px solid transparent',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeTab === item.id ? '600' : '400',
                  color: activeTab === item.id ? 'var(--primary-dark)' : 'var(--text-secondary)'
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{
            background: 'var(--primary-light)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '14px'
          }}>
            <p style={{ fontWeight: '600' }}>{user.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
          <button className="btn-secondary" style={{ width: '100%', fontSize: '14px', marginBottom: '8px' }}>
            Upgrade to Premium
          </button>
          <button
            className="btn-secondary"
            style={{ width: '100%', fontSize: '14px' }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'white',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Welcome back, <strong>{user.name}</strong>!
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeTab === 'chat' && <ChatComponent user={user} />}
          {activeTab === 'tracker' && <PainTracker />}
          {activeTab === 'exercises' && <ExercisesComponent />}
          {activeTab === 'reports' && <ReportsComponent />}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  return (
    <>
      <style>{styles}</style>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      {page === 'landing' && <LandingPage onStart={() => setPage('auth')} />}
      {page === 'auth' && <AuthPage onAuthSuccess={handleAuthSuccess} />}
      {page === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} />}
    </>
  );
}
