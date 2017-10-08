
let state = init_state()

export function init_state() {
    return {"actor_types": [], "numActors": 0, "actors": {}, "event_log": []}
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
            state["actors"][a.pid] = {"module": module, "started": a.ts, "idx": next_idx(state) }
        })
    })
}

export function actor_started(pid, module, ts) {
    state["actors"][pid] = {"module": module, "started": ts, "idx": next_idx(state) }
}

export function actor_stopped(pid) {
    delete state["actors"][pid]
}

export function push_event(ev) {
    state["event_log"].push(ev)
}

export function get_state() {
    return state
}
