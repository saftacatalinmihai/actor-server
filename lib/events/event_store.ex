defmodule Events.Store do

  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def get_events do
    GenServer.call(__MODULE__, :get_events)
  end

  def get_pid do
    GenServer.call(__MODULE__, :get_pid)
  end

  def register_watcher(pid) do
    GenServer.call(__MODULE__, {:register_watcher, pid})
  end

  def new_event(ev) do
    GenServer.call(__MODULE__, {:new_event, ev})
  end

  def init(:ok) do
    {:ok, %{:proc_events => [], :watchers => []}}
  end

  def handle_call(:get_events, _from, state) do
    {:reply, state[:proc_events], state}
  end

  def handle_call({:register_watcher, w}, _from, %{:proc_events => es, :watchers => ws}) do
    {:reply, :ok, %{:proc_events => es, :watchers => [w | ws]}}
  end

  def handle_call(:get_pid, _from, state) do
    {:reply, self(), state}
  end

  def handle_call({:new_event, event}, _from, %{:proc_events => ev_list, :watchers => watchers}) do
    ev = handle_event(event, watchers)
    {:reply, :ok, %{:proc_events => [ev | ev_list], :watchers => watchers}}
  end

  def handle_info(event, %{:proc_events => ev_list, :watchers => watchers}) do
    ev = handle_event(event, watchers)
    {:noreply, %{:proc_events => [ev | ev_list], :watchers => watchers}}
  end

  defp handle_event(event, watchers) do
    ev = case event do
      %{:ev_type => :actor_started} -> event
      {:trace_ts, pid, :send, msg, to_pid, ts} ->
        Events.send_msg_event(pid, to_pid, msg, ts)
      {:trace_ts, pid, :receive, msg, ts} ->
        Events.receive_msg_event(pid, msg, ts)
      e -> e
    end
    Enum.each(watchers, fn w -> send(w, {:event, ev}) end)
    ev
  end

end
