import channel from "./socket"

export function stop_actor(pid) {
    channel.push("stop_actor", {"pid": pid})
        .receive("ok", resp => {
            console.log("Resp:", resp)
        })
        .receive("error", resp => {
            console.log("Unable to stop actor: [" + pid + "]. Error: ", resp)
        })
}