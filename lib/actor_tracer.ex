defmodule ActorTracer do
  @moduledoc false

  use GenServer

  def get_pid do
    GenServer.call(__MODULE__, :get_pid)
  end

  def trace(pid) do
    :erlang.trace(pid, true, [:send, :receive, :exiting, :timestamp, {:tracer, ActorTracer.get_pid()}])
  end

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def handle_call(:get_pid, _from, state) do
    {:reply, self(), state}
  end

  def handle_info(event, state) do
    IO.inspect(event)
    EventStore.new_event(event)
    {:noreply, state}
  end

end
