import channel from "./socket"
import {success, error} from "./notifications";

export function stop_actor(pid, module) {
    channel.push("stop_actor", {"pid": pid})
        .receive("ok", resp => {
            success(module + " stopped. PID: " + pid)
            console.log("Resp:", resp)
        })
        .receive("error", resp => {
            success("Unable to stop actor")
            console.log("Unable to stop actor: [" + pid + "]. Error: ", resp)
        })
}