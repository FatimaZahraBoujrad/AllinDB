\getenv readonly_password POSTGRES_READONLY_PASSWORD

CREATE ROLE allindb_readonly
  LOGIN
  PASSWORD :'readonly_password'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOINHERIT;

CREATE TABLE public.sample_customers (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.sample_customers (display_name)
VALUES ('Ada Lovelace'), ('Grace Hopper'), ('Katherine Johnson');

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SELECT format(
  'GRANT CONNECT ON DATABASE %I TO allindb_readonly',
  current_database()
) \gexec
SELECT format(
  'REVOKE TEMPORARY ON DATABASE %I FROM PUBLIC',
  current_database()
) \gexec
SELECT format(
  'REVOKE TEMPORARY ON DATABASE %I FROM allindb_readonly',
  current_database()
) \gexec
GRANT USAGE ON SCHEMA public TO allindb_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO allindb_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO allindb_readonly;
