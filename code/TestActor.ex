defmodule TestActor do
  use GenServer
  require Logger
  require ActorTracer

  def start do
    {:ok, pid} = GenServer.start(__MODULE__, :ok, [])
    ActorTracer.trace(pid)
    {:ok, pid}
  end

  def start_link do
    {:ok, pid} = GenServer.start_link(__MODULE__, :ok, [])
    ActorTracer.trace(pid)
    {:ok, pid}
  end

  def ping(server) do
    GenServer.call(server, "ping")
  end

  def send_msg(server, msg) do
    GenServer.call(server, msg)
  end

  def init(:ok) do
    {:ok, %{}}
  end

  def handle_call("ping", _from, state) do
    {:reply, "pong", state}
  end

  def handle_cast("ping", state) do
    {:noreply, state}
  end

  def code_change(old_vsn, old_state, _extra) do
    {:ok, old_state}
  end

end