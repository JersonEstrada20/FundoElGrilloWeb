CREATE TABLE IF NOT EXISTS cabin_profiles (
  slug TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  description TEXT,
  low_price INTEGER,
  high_price INTEGER,
  guests INTEGER,
  bedrooms INTEGER,
  pool_type TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
