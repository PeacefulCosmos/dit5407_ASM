import * as d3 from "d3";
import perCapitaCSV from "../../../data/econ/gdp_pcap_1960-2019.csv";

const margin = { top: 20, left: 20, right: 20, bottom: 20 };
const height = 800 - margin.top - margin.bottom;
const width = 800 - margin.left - margin.right;

export const drawLineChart = async (svgRef, choice1, choice2) => {
  const svg = d3
    .select(svgRef.current)
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#F6F6F6");

  svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const perCapitaData = await d3.csv(perCapitaCSV);
  console.log(perCapitaData);
};
