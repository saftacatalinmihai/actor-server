defmodule PidFormatter do
  @moduledoc false

  def format_pid(:error_logger), do: :error_logger
  def format_pid(p), do: to_string(:erlang.pid_to_list(p))

end
