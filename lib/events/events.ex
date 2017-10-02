defmodule Events do
  @moduledoc false

  @type ts :: {number(), number(), number()}

  @spec actor_started(String.t, identifier()) :: %{ev_type: term(), module: Strong.t, pid: identifier(), ts: ts}
  def actor_started(module, pid) do
    %{:ev_type => :actor_started, :module => module, :pid => to_string(:erlang.pid_to_list(pid)), :ts => timestamp_to_millis(:erlang.timestamp)}
  end

  def send_msg_event(pid, to_pid, msg, ts) do
    %{:ev_type => :message_sent, :pid => to_string(:erlang.pid_to_list(pid)), :to_pid => to_string(:erlang.pid_to_list(to_pid)), :msg => msg, :ts => timestamp_to_millis(ts)}
  end

  def receive_msg_event(pid, msg, ts) do
    %{:ev_type => :message_received, :pid => to_string(:erlang.pid_to_list(pid)), :msg => msg, :ts => timestamp_to_millis(ts)}
  end

  def actor_stoped(pid, ts) do
    %{:ev_type => :actor_stopped, :pid => to_string(:erlang.pid_to_list(pid)), :ts => timestamp_to_millis(ts)}
  end

  defp timestamp_to_millis(ts) do
    {mega, seconds, ms} = ts
    (mega*1000000 + seconds)*1000 + :erlang.round(ms/1000)
  end

end
