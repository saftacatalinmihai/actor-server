import channel from "./socket"

export function sendMessage(toPid, msg) {
        channel.push("send_msg", {"to": toPid, "msg": msg})
        .receive("ok", resp => {
            console.log("Resp:", resp)
        })
        .receive("error", resp => {
            console.log("Unable to send message: ["+msg+"] to actor: ["+toPid+"]. Error: ", resp)
        })
}