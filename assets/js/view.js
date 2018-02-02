import * as d3 from "d3"
import * as menu from "./menu"

// Running actors:
let margin = {top: -5, right: -5, bottom: -5, left: -5};
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;
let radius = 20;
let color = d3.scaleOrdinal(d3.schemeCategory10);

let svg = d3.select("#app").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "outline: thin solid gray;");   //This will do the job

let node = svg.append("g").selectAll(".node");
let link = svg.append("g").selectAll(".line");

//set up the simulation
let simulation = d3.forceSimulation()
    .force("charge_force", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink().id(d => d.pid).distance(100))
    .force("x", d3.forceX(width / 2).strength(0.2))
    .force("y", d3.forceY(height / 2).strength(0.2));

function render_nodes(state) {
    simulation.nodes(state).on("tick", tickActions);
    node = node.data(state, d => d['pid']);
    node.exit().remove();

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
        });

    new_node.append("circle")
        .attr("r", radius)
        .attr("fill", d => color(d.module));

    new_node.append("title")
        .text(d => "module: " + d.module + "\n" + "pid: " + d.pid);

    new_node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.pid);

    node = node.merge(new_node);
}

function render_links(state) {
    simulation.force("link").links(state);

    link = link.data(state);
    link.exit().remove();

    let new_link = link.enter().append("line").attr("class", "link")

    new_link.append("title")
        .text(d => d.msg);

    new_link.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.msg);

    link = link.merge(new_link);
}

export function render(state) {
    console.log("State");
    console.log(state);

    render_links(messages_to_links(state['messages']));
    render_nodes(state['actors']);

    simulation.restart()
}

svg.on("contextmenu", function (data, index) {
    d3.event.preventDefault();
    menu.show_background_menu(d3.event.pageX, d3.event.pageY);
});

function tickActions() {
    node.attr("transform", d => {
        return "translate(" +
            Math.max(radius, Math.min(width - radius, d.x)) + "," +
            Math.max(radius, Math.min(height - radius, d.y)) + ")"
    });

    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
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
let events = d3.select("#app").append("ul").attr("class", "collection");

export function render_events(state) {
    events.selectAll("li")
        .data(state)
        .enter().append("li")
        .attr("class", "collection-item")
        .attr("style", "white-space: nowrap;")
        .html(e => JSON.stringify(e))
}

export function initX() {
    return width / 2
}

export function initY() {
    return height / 2
}

const concat = (x, y) =>
    x.concat(y);

const flatMap = (f, xs) =>
    xs.map(f).reduce(concat, []);

function messages_to_links(messages) {
    return flatMap(from => {
        return Object.keys(messages[from]).map(to => {
            return {source: from, target: to, msg: messages[from][to]}
        })
    }, Object.keys(messages))
}