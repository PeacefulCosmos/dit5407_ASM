import { useEffect, useRef, useState } from "react";
import { TextField } from "@material-ui/core";
import * as ECONServ from "../service/ECON.service";
import { MAX_YEAR, MIN_YEAR, yearLegend } from "../model/yearLegend";
import "./css/capita.css";
import * as d3 from "d3";

export const CAPITA = ({ countries }) => {
  const [countriesState, setCountriesState] = useState([]);
  const [choice1, setChoice1] = useState("AUS");
  const [choice2, setChoice2] = useState("AFG");
  const svgRef = useRef();
  const margin = { top: 100, left: 100, right: 100, bottom: 100 };
  const height = 800;
  const width = 800;

  //year legend
  const years = yearLegend();

  const handleChangeChoice1 = (event) => {
    setChoice1(event.target.value);
  };
  const handleChangeChoice2 = (event) => {
    setChoice2(event.target.value);
  };

  const getChoiceData = (dataSet, choice) => {
    let data = {};
    dataSet.forEach((e) => {
      if (e.code === choice) {
        data = e;
      }
    });
    return data;
  };

  useEffect(async () => {
    d3.select(".chart_group").remove();
    setCountriesState(countries);

    //load data
    const data = await ECONServ.loadPerCapitaData();

    const choice1Data = getChoiceData(data, choice1);
    const choice2Data = getChoiceData(data, choice2);

    const maxValue1 = d3.max(choice1Data.perCapita, (d) => d.value);
    const maxValue2 = d3.max(choice2Data.perCapita, (d) => d.value);

    const maxValue = maxValue1 > maxValue2 ? maxValue1 : maxValue2;

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(years, (d) => {
          return new Date(`${d}-01-01`);
        })
      )
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([height - margin.bottom, margin.top]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#F6F6F6")
      .style("z-index", -1000)
      .append("g")
      .attr("class", "chart_group")
      .attr("transform", `translate(0,0)`);

    //x axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    //y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    svg
      .append("text")
      // .attr("transform", `transition(${(margin.left, margin.top)})`)
      .attr("x", margin.left + 80)
      .attr("y", margin.top / 1.5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(`GDP per capita ( US$)`);

    // Add the line
    const line1 = svg
      .append("path")
      .datum(choice1Data.perCapita)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(new Date(d.year));
          })
          .y(function (d) {
            return y(d.value);
          })
      );

    const line2 = svg
      .append("path")
      .datum(choice2Data.perCapita)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(new Date(d.year));
          })
          .y(function (d) {
            return y(d.value);
          })
      );

    //country legend
    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", height - margin.bottom / 2)
      .style("fill", "steelblue")
      .text(choice1Data.name);

    svg
      .append("text")
      .attr("x", width - 350)
      .attr("y", height - margin.bottom / 2)
      .style("fill", "red")
      .text(choice2Data.name);
  }, [countries, choice1, choice2]);

  return (
    <div className="capita">
      <h1>GDP per Capita Comparison</h1>
      {countriesState && (
        <TextField
          select
          label="Counrty 1"
          value={choice1}
          onChange={handleChangeChoice1}
          InputLabelProps={{ shrink: true }}
          helperText="Please select a country"
          variant="outlined"
          SelectProps={{
            native: true,
          }}
        >
          {countriesState.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      )}
      {countriesState && (
        <TextField
          select
          label="Counrty 2"
          value={choice2}
          onChange={handleChangeChoice2}
          InputLabelProps={{ shrink: true }}
          helperText="Please select a country"
          variant="outlined"
          SelectProps={{
            native: true,
          }}
        >
          {countriesState.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      )}
      <svg ref={svgRef}></svg>
    </div>
  );
};
