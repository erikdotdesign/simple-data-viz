import { ChartDatum } from "../types";

export const createLineChart = (data: ChartDatum[], color: RGB) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = "data-viz--line-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const max = Math.max(...data.map(d => d[1]));
  const min = Math.min(...data.map(d => d[1]));

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d[1] - min) / (max - min)) * chartHeight;
    return { x, y };
  });

  const path = `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`;

  const vector = figma.createVector();
  vector.vectorPaths = [{
    data: path,
    windingRule: "NONZERO"
  }];
  vector.strokes = [{ type: 'SOLID', color }];
  vector.strokeWeight = 4;

  chartFrame.appendChild(vector);
};