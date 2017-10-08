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
import * as d3 from "d3";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import channel from "./socket"

let state = {"actor_types":[], "numActors": 0, "actors": {}, "event_log": []}
function next_idx(state) {
    state["numActors"] = state["numActors"] + 1
    return state["numActors"]
}
channel.push("get_actors")
    .receive("ok", resp => {
        console.log("Got actors:", resp)
        state["actor_types"] = resp.actors
    })
    .receive("error", resp => {
        console.log("Unable to get actors", resp)
    })

channel.push("get_running_actors")
    .receive("ok", resp => {
        console.log("Got running actors:", resp)
        Object.entries(resp.actors).forEach(([module, actors]) => {
            actors.forEach(a => {
                state["actors"][a.pid] = {"module": module, "started": a.ts, "idx": next_idx(state) }
            })
        })
        render(state)

    })
    .receive("error", resp => {
        console.log("Unable to get running actors", resp)
    })

channel.on("event", handle_event)

function handle_event(e) {
    e.ts = new Date(parseInt(e.ts))
    console.log(e)
    state["event_log"].push(e)

    switch (e.ev_type) {
        case "actor_started":
            state["actors"][e.pid] = {"module": e.module, "started": e.ts, "idx": next_idx(state) }
            break
        case "actor_stopped":
            delete state["actors"][e.pid]
            break
    }

    render(state)
}

let scale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500])

let svg = d3.select("body").append("svg")
    .attr("width", 1000)
    .attr("height", 20)

let events = d3.select("body").append("div")

function render(state) {
    render_actors(state["actors"])
    render_events(state["event_log"])
}
function render_actors(state) {
    console.log(state)
    let rects = svg.selectAll("rect").data(d3.entries(state))

    rects.enter().append("rect")
        .attr("x", e => scale(e.value.idx))
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)

    rects.attr("x", e => scale(e.value.idx))
    rects.exit().remove()
}

function render_events(state) {
    events.selectAll("p")
        .data(state)
        .enter().append("p")
        .attr("style", "white-space: nowrap;")
        .html(e => JSON.stringify(e))
}
