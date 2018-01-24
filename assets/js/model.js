import * as v from "./view"

let state = init_state();

export function init_state() {
    return {"actor_types": [], "numActors": 0, "actors": [], "event_log": [], "messages": []}
}

export function set_actor_types(actor_types) {
    state["actor_types"] = actor_types
}

// Polyfill
if (!Object.entries)
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };

export function set_running_actors(running_actors) {
    Object.entries(running_actors).forEach(([module, actors]) => {
        actors.forEach(a => {
            state["actors"].push({"pid": a.pid, "module": module, "started": a.ts})
        })
    });
    v.render(state)
}

export function actor_started(pid, module, ts) {
    state["actors"].push({
        "pid": pid, "module": module, "started": ts,
        "x": v.initX(), "y": v.initY()
    });
    v.render(state)
}

export function actor_stopped(pid) {
    state["actors"] = state["actors"].filter(a => {
        return a.pid !== pid
    });
    v.render(state)
}

export function push_event(ev) {
    state["event_log"].push(ev);
    v.render_events(state["event_log"])
}

export function message_sent(from, to, msg) {
    let messages = state['messages'];

    let actorPids = actor_pids(state);
    if (actorPids.indexOf(from) >= 0 && actorPids.indexOf(to) >= 0) {
        let messages_from;
        if (messages.indexOf(from) >= 0) {
            messages_from = messages[from]
        } else {
            messages[from] = {};
            messages_from = messages[from]
        }
        messages_from[to] = msg
    }
    state['messages'] = messages
    v.render(state)
}


function actor_pids(state) {
    return state['actors'].map(a => a.pid)
}