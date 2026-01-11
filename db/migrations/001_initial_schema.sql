-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date TEXT,
  status TEXT DEFAULT 'active',
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id INTEGER NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_id INTEGER NOT NULL,
  uri TEXT NOT NULL,
  thumbnail_uri TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (log_id) REFERENCES logs(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_logs_trip_id ON logs(trip_id);
CREATE INDEX IF NOT EXISTS idx_logs_address_null ON logs(address) WHERE address IS NULL;
CREATE INDEX IF NOT EXISTS idx_photos_log_id ON photos(log_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);

-- Insert the immortal "Unsorted Adventure" system trip
INSERT INTO trips (id, name, is_default, status) 
VALUES (1, 'Unsorted Adventure', 1, 'active');
