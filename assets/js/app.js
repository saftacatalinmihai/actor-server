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
import * as ev from "./event-handler"

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

channel.push("get_events")
    .receive("ok", resp => {
        console.log("Got events:", resp)
        resp.events.forEach(e => m.push_event(ev.fix_event_ts(e)))
    })
    .receive("error", resp => {
        console.log("Unable to get events", resp)
    })

channel.on("event", ev.handle_event)
