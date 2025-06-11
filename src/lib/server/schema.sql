-- Add payment_requests table
CREATE TABLE IF NOT EXISTS payment_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checkout_request_id TEXT NOT NULL UNIQUE,
  project_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL,
  mpesa_receipt TEXT,
  error_code INTEGER,
  error_message TEXT,
  created_at DATETIME NOT NULL,
  completed_at DATETIME,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_payment_requests_checkout_request_id ON payment_requests(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_project_id ON payment_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);

-- Add mpesa_receipt column to donations table if it doesn't exist
ALTER TABLE donations ADD COLUMN IF NOT EXISTS mpesa_receipt TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS phone_number TEXT; 