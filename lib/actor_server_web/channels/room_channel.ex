defmodule ActorServerWeb.RoomChannel do
    use Phoenix.Channel

    def join("room:lobby", _message, socket) do
      send(self(), :after_join)
      {:ok, socket}
    end

    def event_pusher(socket) do
      receive do
        ev ->
          push socket, "event", %{:event => ev}
          event_pusher(socket)
      end
    end

    def handle_info(:after_join, socket) do
      spawn( fn ->
        Events.Store.register_watcher(self())
        event_pusher(socket)
      end)
      {:noreply, socket}
    end

    def handle_in("get_actors", _attrs, socket) do
        actor_modules = CodeServer.get_actor_types()
        {:reply, {:ok, %{:actors => actor_modules}}, socket}
    end

    def handle_in("start_actor", %{"type" => name}, socket) do
        IO.puts "start actor received #{name}"
        {:reply, CodeServer.start_actor(name), socket}
    end

    def handle_in("new_actor", %{"name" => name}, socket) do
        IO.puts "new actor received #{name}"
        {:reply, CodeServer.new_actor_type(name), socket}
    end

    def handle_in("update_actor", %{"name" => name, "actor_code" => code }, socket) do
      IO.puts "update actor received #{name}"
      {:reply, CodeServer.update_actor_code(name, code), socket}
    end

    def handle_in("get_actor_code", %{"name" => name}, socket) do
      IO.puts "getting actor code #{name}"
      {:reply, CodeServer.get_actor_code(name), socket}
    end

    def handle_in("send_msg", %{"to" => pid, "msg" => msg}, socket) do
      IO.puts "send msg"
      IO.inspect pid
      IO.inspect msg
      {:reply, CodeServer.send_msg(pid, msg), socket}
    end

end
