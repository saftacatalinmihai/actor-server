import channel from "./socket"
import $ from "jquery"

let TO_PID = undefined

export function sendMessage(toPid) {
    $('#message-modal').modal('open');
    $("#msg").focus()
    TO_PID = toPid
}

$("#msg-from").submit(event => {
    event.preventDefault();
    channel.push("send_msg", {"to": TO_PID, "msg": "\"" + $("#msg").val() + "\""})
        .receive("ok", resp => {
            console.log("Resp:", resp)
        })
        .receive("error", resp => {
            console.log("Unable to send message: [" + msg + "] to actor: [" + TO_PID + "]. Error: ", resp)
        })
})
