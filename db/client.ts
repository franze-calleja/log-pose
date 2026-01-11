import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'logpose.db';

let db: SQLite.SQLiteDatabase | null = null;

// Migration files - add new migrations to this array
const MIGRATIONS = [
  {
    version: 1,
    name: '001_initial_schema',
    sql: `-- Create trips table
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
VALUES (1, 'Unsorted Adventure', 1, 'active');`,
  },
];

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  console.log('[DB] Initializing database...');

  try {
    // Open database
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Get current database version
    const result = await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version;'
    );
    const currentVersion = result?.user_version ?? 0;

    console.log(`[DB] Current version: ${currentVersion}`);

    // Run migrations
    for (const migration of MIGRATIONS) {
      if (migration.version > currentVersion) {
        console.log(`[DB] Running migration ${migration.name}...`);

        await db.execAsync(migration.sql);

        // Update version
        await db.execAsync(`PRAGMA user_version = ${migration.version};`);

        console.log(`[DB] Migration ${migration.name} completed`);
      }
    }

    console.log('[DB] Database initialization complete');

    return db;
  } catch (error) {
    console.error('[DB] Error initializing database:', error);
    throw error;
  }
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
    console.log('[DB] Database closed');
  }
}
