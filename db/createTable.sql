DROP TABLE IF EXISTS people;

CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  attributes JSONB
);

CREATE INDEX idx_people ON people USING GIN(attributes jsonb_path_ops);
