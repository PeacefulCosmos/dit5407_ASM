export const MAX_YEAR = 2019;
export const MIN_YEAR = 1960;

export const yearLegend = () => {
  let legend = [];
  for (let i = MIN_YEAR; i <= MAX_YEAR; i++) {
    legend.push(i);
  }
  return legend;
};
