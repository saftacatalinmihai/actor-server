use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :actor_server, ActorServerWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :actor_server, ActorServer.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "actor_server_test",
  hostname: "db",
  pool: Ecto.Adapters.SQL.Sandbox
