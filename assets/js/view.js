import * as d3 from "d3"
import * as menu from "./menu"

// Running actors:
let margin = {top: -5, right: -5, bottom: -5, left: -5}
let width = 960 - margin.left - margin.right
let height = 500 - margin.top - margin.bottom
let radius = 20
let color = d3.scaleOrdinal(d3.schemeCategory10);

let svg = d3.select("#app").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "outline: thin solid gray;")   //This will do the job

//set up the simulation
let simulation = d3.forceSimulation()
    .force("charge_force", d3.forceManyBody().strength(-1000))
    .force("x", d3.forceX(width / 2).strength(0.2))
    .force("y", d3.forceY(height / 2).strength(0.2))

let node = svg.append("g").selectAll(".node")

export function render_actors(state) {
    console.log("State")
    console.log(state)
    //draw circles for the links
    node = node.data(state, d => d['pid'])

    // EXIT
    node.exit().remove()

    // NEW + Update
    let new_node = node.enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end))
        .on("contextmenu", (node) => {
            d3.event.preventDefault();

            // Show contextmenu
            menu.show(d3.event.pageX, d3.event.pageY, node)
        })

    new_node.append("circle")
        .attr("r", radius)
        .attr("fill", d => color(d.module))

    new_node.append("title")
        .text(d => "module: " + d.module + "\n" + "pid: " + d.pid)

    new_node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.pid)

    node = node.merge(new_node)

    simulation.nodes(state).on("tick", tickActions)
    simulation.restart()
}

svg.on("contextmenu", function(data, index) {
    d3.event.preventDefault();
    menu.show_background_menu(d3.event.pageX, d3.event.pageY);
});

function tickActions() {
    node.attr("transform", d => {
        return "translate(" +
            Math.max(radius, Math.min(width - radius, d.x)) + "," +
            Math.max(radius, Math.min(height - radius, d.y)) + ")"
    })
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

export function initX(){ return width / 2}
export function initY(){ return height / 2}