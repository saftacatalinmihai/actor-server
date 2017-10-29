import channel from "./socket"
import $ from "jquery"

let TO_PID = undefined

export function sendMessage(toPid) {
    $('#msg-modal').modal('open')
    $("#msg").focus()
    TO_PID = toPid
}

$("#msg-from").submit(event => {
    $('#msg-modal').modal('close')
    $(".svg").focus()
    event.preventDefault()
    let msg = $("#msg").val()
    channel.push("send_msg", {"to": TO_PID, "msg": "\"" + msg + "\""})
        .receive("ok", resp => {
            console.log("Resp:", resp)
        })
        .receive("error", resp => {
            console.log("Unable to send message: [" + msg + "] to actor: [" + TO_PID + "]. Error: ", resp)
        })
})
