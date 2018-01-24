import "phoenix_html"
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

// channel.push("get_running_actors")
//     .receive("ok", resp => {
//         console.log("Got running actors:", resp)
//         m.set_running_actors(resp.actors)
//     })
//     .receive("error", resp => {
//         console.log("Unable to get running actors", resp)
//     })

channel.push("get_events")
    .receive("ok", resp => {
        let reverse_evs = resp.events.reverse()
        console.log("Got events:", reverse_evs)
        reverse_evs.forEach(ev.handle_event)
    })
    .receive("error", resp => {
        console.log("Unable to get events", resp)
    })

channel.on("event", ev.handle_event)
