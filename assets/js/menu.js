import $ from "jquery"
import {sendMessage} from "./send-message";

let selected = undefined

$(document).ready(function(){
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

$(".custom-menu li").click( function (e) {

    // This is the triggered action name
    switch ($(this).attr("data-action")) {

        // A case for each action. Your actions here
        case "show-code":
            alert("show-code");
            break;
        case "send-message":
            sendMessage(selected.pid)
            break;
        case "stop":
            alert("stop");
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
    selected = d
}
