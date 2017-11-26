import channel from "./socket"
import $ from "jquery"
import {success, error} from "./notifications";

let ACTIVE = false

export function start_actor_from_input() {
    $('#actor-type-modal').modal('open')
    $("#actor-type").focus()
    ACTIVE = true
}

export function start_actor(actor_type) {
    if (actor_type.length > 0) {
        channel.push("start_actor", {"type": actor_type})
            .receive("ok", resp => {
                success(actor_type + " started. PID: " + resp['pid'])
                console.log("Resp:", resp)
            })
            .receive("error", resp => {
                error("Unable to start actor")
                console.log("Unable to start actor type: [" + actor_type + "]. Error: ", resp)
            })
    } else {
        console.log("Actor type empty")
    }
}

// The same modal is used in new-actor-type
$("#actor-type-modal").submit(event => {
    if (ACTIVE) {
        $('#actor-type-modal').modal('close')
        $("svg").focus()
        event.preventDefault()
        let actor_type = $("#actor-type").val()
        start_actor(actor_type);
        ACTIVE = false;
    }
})
