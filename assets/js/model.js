import * as v from "./view"

let state = init_state()

export function init_state() {
    return {"actor_types": [], "numActors": 0, "actors": [], "event_log": [], "messages": []}
}

export function set_actor_types(actor_types) {
    state["actor_types"] = actor_types
}

export function set_running_actors(running_actors) {
    Object.entries(running_actors).forEach(([module, actors]) => {
        actors.forEach(a => {
            state["actors"].push({"pid": a.pid, "module": module, "started": a.ts })
        })
    })
    v.render_actors(state["actors"])
}

export function actor_started(pid, module, ts) {
    state["actors"].push({"pid": pid, "module": module, "started": ts,
        "x": v.initX(), "y": v.initY()
    })
    v.render_actors(state["actors"])
}

export function actor_stopped(pid) {
    state["actors"] = state["actors"].filter(a => {
        return a.pid !== pid
    })
    v.render_actors(state["actors"])
}

export function push_event(ev) {
    state["event_log"].push(ev)
    v.render_events(state["event_log"])
}

export function message_sent(from, to, msg) {
    let messages = state['messages']
    if (from in actor_pids(state)) {
        let messages_from
        if (from in messages) {
            messages_from = messages[from]
        } else {
            messages[from] = {}
            messages_from = messages[from]
        }
        messages_from[to] = msg
    }
    console.log(state)
}

function actor_pids(state) {
    return state['actors'].map(a => a.pid)
}