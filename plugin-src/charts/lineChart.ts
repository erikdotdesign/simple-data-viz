import { ChartDatum } from "../types";
import { createLineWithFill } from './utilities';

export const createLineChart = (
  data: ChartDatum[],
  color: RGB,
  lineSmoothing = false,
  bottomFill = false
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-line-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const max = Math.max(...data.map(d => d[1]));
  const min = Math.min(...data.map(d => d[1]));

  createLineWithFill({
    parent: chartFrame,
    values: data.map(d => d[1] as number),
    color: color,
    chartWidth,
    chartHeight,
    min,
    max,
    lineSmoothing,
    bottomFill
  });
};