defmodule ActorTracer do
  @moduledoc false

  use GenServer

  def get_pid do
    GenServer.call(__MODULE__, :get_pid)
  end

  defmacro trace(pid) do
    quote do
      Events.Store.new_event(Events.actor_started(__MODULE__, unquote(pid)))
      :erlang.trace(unquote(pid), true, [:send, :receive, :timestamp, {:tracer, ActorTracer.get_pid()}])
    end
  end

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def handle_call(:get_pid, _from, state) do
    {:reply, self(), state}
  end

  def handle_info(event, state) do
    Events.Store.new_event(event)
    {:noreply, state}
  end

end
