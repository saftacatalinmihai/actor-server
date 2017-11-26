import channel from "./socket"
import $ from "jquery"
import {success, error} from "./notifications";

let TO_PID = undefined

export function send_message(toPid) {
    $('#msg-modal').modal('open')
    $("#msg").focus()
    TO_PID = toPid
}

$("#msg-from").submit(event => {
    $('#msg-modal').modal('close')
    $("svg").focus()
    event.preventDefault()
    let msg = $("#msg").val()
    channel.push("send_msg", {"to": TO_PID, "msg": "\"" + msg + "\""})
        .receive("ok", resp => {
            success(resp['received'])
            console.log("Resp:", resp)
        })
        .receive("error", resp => {
            let message = "Unable to send message: [" + msg + "] to actor: [" + TO_PID + "]"
            error(message)
            console.log(console.log(message + ". Error: ", resp))
        })
})
