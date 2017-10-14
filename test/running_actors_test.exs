defmodule RunningActorsTest do
  @moduledoc false
  use ExUnit.Case

  test "add actor", state do
    assert %{"TestActor" => [%{pid: "pid", ts: "ts"}]} = RunningActors.add_running_actor(%{}, "TestActor", "pid", "ts")
    assert %{"TestActor" => [%{pid: "pid2", ts: "ts"}, %{pid: "pid", ts: "ts"}]} = RunningActors.add_running_actor( %{"TestActor" => [%{pid: "pid", ts: "ts"}]}, "TestActor", "pid2", "ts")
  end

  test "remove actor", state do
    assert %{"TestActor" => [%{pid: "pid", ts: "ts"}]} = RunningActors.remove_running_actor(%{"TestActor" => [%{pid: "pid2", ts: "ts"}, %{pid: "pid", ts: "ts"}]}, "pid2")
    assert %{} = RunningActors.remove_running_actor(%{"TestActor" => [%{pid: "pid", ts: "ts"}]}, "pid")
  end

end
