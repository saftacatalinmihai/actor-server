
import * as d3 from "d3";

let scale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500])

let svg = d3.select("body").append("svg")
    .attr("width", 1000)
    .attr("height", 20)

let events = d3.select("body").append("div")

export function render(state) {
    render_actors(state["actors"])
    render_events(state["event_log"])
}
function render_actors(state) {
    let rects = svg.selectAll("rect").data(d3.entries(state))

    rects.enter().append("rect")
        .attr("x", e => scale(e.value.idx))
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)

    rects.attr("x", e => scale(e.value.idx))
    rects.exit().remove()
}

function render_events(state) {
    events.selectAll("p")
        .data(state)
        .enter().append("p")
        .attr("style", "white-space: nowrap;")
        .html(e => JSON.stringify(e))
}
