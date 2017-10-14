defmodule RunningActors do
  @moduledoc false
  @compile if Mix.env == :test, do: :export_all
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def get_running_actors() do
    GenServer.call(__MODULE__, :get_running_actors)
  end

  def init(:ok) do
    Events.Store.register_watcher(self())
    {:ok, %{}}
  end

  def handle_call(:get_running_actors, _from, state) do
    {:reply, state, state}
  end

  def handle_info(event, state) do
    case event do
      %{:ev_type => :actor_started, :module => module, :pid => pid, :ts => ts} ->
        {:noreply, add_running_actor(state, module, pid, ts)}
      %{:ev_type => :actor_stopped, :pid => pid} ->
        {:noreply, remove_running_actor(state, pid)}
      _ -> {:noreply, state}
    end
  end

  def handle_cast(_msg, state) do
    {:noreply, state}
  end

  # TODO: add tests
  defp add_running_actor(state, module, pid, ts)  do
    Map.update(
      state,
      module,
      [%{:pid => pid, :ts => ts}],
      &([%{:pid => pid, :ts => ts} | &1])
    )
  end

  defp remove_running_actor(state, pid) do
    match = for {m, ps} <- state, %{pid: p, ts: ts} <- ps, p == pid, do: {m, p, ts}

    case match do
      [{mod, p_to_rem, ts}] -> Map.update(state, mod, [], &(List.delete(&1, %{pid: p_to_rem, ts: ts})))
      _ -> state
    end
  end

end
