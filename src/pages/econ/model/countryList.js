import csvData from "../../../data/econ/gdp_pcap_1960-2019.csv";
import * as d3 from "d3";
export const countryList = async () => {
  const countries = [];
  const data = await d3.csv(csvData);
  data.forEach((e) => {
    countries.push({ label: e["Country Name"], value: e["Country Code"] });
  });
  return countries;
};
