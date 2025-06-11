-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_amount INTEGER NOT NULL,
  current_amount INTEGER DEFAULT 0,
  image_url TEXT,
  location TEXT,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project Updates table
CREATE TABLE IF NOT EXISTS project_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Project Impact Metrics table
CREATE TABLE IF NOT EXISTS project_impact (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  transaction_id TEXT,
  donor_phone TEXT,
  donor_name TEXT DEFAULT 'Anonymous',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_impact_project_id ON project_impact(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- Triggers
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp
AFTER UPDATE ON projects
BEGIN
  UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Sample Data
INSERT OR IGNORE INTO projects (id, title, description, target_amount, image_url) VALUES
(1, 'Clean Water Initiative', 'Providing clean water access to rural communities in Kenya', 50000, '/images/water-project.jpg'),
(2, 'Education for All', 'Building and equipping schools in Tanzania', 75000, '/images/education-project.jpg'),
(3, 'Healthcare Access', 'Mobile clinics for remote villages in Uganda', 100000, '/images/healthcare-project.jpg'),
(4, 'Sustainable Farming', 'Supporting small-scale farmers with modern techniques', 25000, '/images/farming-project.jpg');

INSERT OR IGNORE INTO project_updates (project_id, title, content) VALUES
(1, 'First Well Completed', 'We are excited to announce the completion of our first well, providing clean water to over 500 people.'),
(1, 'Community Training', 'Local community members have been trained in well maintenance and water management.'),
(2, 'Construction Begins', 'Construction of the first school building has begun with strong community support.'),
(3, 'Medical Supplies Secured', 'Essential medical supplies and equipment have been secured for the mobile clinics.');

INSERT OR IGNORE INTO project_impact (project_id, name, value, icon) VALUES
(1, 'People Served', '500+', 'users'),
(1, 'Wells Built', '1', 'home'),
(1, 'Villages Reached', '3', 'map-pin'),
(2, 'Students Enrolled', '200+', 'academic-cap'),
(2, 'Teachers Hired', '8', 'users'),
(3, 'Patients Treated', '1000+', 'heart'),
(3, 'Villages Covered', '5', 'map');

INSERT OR IGNORE INTO donations (project_id, amount, transaction_id, donor_phone, donor_name) VALUES
(1, 1000, 'TX123456', '+254722123456', 'John Doe'),
(1, 500, 'TX123457', '+254722123457', 'Jane Doe'),
(2, 2000, 'TX123458', '+254722123458', 'Bob Smith'),
(3, 1500, 'TX123459', '+254722123459', 'Alice Johnson'),
(4, 750, 'TX123460', '+254722123460', 'Charlie Brown'),
(1, 300, 'TX123461', '+254722123461', 'Eve Adams'); 