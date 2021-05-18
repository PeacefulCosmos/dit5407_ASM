import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import worldmapJson from "../../data/map/world_topomap_mid.json";
import populationCSV from "../../data/econ/population_1960-2019.csv";
import { rgb } from "d3";

export const ECON = () => {
  const [year, setYear] = useState(1960);
  const margin = { top: 50, left: 50, right: 50, bottom: 50 };
  const height = 1080 - margin.top - margin.bottom + 200;
  const width = 2560 - margin.left - margin.right;
  const svgRef = useRef();

  useEffect(async () => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#F6F6F6");

    //projection
    const projection = d3
      .geoEquirectangular()
      .scale(370)
      .translate([width / 2, height / 2]);

    //path
    const path = d3.geoPath().projection(projection);

    //map
    const worldmap = topojson.feature(
      worldmapJson,
      worldmapJson.objects.world_geomap_mid
    ).features;

    //load population
    let population = await d3.csv(populationCSV);
    population.forEach((year) => {
      for (let i = 1960; i <= 2020; i++) {
        year[i] = +year[i];
      }
    });
    console.log(population);

    //color scale
    const myColor = d3
      .scaleLinear()
      .domain([
        d3.min(population.map((e) => e[year])),
        d3.max(population.map((e) => e[year])),
      ])
      .range(["rgb(255,255,255)", "rgb(74,0,0)"]);

    //draw map
    svg
      .selectAll(".country")
      .data(worldmap)
      .join("path")
      .attr("class", "country")
      .attr("d", path);
  }, []);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};
