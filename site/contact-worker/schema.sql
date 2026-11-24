-- 聯絡表單的資料表。執行：npm run db:init
CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  message    TEXT    NOT NULL,
  page       TEXT,
  ip_hash    TEXT,
  mailed     INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_messages_ip_time ON messages (ip_hash, created_at);
