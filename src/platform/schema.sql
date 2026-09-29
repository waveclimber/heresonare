BEGIN;
CREATE TABLE IF NOT EXISTS heresonare_platform (
  id integer PRIMARY KEY CHECK (id = 1),
  document jsonb NOT NULL CHECK (document->>'version' = '1'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO heresonare_platform (id, document) VALUES (1,
  '{"version":1,"records":[],"submissions":[],"sessions":[],"limits":{},"audit":[]}'::jsonb
) ON CONFLICT (id) DO NOTHING;
CREATE TABLE IF NOT EXISTS heresonare_media (
  id uuid PRIMARY KEY,
  data bytea NOT NULL CHECK (octet_length(data) <= 524288)
);
COMMIT;
