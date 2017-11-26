import $ from "jquery"
import {sendMessage} from "./send-message"
import {showCode} from "./code-editor"
import channel from "./socket"

let SELECTED = undefined
let MENU_OPENED = false

$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});

$(document).bind("mousedown", e => {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".actor-menu").length > 0) {

        // Hide it
        $(".actor-menu").hide(100);
        $(".background-menu").hide(100);
        MENU_OPENED = false;
    }
});

$(".actor-menu li").click(function (e) {

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
    $(".actor-menu").hide(100);
    MENU_OPENED = false;
});

function open_menu(menu, x, y) {
    $("." + menu).finish().toggle(100).// In the right position (the mouse)
    css({
        top: y + "px",
        left: x + "px"
    })
}

export function show(x, y, d) {
    console.log("Element context menu")
    MENU_OPENED = true;
    // Show contextmenu
    open_menu("actor-menu", x, y);
    SELECTED = d
}

export function show_background_menu(x, y) {
    if (!MENU_OPENED) {
        console.log("Background Menu opened : " + x + " " + y)
        open_menu("background-menu", x, y)
    } else {
        $(".background-menu").hide(100);
    }
}
