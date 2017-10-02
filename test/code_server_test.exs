defmodule CodeServerTest do
  use ExUnit.Case

  setup_all do
    {:ok, %{:name => name, :pid => pid}} = CodeServer.start_actor("TestActor")
    {:ok, pid: pid}
  end

  test "receive ping", state do
    rec = CodeServer.send_msg(state[:pid], "\"ping\"")
    assert rec == {:ok, %{received: "pong"}}
  end

  test "code change", state do
    {:ok, %{:code => code}} = CodeServer.get_actor_code("TestActor")
    rec = CodeServer.update_actor_code("TestActor", String.replace(code, "pong", "pong2"))
    assert rec == {:ok, %{:name => "TestActor"}}

    pong2 = CodeServer.send_msg(state[:pid], "\"ping\"")
    assert pong2 == {:ok, %{received: "pong2"}}

    CodeServer.update_actor_code("TestActor", code)
    assert rec == {:ok, %{:name => "TestActor"}}

    pong = CodeServer.send_msg(state[:pid], "\"ping\"")
    assert pong == {:ok, %{received: "pong"}}
  end
end