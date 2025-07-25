import { ChartBounds } from "../../types";
import { createLineWithFill } from './utilities';

export const createAreaChart = (
  chartBounds: ChartBounds,
  data: (string | number)[][],
  isMultiLine: boolean,
  colors: RGB[],
  lineSmoothing: boolean,
  strokeWeight: number
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-${isMultiLine ? "multi-line" : "area"}-chart`;
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;

  const parseAreaChartData = (data: (string | number | null)[][]) => {
    const clean = data.filter(row => row.length > 1 && row[0] != null);

    const labels = clean.map(row => row[0] as string);
    const seriesCount = clean[0].length - 1;

    const series = Array.from({ length: seriesCount }, (_, i) => ({
      name: `Series ${i + 1}`,
      values: clean.map(row => row[i + 1] as number)
    }));

    return { labels, series };
  };

  const { labels, series } = parseAreaChartData(data);

  const values = series.flatMap(s => s.values);
  const min = Math.min(...values);
  const max = Math.max(...values);

  for (let i = 0; i < series.length; i++) {
    const { name, values } = series[i];

    const categoryFrame = figma.createFrame();
    chartFrame.appendChild(categoryFrame);
    categoryFrame.name = `series-${i + 1}`;
    categoryFrame.resize(chartWidth, chartHeight);
    categoryFrame.fills = [];
    categoryFrame.constraints = { horizontal: "SCALE", vertical: "SCALE" };

    createLineWithFill({
      parent: categoryFrame,
      values: values,
      color: colors[i],
      chartWidth,
      chartHeight,
      min,
      max,
      lineSmoothing,
      bottomFill: !isMultiLine,
      strokeWeight
    });
  }

  figma.currentPage.selection = [chartFrame];
};