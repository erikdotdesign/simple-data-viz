import { ChartDatum } from "../../types";

export const createScatterChart = (
  data: ChartDatum[], 
  color: RGB,
  pointRadiusRatio: number
) => {
  const chartWidth = 800;
  const chartHeight = 600;
  const baseDimension = Math.min(chartWidth, chartHeight);
  const pointRadius = baseDimension * pointRadiusRatio;
  const padding = pointRadius;

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-scatter-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const maxX = Math.max(...data.map(d => parseFloat(d[0])));
  const minX = Math.min(...data.map(d => parseFloat(d[0])));
  const maxY = Math.max(...data.map(d => d[1]));
  const minY = Math.min(...data.map(d => d[1]));

  const plotWidth = chartWidth - padding * 2;
  const plotHeight = chartHeight - padding * 2;

  for (let i = 0; i < data.length; i++) {
    const [xLabel, yVal] = data[i];
    const x = parseFloat(xLabel);

    const normX = (x - minX) / (maxX - minX);
    const normY = (yVal - minY) / (maxY - minY);

    const cx = padding + normX * plotWidth;
    const cy = padding + (1 - normY) * plotHeight; // Invert Y so higher values are higher up

    const dot = figma.createEllipse();
    chartFrame.appendChild(dot);
    dot.resize(pointRadius * 2, pointRadius * 2);
    dot.x = cx - pointRadius;
    dot.y = cy - pointRadius;
    dot.fills = [{ type: 'SOLID', color }];
    dot.name = "point";
    dot.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
  }
};