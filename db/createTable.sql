DROP TABLE IF EXISTS people;

CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  data JSONB
);

CREATE INDEX idx_people ON people USING GIN(data jsonb_path_ops);
