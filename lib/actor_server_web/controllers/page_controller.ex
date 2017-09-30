defmodule ActorServerWeb.PageController do
  use ActorServerWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
