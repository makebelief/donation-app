-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_amount REAL NOT NULL,
  raised_amount REAL DEFAULT 0,
  image TEXT,
  duration TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project goals
CREATE TABLE IF NOT EXISTS project_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  goal TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Project timeline
CREATE TABLE IF NOT EXISTS project_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATETIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Sustainable Development Goals
CREATE TABLE IF NOT EXISTS sdgs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- Project SDGs mapping
CREATE TABLE IF NOT EXISTS project_sdgs (
  project_id INTEGER NOT NULL,
  sdg_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, sdg_id),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  FOREIGN KEY (sdg_id) REFERENCES sdgs (id) ON DELETE CASCADE
);

-- Impact stories
CREATE TABLE IF NOT EXISTS impact_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Project expenses
CREATE TABLE IF NOT EXISTS project_expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  receipt_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Project beneficiaries
CREATE TABLE IF NOT EXISTS project_beneficiaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  beneficiary_id TEXT NOT NULL,
  name TEXT NOT NULL,
  impact_description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  mpesa_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Project updates
CREATE TABLE IF NOT EXISTS project_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Update images
CREATE TABLE IF NOT EXISTS update_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  update_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (update_id) REFERENCES project_updates (id) ON DELETE CASCADE
);

-- Metrics table for tracking various project metrics
CREATE TABLE IF NOT EXISTS project_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Insert default SDGs
INSERT OR IGNORE INTO sdgs (name, icon) VALUES
  ('No Poverty', '/icons/sdg-1.png'),
  ('Zero Hunger', '/icons/sdg-2.png'),
  ('Good Health and Well-being', '/icons/sdg-3.png'),
  ('Quality Education', '/icons/sdg-4.png'),
  ('Gender Equality', '/icons/sdg-5.png'),
  ('Clean Water and Sanitation', '/icons/sdg-6.png'),
  ('Affordable and Clean Energy', '/icons/sdg-7.png'),
  ('Decent Work and Economic Growth', '/icons/sdg-8.png'),
  ('Industry, Innovation and Infrastructure', '/icons/sdg-9.png'),
  ('Reduced Inequalities', '/icons/sdg-10.png'),
  ('Sustainable Cities and Communities', '/icons/sdg-11.png'),
  ('Responsible Consumption and Production', '/icons/sdg-12.png'),
  ('Climate Action', '/icons/sdg-13.png'),
  ('Life Below Water', '/icons/sdg-14.png'),
  ('Life on Land', '/icons/sdg-15.png'),
  ('Peace, Justice and Strong Institutions', '/icons/sdg-16.png'),
  ('Partnerships for the Goals', '/icons/sdg-17.png'); 