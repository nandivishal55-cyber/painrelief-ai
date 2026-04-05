-- ============================================================================
-- PAINRELIEF AI - DATABASE SCHEMA
-- ============================================================================
-- PostgreSQL schema for production-ready SaaS application
-- Run this script to set up the complete database
-- ============================================================================

-- Create database
CREATE DATABASE painrelief_ai;

-- Connect to the database
\c painrelief_ai;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free', -- 'free', 'premium'
  chats_used_today INTEGER DEFAULT 0,
  chats_limit_daily INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en', -- 'en', 'hi', 'or'
  sentiment VARCHAR(50), -- 'positive', 'neutral', 'negative', 'urgent'
  contains_red_flag BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_conversations_red_flag ON conversations(contains_red_flag);

-- ============================================================================
-- PAIN LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS pain_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 10), -- 0-10 scale
  type VARCHAR(50) NOT NULL, -- 'knee', 'back', 'neck', 'joint', 'headache', 'other'
  location VARCHAR(255), -- Specific location
  duration_hours INTEGER, -- How long they've had the pain
  movement_impact VARCHAR(255), -- How movement affects pain
  notes TEXT, -- User's additional notes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pain_logs_user_id ON pain_logs(user_id);
CREATE INDEX idx_pain_logs_type ON pain_logs(type);
CREATE INDEX idx_pain_logs_created_at ON pain_logs(created_at);
CREATE INDEX idx_pain_logs_user_date ON pain_logs(user_id, created_at);

-- ============================================================================
-- EXERCISE LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercise_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL,
  exercise_name VARCHAR(255),
  duration INTEGER, -- Duration in seconds
  completed BOOLEAN DEFAULT true,
  difficulty VARCHAR(50), -- 'easy', 'moderate', 'hard'
  pain_before INTEGER CHECK (pain_before >= 0 AND pain_before <= 10),
  pain_after INTEGER CHECK (pain_after >= 0 AND pain_after <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercise_logs_user_id ON exercise_logs(user_id);
CREATE INDEX idx_exercise_logs_exercise_id ON exercise_logs(exercise_id);
CREATE INDEX idx_exercise_logs_created_at ON exercise_logs(created_at);

-- ============================================================================
-- MEDICATION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS medication_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  time_taken TIMESTAMP NOT NULL,
  pain_relief_level INTEGER CHECK (pain_relief_level >= 0 AND pain_relief_level <= 10),
  side_effects TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medication_logs_user_id ON medication_logs(user_id);
CREATE INDEX idx_medication_logs_created_at ON medication_logs(created_at);

-- ============================================================================
-- HEALTH REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS health_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(50), -- 'monthly', 'weekly', 'custom'
  period_start DATE,
  period_end DATE,
  average_pain_level DECIMAL(3, 1),
  improvement_percentage DECIMAL(5, 2), -- Percentage improvement
  total_exercises_completed INTEGER,
  total_pain_logs INTEGER,
  recommendations TEXT[], -- Array of recommendations
  report_data JSONB, -- Store detailed report as JSON
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX idx_health_reports_created_at ON health_reports(created_at);

-- ============================================================================
-- REMINDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50), -- 'exercise', 'pain_log', 'medication', 'doctor_visit'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_time TIME,
  frequency VARCHAR(50), -- 'daily', 'weekly', 'once'
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_scheduled_time ON reminders(scheduled_time);

-- ============================================================================
-- PREFERENCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  language VARCHAR(10) DEFAULT 'en', -- 'en', 'hi', 'or'
  theme VARCHAR(50) DEFAULT 'light', -- 'light', 'dark'
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  pain_types VARCHAR(255)[], -- Array of user's pain types
  daily_reminder_time TIME DEFAULT '08:00:00',
  font_size VARCHAR(50) DEFAULT 'medium', -- 'small', 'medium', 'large'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_preferences_user_id ON preferences(user_id);

-- ============================================================================
-- FEEDBACK TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50), -- 'bug', 'feature_request', 'general'
  title VARCHAR(255),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- ============================================================================
-- ACTIVITY LOG TABLE (For analytics and monitoring)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100), -- 'chat', 'pain_log', 'exercise', 'report_view'
  metadata JSONB, -- Store additional metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================================
-- SUBSCRIPTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50), -- 'free', 'premium'
  payment_method VARCHAR(50), -- 'credit_card', 'upi', 'paypal'
  amount DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50), -- 'active', 'cancelled', 'expired'
  auto_renew BOOLEAN DEFAULT true,
  billing_cycle_start DATE,
  billing_cycle_end DATE,
  next_billing_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- TRUSTED EXERCISES LIBRARY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercises_library (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_area VARCHAR(100), -- 'knee', 'back', 'neck', 'shoulder', 'joint'
  difficulty VARCHAR(50), -- 'easy', 'moderate', 'hard'
  duration_seconds INTEGER, -- How long the exercise takes
  step_instructions TEXT[], -- Array of step-by-step instructions
  precautions TEXT,
  frequency_recommended VARCHAR(100), -- e.g., "2-3 times daily"
  video_url VARCHAR(500),
  illustrations_url VARCHAR(500),
  effectiveness_rating DECIMAL(2, 1), -- 1-5 scale
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_library_target_area ON exercises_library(target_area);

-- ============================================================================
-- OTC MEDICATIONS LIBRARY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS medications_library (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  brand_names TEXT[], -- Array of brand names
  category VARCHAR(100), -- 'nsaid', 'acetaminophen', 'topical'
  dosage_form VARCHAR(50), -- 'tablet', 'capsule', 'cream'
  typical_dosage VARCHAR(200),
  max_daily_dose VARCHAR(100),
  when_to_take VARCHAR(100), -- 'with food', 'without food'
  uses TEXT, -- What it's used for
  side_effects TEXT[],
  contraindications TEXT[],
  drug_interactions TEXT[],
  precautions TEXT,
  for_pain_types VARCHAR(255)[], -- Which pain types it helps
  approval_status VARCHAR(50), -- 'approved_otc', 'prescription'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medications_library_name ON medications_library(name);

-- ============================================================================
-- RED FLAG PATTERNS TABLE (For AI detection)
-- ============================================================================
CREATE TABLE IF NOT EXISTS red_flag_patterns (
  id SERIAL PRIMARY KEY,
  pattern_name VARCHAR(255),
  keywords TEXT[],
  severity_level VARCHAR(50), -- 'warning', 'critical'
  recommended_action VARCHAR(500), -- What to recommend to user
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate red flag patterns
INSERT INTO red_flag_patterns (pattern_name, keywords, severity_level, recommended_action) VALUES
('Severe Pain', ARRAY['severe', 'unbearable', 'excruciating', 'worst'], 'critical', 'Immediately consult a healthcare professional'),
('Numbness/Tingling', ARRAY['numbness', 'tingling', 'pins and needles'], 'warning', 'Consult a doctor promptly'),
('Immobility', ARRAY['cannot move', 'immobile', 'paralyzed', 'cannot stand'], 'critical', 'Seek emergency medical care'),
('Swelling', ARRAY['swollen', 'bloated', 'inflammation'], 'warning', 'Consider consulting a doctor'),
('Fever', ARRAY['fever', 'temperature', 'chills'], 'warning', 'Consult a healthcare provider'),
('Injury', ARRAY['injured', 'accident', 'fall', 'twisted'], 'warning', 'Get evaluated by a medical professional');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's daily stats
CREATE OR REPLACE FUNCTION get_user_daily_stats(p_user_id INTEGER)
RETURNS TABLE (
  total_chats INTEGER,
  pain_logs_today INTEGER,
  exercises_completed INTEGER,
  average_pain DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT c.id)::INTEGER as total_chats,
    COUNT(DISTINCT CASE WHEN DATE(pl.created_at) = CURRENT_DATE THEN pl.id END)::INTEGER as pain_logs_today,
    COUNT(DISTINCT CASE WHEN DATE(el.created_at) = CURRENT_DATE THEN el.id END)::INTEGER as exercises_completed,
    AVG(pl.level)::DECIMAL as average_pain
  FROM users u
  LEFT JOIN conversations c ON u.id = c.user_id
  LEFT JOIN pain_logs pl ON u.id = pl.user_id
  LEFT JOIN exercise_logs el ON u.id = el.user_id
  WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate pain improvement percentage
CREATE OR REPLACE FUNCTION calculate_pain_improvement(p_user_id INTEGER, p_days INTEGER DEFAULT 30)
RETURNS DECIMAL AS $$
DECLARE
  v_start_avg DECIMAL;
  v_end_avg DECIMAL;
  v_improvement DECIMAL;
BEGIN
  -- Get average pain from start period
  SELECT AVG(level)::DECIMAL INTO v_start_avg
  FROM pain_logs
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
    AND created_at < CURRENT_DATE - INTERVAL '1 day' * (p_days / 2);

  -- Get average pain from recent period
  SELECT AVG(level)::DECIMAL INTO v_end_avg
  FROM pain_logs
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * (p_days / 2);

  -- Calculate improvement percentage
  IF v_start_avg > 0 THEN
    v_improvement := ((v_start_avg - v_end_avg) / v_start_avg) * 100;
  ELSE
    v_improvement := 0;
  END IF;

  RETURN v_improvement;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (For development/testing)
-- ============================================================================

-- Insert sample exercise library
INSERT INTO exercises_library (title, description, target_area, difficulty, duration_seconds, step_instructions, frequency_recommended, effectiveness_rating) VALUES
('Quadriceps Stretch', 'Stretch the front of the thigh muscle', 'knee', 'easy', 30, 
  ARRAY['Stand on one leg', 'Pull other heel toward buttocks', 'Hold for 30 seconds', 'Repeat on other side'],
  '2-3 times daily', 4.5),
('Cat-Cow Stretch', 'Gentle spinal mobility exercise', 'back', 'easy', 60,
  ARRAY['Get on hands and knees', 'Arch back (cow)', 'Round spine (cat)', 'Repeat 10-15 times'],
  '2-3 times daily', 4.7),
('Neck Rolls', 'Improve neck flexibility', 'neck', 'easy', 60,
  ARRAY['Sit upright', 'Drop chin to chest', 'Roll head in circles', 'Do 5 rolls each direction'],
  '3-4 times daily', 4.2);

-- ============================================================================
-- GRANTS (If using separate application user)
-- ============================================================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- ============================================================================
-- BACKUP & RECOVERY NOTES
-- ============================================================================
/*
To backup the database:
pg_dump painrelief_ai > painrelief_ai_backup.sql

To restore the database:
psql painrelief_ai < painrelief_ai_backup.sql

For production, consider:
1. Setting up automated backups
2. Replication for high availability
3. Partitioning large tables by date
4. Regular ANALYZE and VACUUM
*/

-- ============================================================================
-- INITIAL SETUP COMPLETE
-- ============================================================================
-- Run this script with: psql -U postgres -f database_schema.sql
-- Then update your .env file with database credentials
