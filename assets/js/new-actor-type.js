import channel from "./socket"
import $ from "jquery"
import {success, error} from "./notifications";
import {start_actor} from "./start-actor";

let ACTIVE = false

export function new_actor_type() {
    $('#actor-type-modal').modal('open')
    $("#actor-type").focus()
    ACTIVE = true;
}

// The same modal is used in start-actor
$("#actor-type-modal").submit(event => {
    if (ACTIVE) {
        $('#actor-type-modal').modal('close')
        $("svg").focus()
        event.preventDefault()
        let actor_type = $("#actor-type").val()
        if (actor_type.length > 0) {
            channel.push("new_actor", {"name": actor_type})
                .receive("ok", resp => {
                    success("Actor type created: " + actor_type)
                    console.log("Resp:", resp)
                    start_actor(actor_type)
                })
                .receive("error", resp => {
                    error("Unable to create new actor. Reason: " + resp['reason'])
                    console.log("Unable to create actor type: [" + actor_type + "]. Error: ", resp)
                })
        } else {
            console.log("Actor type empty")
        }
        ACTIVE = false;
    }
})
