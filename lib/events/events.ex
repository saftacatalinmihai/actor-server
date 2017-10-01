defmodule Events do
  @moduledoc false

  @type ts :: {number(), number(), number()}

  @spec actor_started(String.t, identifier()) :: %{ev_type: term(), module: Strong.t, pid: identifier(), ts: ts}
  def actor_started(module, pid) do
    %{:ev_type => :actor_started, :module => module, :pid => pid, :ts => :erlang.timestamp}
  end

  def send_msg_event(pid, to_pid, msg, ts) do
    %{:ev_type => :message_sent, :pid => pid, :to_pid => to_pid, :msg => msg, :ts => ts}
  end

  def receive_msg_event(pid, msg, ts) do
    %{:ev_type => :message_received, :pid => pid, :msg => msg, :ts => ts}
  end

  def actor_stoped(pid, ts) do
    %{:ev_type => :actor_stopped, :pid => pid, :ts => ts}
  end

end
