defmodule RunningActors do
  @moduledoc false

  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    Events.Store.register_watcher(self())
    {:ok, %{}}
  end

  def handle_info(event, state) do
    case event do
      %{:ev_type => :actor_started, :module => module, :pid => pid} ->
        {:noreply, add_running_actor(state, module, pid)}
      %{:ev_type => :actor_stopped, :pid => pid} ->
        {:noreply, remove_running_actor(state, pid)}
      _ -> {:noreply, state}
    end
  end

  def handle_cast(_msg, state) do
    {:noreply, state}
  end

  defp add_running_actor(state, module, pid)  do
    Map.update(state, module, [pid], &([pid | &1]))
  end

  defp remove_running_actor(state, pid) do
    match = for {m, ps} <- state, p <- ps, p == pid, do: {m, p}

    case match do
      [{mod, p_to_rem}] -> Map.update(state, mod, [], &(List.delete(&1, p_to_rem)))
      _ -> state
    end
  end

end