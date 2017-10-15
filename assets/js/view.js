
import * as d3 from "d3";

// Running actors:
let width = window.innerWidth, height = window.innerHeight
let svg = d3.select("#app").append("svg")
    .attr("width", width)
    .attr("height", height)

let state = []

//set up the simulation
let simulation = d3.forceSimulation()
    .force("charge_force", d3.forceManyBody())
    .force("center_force", d3.forceCenter(width / 2, height / 2))


let node = svg.append("g")
    .selectAll("circle")

function render_actors() {
    console.log("State")
    console.log(state)

    //draw circles for the links
    node = node.data(state)

    // EXIT
    node.exit().remove()

    // NEW + Update
    let new_node = node.enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("r", 10)
        .attr("fill", "blue")
        .call(d3.drag()
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end))

    new_node.append("title")
        .text(d => "module: " + d.module + "\n" + "pid: " + d.pid)

    node = node.merge(new_node)

    simulation.nodes(state).on("tick", tickActions )
    simulation.restart();
}

export function init(s) {
    state = s["actors"].map(d => {return {"pid": d.pid, "module": d.module}})
    render_actors()
}
export function render_actor_started(pid, module) {
    console.log("Pushing")
    console.log(pid)
    console.log(module)
    state.push({"pid": pid, "module": module})
    render_actors()
}

export function render_actor_stopped(pid) {
    state = state.filter(a => {
        return a.pid !== pid
    })
    render_actors()
}

function tickActions() {
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function drag_start(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function drag_drag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function drag_end(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Event log:
let events = d3.select("#app").append("div")

export function render_events(state) {
    events.selectAll("p")
        .data(state)
        .enter().append("p")
        .attr("style", "white-space: nowrap;")
        .html(e => JSON.stringify(e))
}
