
import * as d3 from "d3";

export function render(state) {
    render_actors(state["actors"])
    render_events(state["event_log"])
}

// Running actors:
let width = window.innerWidth, height = window.innerHeight

let svg = d3.select("#app").append("svg")
    .attr("width", width)
    .attr("height", height)
let nodePadding = 10;

let color = d3.scaleOrdinal(d3.schemeCategory20);

let simulation = d3.forceSimulation()
    .force("forceX", d3.forceX().strength(.1).x(width/2))
    .force("forceY", d3.forceY().strength(.1).y(height/2))
    .force("center", d3.forceCenter().x(width/2).y(height/2))
    .force("charge", d3.forceManyBody().strength(-15))

function render_actors(state) {
    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(state)

    node.enter().append("circle")
        .attr("r", 10)
        .attr("fill", d => color(d.pid))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("x-pid", d => d.pid)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    node.attr("cx", d => d.x)
        .attr("cy", d => d.y)

    node.exit().remove()

    simulation
        .nodes(state)
        .force("forceX", d3.forceX().strength(.1).x(width/2))
        .force("forceY", d3.forceY().strength(.1).y(height/2))
        .force("center", d3.forceCenter().x(width/2).y(height/2))
        .force("charge", d3.forceManyBody().strength(-15))
        .force("collide", d3.forceCollide().strength(2).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
        .on("tick", ticked)

    function ticked() {
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Event log:
let events = d3.select("#app").append("div")

function render_events(state) {
    events.selectAll("p")
        .data(state)
        .enter().append("p")
        .attr("style", "white-space: nowrap;")
        .html(e => JSON.stringify(e))
}
