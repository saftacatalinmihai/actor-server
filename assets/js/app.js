// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import channel from "./socket"
import * as m from "./model"

channel.push("get_actors")
    .receive("ok", resp => {
        console.log("Got actors:", resp)
        m.set_actor_types(resp.actors)
    })
    .receive("error", resp => {
        console.log("Unable to get actors", resp)
    })

channel.push("get_running_actors")
    .receive("ok", resp => {
        console.log("Got running actors:", resp)
        m.set_running_actors(resp.actors)
    })
    .receive("error", resp => {
        console.log("Unable to get running actors", resp)
    })

channel.on("event", handle_event)

function handle_event(e) {
    e.ts = new Date(parseInt(e.ts))
    console.log(e)
    m.push_event(e)

    switch (e.ev_type) {
        case "actor_started":
            m.actor_started(e.pid, e.module, e.ts)
            break
        case "actor_stopped":
            m.actor_stopped(e.pid)
            break
    }
}
