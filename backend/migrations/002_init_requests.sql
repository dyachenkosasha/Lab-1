CREATE TABLE IF NOT EXISTS Requests (
  id        INTEGER PRIMARY KEY,
  userId    INTEGER NOT NULL,
  title     TEXT    NOT NULL,
  severity  INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  status    TEXT    NOT NULL CHECK (status IN ('Open', 'In progress', 'Resolved')),
  createdAt TEXT    NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);