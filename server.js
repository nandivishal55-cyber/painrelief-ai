/**
 * ============================================================================
 * PAINRELIEF AI - BACKEND API
 * ============================================================================
 * Production-ready Node.js/Express backend with:
 * - RESTful APIs for all features
 * - Claude AI Doctor integration
 * - Multi-language support
 * - Database operations
 * - Authentication
 * - Pain tracking
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';

dotenv.config();

// ============================================================================
// CONFIGURATION
// ============================================================================
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize Anthropic client
const client = new Anthropic();

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'painrelief_ai',
});

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * User Registration
 * POST /api/auth/register
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * User Login
 * POST /api/auth/login
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================================================================
// AI DOCTOR ENDPOINTS
// ============================================================================

/**
 * Chat with AI Doctor
 * POST /api/chat/message
 */
app.post('/api/chat/message', verifyToken, async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build system prompt in selected language
    const systemPrompts = {
      en: `You are a highly empathetic and knowledgeable AI Health Assistant specializing in pain management. Your role is to:

1. Ask clarifying questions about the user's pain:
   - Location (knee, back, neck, joint, etc.)
   - Duration (how long they've had it)
   - Severity (1-10 scale)
   - Triggers and movements that affect it

2. Provide structured advice:
   - Understanding of their condition
   - Possible causes (without diagnosing)
   - Safe exercises and stretches
   - Lifestyle recommendations
   - OTC medication suggestions (with disclaimers)

3. ALWAYS include these safety measures:
   - Disclaimer: "I'm an AI assistant, not a doctor. Consult a licensed healthcare provider before taking medication."
   - Red flag detection: If user mentions severe pain, numbness, immobility, or injury → IMMEDIATELY recommend doctor visit
   - Never claim to treat or cure conditions

4. Communication style:
   - Use simple, clear language (important for elderly users)
   - Be empathetic and caring
   - Ask follow-up questions
   - Provide step-by-step instructions for exercises
   - Use bullet points for clarity

5. Response format:
   - Start with empathy
   - Ask clarifying questions first
   - Provide structured recommendations
   - Always end with safety disclaimer`,

      hi: `आप एक अत्यंत सहानुभूतिपूर्ण और जानकार AI स्वास्थ्य सहायक हैं जो दर्द प्रबंधन में विशेषज्ञ हैं। आपकी भूमिका:

1. उपयोगकर्ता के दर्द के बारे में स्पष्टीकरण प्रश्न पूछें
2. संरचित सलाह प्रदान करें (व्यायाम, जीवनशैली, दवाएं)
3. सुरक्षा उपायों को शामिल करें
4. सरल, स्पष्ट भाषा का उपयोग करें
5. हमेशा चेतावनी के साथ समाप्त करें

महत्वपूर्ण: कभी नहीं कहें कि आप रोग का निदान या इलाज कर सकते हैं।`,

      or: `ଆପଣ ଜଣେ ଅତ୍ୟନ୍ତ ସହାନୁଭୂତିଶୀଳ ଏବଂ ଜ୍ଞାନୀ AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ ଯିଏ ଯନ୍ତ୍ରଣା ପରିଚାଳନାରେ ବିଶେଷଜ୍ଞ।

1. ବ୍ୟବହାରକାରୀଙ୍କ ଯନ୍ତ୍ରଣା ବିଷୟରେ ସ୍ପଷ୍ଟୀକରଣ ପ୍ରଶ୍ନ ପୁଛନ୍ତୁ
2. ସଂରଚିତ ପରାମର୍ଶ ପ୍ରଦାନ କରନ୍ତୁ
3. ସୁରକ୍ଷା ବ୍ୟବସ୍ଥା ଅନ୍ତର୍ଭୁକ୍ତ କରନ୍ତୁ
4. ସରଳ ଭାଷା ବ୍ୟବହାର କରନ୍ତୁ
5. ଚେତାବନୀ ସହିତ ସମାପ୍ତ କରନ୍ତୁ`
    };

    // Format conversation history for Claude
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompts[language] || systemPrompts.en,
      messages: messages
    });

    const aiMessage = response.content[0].text;

    // Save conversation to database
    try {
      await pool.query(
        'INSERT INTO conversations (user_id, user_message, ai_response, language, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [req.userId, message, aiMessage, language]
      );
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Don't fail the API call if database save fails
    }

    res.json({
      success: true,
      message: aiMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * Get Conversation History
 * GET /api/chat/history
 */
app.get('/api/chat/history', verifyToken, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const result = await pool.query(
      'SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [req.userId, parseInt(limit)]
    );

    res.json({
      success: true,
      conversations: result.rows.reverse()
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ============================================================================
// PAIN TRACKING ENDPOINTS
// ============================================================================

/**
 * Log Pain Level
 * POST /api/pain/log
 */
app.post('/api/pain/log', verifyToken, async (req, res) => {
  try {
    const { level, type, notes } = req.body;

    // Validation
    if (level < 0 || level > 10) {
      return res.status(400).json({ error: 'Pain level must be 0-10' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Pain type is required' });
    }

    const result = await pool.query(
      'INSERT INTO pain_logs (user_id, level, type, notes, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [req.userId, level, type, notes || null]
    );

    res.json({
      success: true,
      painLog: result.rows[0]
    });
  } catch (error) {
    console.error('Pain log error:', error);
    res.status(500).json({ error: 'Failed to log pain' });
  }
});

/**
 * Get Pain History
 * GET /api/pain/history
 */
app.get('/api/pain/history', verifyToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const result = await pool.query(
      'SELECT * FROM pain_logs WHERE user_id = $1 AND created_at >= $2 ORDER BY created_at DESC',
      [req.userId, startDate]
    );

    // Calculate statistics
    const logs = result.rows;
    const averageLevel = logs.length > 0
      ? (logs.reduce((sum, log) => sum + log.level, 0) / logs.length).toFixed(1)
      : 0;
    const maxLevel = logs.length > 0 ? Math.max(...logs.map(l => l.level)) : 0;
    const minLevel = logs.length > 0 ? Math.min(...logs.map(l => l.level)) : 0;

    res.json({
      success: true,
      painLogs: logs,
      statistics: {
        averageLevel: parseFloat(averageLevel),
        maxLevel,
        minLevel,
        totalLogs: logs.length
      }
    });
  } catch (error) {
    console.error('Pain history error:', error);
    res.status(500).json({ error: 'Failed to fetch pain history' });
  }
});

/**
 * Get Pain Analytics
 * GET /api/pain/analytics
 */
app.get('/api/pain/analytics', verifyToken, async (req, res) => {
  try {
    // Get 30-day history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await pool.query(
      'SELECT * FROM pain_logs WHERE user_id = $1 AND created_at >= $2 ORDER BY created_at ASC',
      [req.userId, thirtyDaysAgo]
    );

    const logs = result.rows;

    // Group by pain type
    const byType = {};
    logs.forEach(log => {
      if (!byType[log.type]) {
        byType[log.type] = [];
      }
      byType[log.type].push(log.level);
    });

    // Calculate improvement
    const firstWeek = logs.filter(l => new Date(l.created_at) < new Date(Date.now() - 7*24*60*60*1000));
    const lastWeek = logs.filter(l => new Date(l.created_at) >= new Date(Date.now() - 7*24*60*60*1000));

    const avgFirstWeek = firstWeek.length > 0
      ? firstWeek.reduce((sum, l) => sum + l.level, 0) / firstWeek.length
      : 0;
    const avgLastWeek = lastWeek.length > 0
      ? lastWeek.reduce((sum, l) => sum + l.level, 0) / lastWeek.length
      : 0;

    const improvement = avgFirstWeek > 0
      ? (((avgFirstWeek - avgLastWeek) / avgFirstWeek) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      analytics: {
        totalLogsLastMonth: logs.length,
        averageLevel: logs.length > 0 ? (logs.reduce((s, l) => s + l.level, 0) / logs.length).toFixed(1) : 0,
        painTypeDistribution: byType,
        improvement: parseFloat(improvement),
        timeline: logs.map(l => ({
          date: new Date(l.created_at).toISOString().split('T')[0],
          level: l.level,
          type: l.type
        }))
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ============================================================================
// EXERCISE ENDPOINTS
// ============================================================================

/**
 * Get Recommended Exercises
 * GET /api/exercises/recommended
 */
app.get('/api/exercises/recommended', verifyToken, async (req, res) => {
  try {
    const exercises = [
      {
        id: 1,
        title: 'Quadriceps Stretch',
        area: 'knee',
        difficulty: 'easy',
        duration: 30,
        steps: [
          'Stand on one leg, holding a wall for balance',
          'Bend your other knee and bring your heel toward your buttocks',
          'Hold your foot with your hand and gently pull',
          'Keep your body upright and avoid twisting',
          'Hold for 30 seconds and repeat on the other side'
        ],
        frequency: '2-3 times daily',
        precautions: 'Do not pull too hard on the foot'
      },
      {
        id: 2,
        title: 'Cat-Cow Stretch',
        area: 'back',
        difficulty: 'easy',
        duration: 60,
        steps: [
          'Get on your hands and knees',
          'Arch your back, push your chest forward (cow pose)',
          'Round your spine, tuck your chin to chest (cat pose)',
          'Move slowly between poses with your breathing',
          'Repeat 10-15 times'
        ],
        frequency: '2-3 times daily',
        precautions: 'Move slowly and smoothly'
      },
      {
        id: 3,
        title: 'Neck Rolls',
        area: 'neck',
        difficulty: 'easy',
        duration: 60,
        steps: [
          'Sit upright with shoulders relaxed',
          'Slowly drop your chin to your chest',
          'Roll your head to the left shoulder',
          'Continue rolling back and then to the right shoulder',
          'Complete 5 rolls in each direction'
        ],
        frequency: '3-4 times daily',
        precautions: 'Do not roll backwards in a full circle'
      }
    ];

    res.json({
      success: true,
      exercises
    });
  } catch (error) {
    console.error('Exercises fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

/**
 * Log Exercise Completion
 * POST /api/exercises/log
 */
app.post('/api/exercises/log', verifyToken, async (req, res) => {
  try {
    const { exerciseId, duration, notes } = req.body;

    const result = await pool.query(
      'INSERT INTO exercise_logs (user_id, exercise_id, duration, notes, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [req.userId, exerciseId, duration || 0, notes || null]
    );

    res.json({
      success: true,
      exerciseLog: result.rows[0]
    });
  } catch (error) {
    console.error('Exercise log error:', error);
    res.status(500).json({ error: 'Failed to log exercise' });
  }
});

// ============================================================================
// REPORT ENDPOINTS
// ============================================================================

/**
 * Generate Health Report
 * GET /api/reports/generate
 */
app.get('/api/reports/generate', verifyToken, async (req, res) => {
  try {
    const { month } = req.query;
    
    // Get pain logs for the month
    const painResult = await pool.query(
      'SELECT * FROM pain_logs WHERE user_id = $1 ORDER BY created_at ASC',
      [req.userId]
    );

    const painLogs = painResult.rows;

    // Calculate metrics
    const avgPain = painLogs.length > 0
      ? (painLogs.reduce((sum, log) => sum + log.level, 0) / painLogs.length).toFixed(1)
      : 0;

    const report = {
      generatedAt: new Date().toISOString(),
      period: month || new Date().toISOString().split('T')[0],
      metrics: {
        averagePain: parseFloat(avgPain),
        totalLogsRecorded: painLogs.length,
        maxPain: painLogs.length > 0 ? Math.max(...painLogs.map(l => l.level)) : 0,
        minPain: painLogs.length > 0 ? Math.min(...painLogs.map(l => l.level)) : 0
      },
      recommendations: [
        'Continue with prescribed exercises',
        'Monitor pain patterns for triggers',
        'Consider consulting a healthcare provider for persistent pain',
        'Maintain consistent tracking for better insights'
      ],
      disclaimer: 'This report is generated by AI and should not replace professional medical advice. Consult a licensed healthcare provider for diagnosis and treatment.'
    };

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// ============================================================================
// MEDICATION GUIDANCE ENDPOINTS
// ============================================================================

/**
 * Get OTC Medication Suggestions
 * GET /api/medications/suggestions
 */
app.get('/api/medications/suggestions', verifyToken, async (req, res) => {
  try {
    const { painType } = req.query;

    const medicationGuide = {
      knee: [
        {
          name: 'Ibuprofen (Advil, Motrin)',
          dosage: '200-400mg every 4-6 hours',
          maxDaily: '1200mg',
          timing: 'With food',
          precautions: 'May cause stomach upset. Not for long-term use without doctor approval.',
          uses: 'Reduces inflammation and pain'
        },
        {
          name: 'Acetaminophen (Paracetamol, Tylenol)',
          dosage: '500-1000mg every 4-6 hours',
          maxDaily: '3000mg',
          timing: 'With or without food',
          precautions: 'Do not exceed daily limit. Avoid if you have liver disease.',
          uses: 'Pain relief without anti-inflammatory effect'
        }
      ],
      back: [
        {
          name: 'Ibuprofen (Advil, Motrin)',
          dosage: '200-400mg every 4-6 hours',
          maxDaily: '1200mg',
          timing: 'With food',
          precautions: 'May cause stomach upset. Not for long-term use without doctor approval.',
          uses: 'Reduces inflammation and pain'
        },
        {
          name: 'Naproxen (Aleve)',
          dosage: '220mg every 8-12 hours',
          maxDaily: '660mg',
          timing: 'With food or milk',
          precautions: 'Longer-lasting than ibuprofen. Not suitable for daily use.',
          uses: 'Anti-inflammatory pain relief'
        }
      ]
    };

    const suggestions = medicationGuide[painType] || medicationGuide.knee;

    res.json({
      success: true,
      medications: suggestions,
      disclaimer: '⚠️ IMPORTANT: This is educational information only. Always consult a licensed healthcare provider before taking any medication. Do not self-diagnose or self-medicate. These medications may interact with other drugs you are taking.'
    });
  } catch (error) {
    console.error('Medication guidance error:', error);
    res.status(500).json({ error: 'Failed to fetch medication information' });
  }
});

// ============================================================================
// USER PROFILE ENDPOINTS
// ============================================================================

/**
 * Get User Profile
 * GET /api/user/profile
 */
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PainRelief AI API is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 PainRelief AI API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'painrelief_ai'}`);
});

export default app;
