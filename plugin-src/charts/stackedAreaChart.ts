import { ChartBounds } from "../../types";
import { createLineWithFill } from './utilities';

export const createStackedAreaChart = (
  chartBounds: ChartBounds,
  data: (string | number)[][],
  colors: RGB[],
  lineSmoothing: boolean,
  strokeWeight: number
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-stacked-area-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
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

  const stackedSeries = series.map((s, i) => {
    const stackedValues = s.values.map((v, idx) => {
      const belowTotal = series.slice(0, i).reduce((sum, prev) => sum + prev.values[idx], 0);
      return belowTotal + v;
    });
    return {
      name: s.name,
      values: stackedValues,
      base: i === 0
        ? new Array(s.values.length).fill(0)
        : series.slice(0, i).reduce((acc, prev) => acc.map((val, idx) => val + prev.values[idx]), new Array(s.values.length).fill(0))
    };
  });

  const allStackedValues = stackedSeries.flatMap(s => s.values);
  const min = 0; // For stacked charts, we always start from zero
  const max = Math.max(...allStackedValues);

  for (let i = 0; i < stackedSeries.length; i++) {
    const { name, values, base } = stackedSeries[i];

    const categoryFrame = figma.createFrame();
    chartFrame.appendChild(categoryFrame);
    categoryFrame.name = name;
    categoryFrame.resize(chartWidth, chartHeight);
    categoryFrame.fills = [];
    categoryFrame.constraints = { horizontal: "SCALE", vertical: "SCALE" };

    createLineWithFill({
      parent: categoryFrame,
      values: values,
      baseline: base,
      color: colors[i],
      chartWidth,
      chartHeight,
      min,
      max,
      lineSmoothing,
      bottomFill: true, // Always fill for stacked
      strokeWeight
    });
  }

  figma.currentPage.selection = [chartFrame];
};