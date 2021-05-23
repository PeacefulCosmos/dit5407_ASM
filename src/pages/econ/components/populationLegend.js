import * as d3 from "d3";

const colors = ["rgb(94, 2, 0)", "rgb(252, 233, 232)"];
const height = 500;
const width = 20;

export const drawColorLegend = (svg) => {
  const y = d3.scaleLinear().range([500, 0]).domain([0, 1400000000]);
  d3.selectAll(".legend").remove();
  d3.select(".y-axis").remove();

  const yAxis = d3
    .axisLeft()
    .scale(y)
    .ticks(10)
    .tickFormat((number) => {
      return `${number / 1000000000}`;
    });

  const appendLegend = svg
    .append("svg")
    .attr("class", "legend")
    .attr("width", 100)
    .attr("height", 900);

  const grad = appendLegend
    .append("defs")
    .append("linearGradient")
    .attr("id", "grad")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  grad
    .selectAll("stop")
    .data(colors)
    .enter()
    .append("stop")
    .style("stop-color", function (d) {
      return d;
    })
    .attr("offset", function (d, i) {
      return 100 * (i / (colors.length - 1)) + "%";
    });

  appendLegend
    .append("rect")
    .attr("id", "population-legend")
    .attr("x", 30)
    .attr("y", 60)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "url(#grad)");

  appendLegend
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(30, 60)`)
    .call(yAxis);

  appendLegend
    .append("text")
    .attr("class", "unit")
    .attr("x", -50)
    .attr("y", 30 * 2)
    .attr("transform", "rotate(-90)")
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("z-index", 1)
    .style("position", "absolute")
    .text("billion");

  return appendLegend;
};
