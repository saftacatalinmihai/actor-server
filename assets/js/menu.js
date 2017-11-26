import $ from "jquery"
import {sendMessage} from "./send-message"
import {showCode} from "./code-editor"
import channel from "./socket"

let SELECTED = undefined

$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});

$(document).bind("mousedown", e => {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {

        // Hide it
        $(".custom-menu").hide(100);
    }
});

$(".custom-menu li").click(function (e) {

    // This is the triggered action name
    switch ($(this).attr("data-action")) {

        // A case for each action. Your actions here
        case "show-code":
            console.log(SELECTED)
            showCode(SELECTED.module)
            break;
        case "send-message":
            sendMessage(SELECTED.pid)
            break;
        case "stop":
            channel.push("stop_actor", {"pid": SELECTED.pid})
                .receive("ok", resp => {
                    console.log("Resp:", resp)
                })
                .receive("error", resp => {
                    console.log("Unable to stop actor: [" + SELECTED.pid + "]. Error: ", resp)
                })
            break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});

export function show(x, y, d) {

    // Show contextmenu
    $(".custom-menu").finish().toggle(100).// In the right position (the mouse)
    css({
        top: y + "px",
        left: x + "px"
    })
    SELECTED = d
}
