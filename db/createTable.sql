DROP TABLE IF EXISTS people;

CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  surname VARCHAR,
  created timestamp default current_timestamp
);
