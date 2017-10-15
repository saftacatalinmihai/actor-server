
import * as d3 from "d3";

// Running actors:
let margin = {top: -5, right: -5, bottom: -5, left: -5}
let width = 960 - margin.left - margin.right
let height = 500 - margin.top - margin.bottom

let color = d3.scaleOrdinal(d3.schemeCategory10);

let svg = d3.select("#app").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

//set up the simulation
let simulation = d3.forceSimulation()
    .force("charge_force", d3.forceManyBody().strength(-10))
    .force("center_force", d3.forceCenter(width / 2, height / 2))


let node = svg.append("g")
    .selectAll("circle")

export function render_actors(state) {
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
        .attr("fill", d => color(d.module))
        .call(d3.drag()
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end))

    new_node.append("title")
        .text(d => "module: " + d.module + "\n" + "pid: " + d.pid)

    node = node.merge(new_node)

    simulation.nodes(state).on("tick", tickActions )
    simulation.restart()
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
