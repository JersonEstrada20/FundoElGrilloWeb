ALTER TABLE staff ADD COLUMN pin_hash TEXT;
UPDATE staff SET pin_hash = 'b8981d6d50345239acedaf94afec1ee735de2681e8f5acd4f5a831a9e265e53d' WHERE id = 'owner-jerson-estrada';
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
