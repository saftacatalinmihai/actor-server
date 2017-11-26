function notify(color, message) {
    Materialize.toast(message, 4000, color)
}

export function error(message) {
    notify("red", message)
}

export function success(message) {
    notify("green", message)
}

export function info(message) {
    notify("gray", message)
}