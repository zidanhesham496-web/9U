CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  college TEXT NOT NULL,
  phone TEXT NOT NULL,
  talent TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations(created_at);
CREATE INDEX IF NOT EXISTS registrations_talent_idx ON registrations(talent);
