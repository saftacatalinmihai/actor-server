import channel from "./socket"
import $ from "jquery"

export function start_actor() {
    $('#actor-type-modal').modal('open')
    $("#actor-type").focus()
}

$("#actor-type-modal").submit(event => {
    $('#actor-type-modal').modal('close')
    $("svg").focus()
    event.preventDefault()
    let actor_type = $("#actor-type").val()
    if (actor_type.length > 0) {
        channel.push("start_actor", {"type": actor_type})
            .receive("ok", resp => {
                console.log("Resp:", resp)
            })
            .receive("error", resp => {
                console.log("Unable to start actor type: [" + actor_type + "]. Error: ", resp)
            })
    } else {
        console.log("Actor type empty")
    }
})
