defmodule CodeServer do
  @moduledoc false

  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def get_actor_types do
    GenServer.call(__MODULE__, :get_actor_types)
  end

  def new_actor_type(actor_type) do
    GenServer.call(__MODULE__, {:new_actor_type, actor_type})
  end

  def start_actor(actor_type) do
    GenServer.call(__MODULE__, {:start_actor, actor_type})
  end

  def get_actor_code(actor_type) do
    GenServer.call(__MODULE__, {:get_code, actor_type})
  end

  def update_actor_code(actor_type, new_code) do
    GenServer.call(__MODULE__, {:update_code, actor_type, new_code})
  end
  def update_actor_code(actor_type) do
    GenServer.call(__MODULE__, {:update_code, actor_type})
  end

  def send_msg(to_pid, msg) do
    GenServer.call(__MODULE__, {:send_msg, to_pid, msg})
  end

  def stop(pid) do
    GenServer.call(__MODULE__, {:stop, pid})
  end

  def init(:ok) do
    actor_types = getActors()
                  |> evalActors
    {:ok, %{:actor_types => actor_types}}
  end

  def handle_exceptions(f, state) do
    try do
      f.()
    rescue
      e in RuntimeError ->
        IO.inspect e
        IO.puts("Runtime error")
        {:reply, {:error, %{:reson => inspect(e)}}, state}
      e ->
        IO.inspect e
        IO.puts("Other error")
        {:reply, {:error, %{:reson => inspect(e)}}, state}
    catch
      e ->
        IO.inspect e
        IO.puts("Catch error")
        {:reply, {:error, %{:reson => inspect(e)}}, state}
      :exit, e ->
        IO.inspect e
        IO.puts("Catch exit")
        {:reply, {:error, %{:reson => inspect(e)}}, state}
    end
  end

  def handle_call({:stop, pid_str}, _from, state) do
    pid = :erlang.list_to_pid(to_charlist(pid_str))
    case Process.exit(pid, :stoped_by_user) do
      true -> {:reply, {:ok, %{:stoped => pid_str}}, state}
      _ -> {:reply, {:error, %{:not_stoped => pid_str}}, state}
    end
  end

  def handle_call(:get_actor_types, _from, state) do
    {:reply, state[:actor_types], state}
  end

  def handle_call({:start_actor, actor_type}, _from, state) do
    handle_exceptions(
      fn () ->
        {:ok, pid} = :"Elixir.#{actor_type}".start
        Process.monitor(pid)
        {:reply, {:ok, %{:name => actor_type, :pid => to_string(:erlang.pid_to_list(pid))}}, state}
      end,
      state
    )
  end

  def handle_call({:new_actor_type, actor_type}, _from, %{:actor_types => actor_types}) do
    if not Enum.member?(actor_types, actor_type) do
      case File.read("code/template/actor.ex") do
        {:ok, body} ->
          {:ok, file} = File.open "code/#{actor_type}.ex", [:write]
          IO.binwrite file, String.replace(body, "{{actor_name}}", actor_type)
          Code.eval_file("code/#{actor_type}.ex")
          {:reply, {:ok, %{:actor_type => actor_type}}, %{:actor_types => [actor_type | actor_types]}}
        {:error, reason} ->
          IO.inspect reason
          {:reply, {:error, %{:reason => reason}}, %{:actor_types => actor_types}}
      end
    else
      {:reply, {:error, %{:reason => "Actor type #{actor_type} already exists"}}, %{:actor_types => actor_types}}
    end
  end

  def handle_call({:get_code, actor_type}, _from, state) do
    case File.read("code/#{actor_type}.ex") do
      {:ok, body} ->
        {:reply, {:ok, %{:code => body}}, state}
      {:error, reason} ->
        {:reply, {:error, %{:reason => reason}}, state}
    end
  end

  def handle_call({:update_code, actor_type}, _from, state) do
    reload_code(actor_type, state)
  end

  def handle_call({:update_code, actor_type, new_code}, _from, state) do
    {:ok, file} = File.open "code/#{actor_type}.ex", [:write]
    IO.binwrite file, new_code
    reload_code(actor_type, state)
  end

  def handle_call({:send_msg, to_pid, msg}, _from, state) do
    handle_exceptions(
      fn () ->
        {msg_evaled, _} = Code.eval_string(msg)
        pid = :erlang.list_to_pid(to_charlist(to_pid))
        rec = GenServer.call(pid, msg_evaled)
        {:reply, {:ok, %{:received => rec}}, state}
      end,
      state
    );
  end

  def handle_call(_msg, _from, state) do
    {:reply, :ok, state}
  end

  def handle_cast(_msg, state) do
    {:noreply, state}
  end

  def handle_info({:DOWN, _ref, :process, pid, reason}, state) do
    Events.Store.new_event(Events.actor_stoped(pid, :os.timestamp(), reason))
    {:noreply, state}
  end

  defp reload_code(actor_type, state) do
    try do
      IO.inspect Code.eval_file("code/#{actor_type}.ex")
      {:reply, {:ok, %{:name => actor_type}}, state}
    rescue
      e ->
        IO.inspect e
        {:reply, {:error, %{:reson => e}}, state}
    end
  end

  defp getActors do
    Path.wildcard("code/*.ex")
    |> Enum.map(
         fn file ->
           String.replace_prefix(file, "code/", "")
           |> String.replace_suffix(".ex", "")
         end
       )
  end

  defp evalActors(actors) do
    actors
    |> Enum.map(&evalActor/1)
  end

  defp evalActor(type) do
    Code.eval_file("code/#{type}.ex")
    type
  end

  def integration_test() do
    sleep_time = 200
    CodeServer.start_actor("TestActor")
    :timer.sleep(sleep_time)
    CodeServer.start_actor("TestActor")
    :timer.sleep(sleep_time)
    {:ok, %{:name => name, :pid => pid}} = CodeServer.start_actor("TestActor")
    :timer.sleep(sleep_time)
    CodeServer.start_actor("TestActor")
    :timer.sleep(sleep_time)
    CodeServer.start_actor("TestActor")
    :timer.sleep(sleep_time)
    CodeServer.send_msg(pid, "\"ping\"")
    :timer.sleep(sleep_time)
    try do
      CodeServer.send_msg(pid, "\"ping2\"")
    catch
      :exit, _ ->
        IO.puts("Expected to fail")
        :timer.sleep(sleep_time)
    end
    CodeServer.start_actor("TestActor")
    :timer.sleep(sleep_time)
    CodeServer.start_actor("TestActor")
  end

end
