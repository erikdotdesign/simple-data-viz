import { ChartDatum, ChartBounds } from "../../types";
import { createLineWithFill } from './utilities';

export const createLineChart = (
  chartBounds: ChartBounds,
  data: ChartDatum[],
  color: RGB,
  lineSmoothing: boolean,
  bottomFill: boolean,
  strokeWeight: number
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-line-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;

  const max = Math.max(...data.map(d => d[1]));
  const min = Math.min(...data.map(d => d[1]));

  createLineWithFill({
    parent: chartFrame,
    values: data.map(d => d[1] as number),
    color,
    chartWidth,
    chartHeight,
    min,
    max,
    lineSmoothing,
    bottomFill,
    strokeWeight
  });
};