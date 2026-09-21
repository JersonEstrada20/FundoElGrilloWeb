CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  staff_id TEXT,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
