import * as v from "./view"

let state = init_state()

export function init_state() {
    return {"actor_types": [], "numActors": 0, "actors": [], "event_log": []}
}

export function next_idx() {
    state["numActors"] = state["numActors"] + 1
    return state["numActors"]
}

export function set_actor_types(actor_types) {
    state["actor_types"] = actor_types
}

export function set_running_actors(running_actors) {
    Object.entries(running_actors).forEach(([module, actors]) => {
        actors.forEach(a => {
            state["actors"].push({"pid": a.pid, "module": module, "started": a.ts, "idx": next_idx(state) })
        })
    })
    v.render_actors(state["actors"])
}

export function actor_started(pid, module, ts) {
    state["actors"].push({"pid": pid, "module": module, "started": ts, "idx": next_idx(state),
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
