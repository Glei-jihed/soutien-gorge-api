DROP TABLE IF EXISTS measurements;

CREATE TABLE measurements (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN (
    'temperature',
    'sizeBust',
    'sizeBustManual',
    'cardiac',
    'getSizeBust'
  )),
  value NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_measurements_type_created_at
  ON measurements(type, created_at DESC);