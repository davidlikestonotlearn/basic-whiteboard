CREATE TABLE IF NOT EXISTS board (
  id integer PRIMARY KEY CHECK (id = 1),
  contents jsonb NOT NULL
);
