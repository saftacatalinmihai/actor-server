import * as m from "./model";

export function handle_event(e) {
    e = fix_event_ts(e)
    console.log(e)
    m.push_event(e)

    switch (e.ev_type) {
        case "actor_started":
            m.actor_started(e.pid, e.module, e.ts)
            break
        case "actor_stopped":
            m.actor_stopped(e.pid)
            break
        case "message_sent":
            m.message_sent(e.pid, e.to_pid, e.msg)
            break
    }
}

export function fix_event_ts(e){
    e.ts = new Date(parseInt(e.ts))
    return e
}