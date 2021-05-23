import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { MAX_YEAR, MIN_YEAR, yearLegend } from "./model/yearLegend";
import * as ECONServ from "./service/ECON.service";
import worldmapJson from "../../data/map/world_topomap_mid.json";
import populationCSV from "../../data/econ/population_1960-2019.csv";
import { drawColorLegend } from "./components/populationLegend";
import { countryList } from "./model/countryList";
import * as perCapitaComponent from "./components/perCapita";
import { Slider } from "@material-ui/core";
import { CAPITA } from "./components/CAPITA";

export const ECON = () => {
  const [year, setYear] = useState(d3.max(yearLegend()));
  const [countries, setCountries] = useState([]);
  const margin = { top: 50, left: 50, right: 50, bottom: 50 };
  const height = 760 - margin.top - margin.bottom + 400;
  const width = 2160 - margin.left - margin.right;
  const worldMapRef = useRef();
  const perCapitalLineChartRef = useRef();

  //sliber mark
  const sliberMark = () => {
    const mark = [];
    yearLegend().forEach((year) => {
      if (year % 10 === 0) {
        mark.push({ value: year, label: year.toString() });
      }
    });
    return mark;
  };

  //slider onChange event
  const changeMapYear = async (e, number) => {
    setYear(number);
  };

  useEffect(async () => {
    d3.selectAll();
    //load countries
    setCountries(await countryList());

    //load population
    let population = await ECONServ.populationStringToInt(populationCSV);

    //map population into worldmap data
    const worldMapData = await ECONServ.populationMap(population, worldmapJson);
    // console.log(worldMapData);

    //init svg
    const worldMapSVG = d3
      .select(worldMapRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#F6F6F6");

    //projection
    const projection = d3
      .geoEquirectangular()
      .scale(300)
      .translate([width / 2, height / 2]);

    //path
    const path = d3.geoPath().projection(projection);

    //map
    const worldmap = topojson.feature(
      worldMapData,
      worldMapData.objects.world_geomap_mid
    ).features;

    //color scale
    const myColor = d3
      .scaleLinear()
      .domain([10000, 1400000000])
      .range(["rgb(252, 233, 232)", "rgb(94, 2, 0)"])
      .interpolate(d3.interpolateLab);

    //color legend

    //fill color
    const fillColor = (d) => {
      let color;
      if (d.properties.population[year]) {
        color = myColor(d.properties.population[year]);
      } else {
        color = "black";
      }
      return color;
    };

    //tooltip div
    const tooltipDiv = (position, d) => {
      d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("left", `${position[0] + 5}px`)
        .style("top", `${position[1] - 35}px`)
        .style("position", "absolute")
        .style("z-index", 1001)
        .style("text-align", "center")
        .style("border-radius", "8px")
        .style("padding", "10px 10px 10px 10px")
        .style("background-color", "white")
        .style("font-weight", "bold")
        .style("font", "20px")
        .html(
          `${d.properties.name}: ${
            d.properties.population[year] ?? "no infomation from world bank"
          }`
        );
    };

    const bodyNode = d3.select("body").node();

    //draw title
    worldMapSVG
      .select(".title")
      // .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", margin.top + 20)
      .attr("text-anchor", "middle")
      .style("position", "absolute")
      .style("font", "40px sans-serif")
      .style("font-weight", "bold")
      .text(`World Population`);

    //draw map
    worldMapSVG
      .selectAll(".country")
      .data(worldmap)
      .join("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("stroke", "black")
      .attr("fill", (d) => fillColor(d))
      .on("mousemove", (e, d) => {
        d3.selectAll(".tooltip").remove();
        let position = d3.pointer(e, bodyNode);
        tooltipDiv(position, d);
      })
      .on("mouseout", (e, d) => {
        d3.selectAll(".tooltip").remove();
      });

    //draw legend
    drawColorLegend(worldMapSVG);

    //draw line chart
    perCapitaComponent.drawLineChart(perCapitalLineChartRef);
  }, [year]);

  return (
    <div>
      <div>
        <svg ref={worldMapRef}>
          <text className="title"></text>
        </svg>
        <Slider
          defaultValue={MAX_YEAR}
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          valueLabelDisplay="on"
          marks={sliberMark()}
          onChange={changeMapYear}
          style={{ width: "1000px" }}
        />
      </div>
      <CAPITA countries={countries} />
    </div>
  );
};
