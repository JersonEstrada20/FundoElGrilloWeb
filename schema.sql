PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'receptionist' CHECK (role IN ('owner','admin','receptionist')),
  pin_hash TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  registered_by TEXT NOT NULL REFERENCES staff(id),
  vehicle_plate TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  visit_id TEXT NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  rut TEXT NOT NULL,
  phone TEXT NOT NULL,
  plate TEXT NOT NULL,
  nationality TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visitors_rut ON visitors(rut);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
