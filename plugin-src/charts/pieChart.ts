import { ChartDatum } from "../types";

export const createPieChart = (data: ChartDatum[], colors: RGB[]) => {
  const chartWidth = 800;
  const chartHeight = 600;

  // Outer frame
  const chartFrame = figma.createFrame();
  chartFrame.name = "data-viz--pie-chart";
  chartFrame.layoutMode = "HORIZONTAL";
  chartFrame.primaryAxisAlignItems = "CENTER";
  chartFrame.counterAxisAlignItems = "CENTER";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  // Pie frame
  const pieFrame = figma.createFrame();
  const pieSize = (chartFrame.width > chartFrame.height ? chartFrame.height : chartFrame.width) * 0.5;
  chartFrame.appendChild(pieFrame);
  pieFrame.name = "pie-frame";
  pieFrame.layoutMode = "NONE";
  pieFrame.resize(pieSize, pieSize);
  pieFrame.lockAspectRatio();


  data = data.map(d => [d[0], Math.max(0, d[1])]);
  const total = data.reduce((a, b) => a + b[1], 0);
  let start = 0;

  for (let i = 0; i < data.length; i++) {
    const label = data[i][0];
    const num = data[i][1];
    const color = { r: colors[i].r, g: colors[i].g, b: colors[i].b };
    const ellipse = figma.createEllipse();
    pieFrame.appendChild(ellipse);
    ellipse.name = label;
    ellipse.resizeWithoutConstraints(pieFrame.width, pieFrame.height);
    ellipse.fills = [{ type: 'SOLID', color: color }];
    ellipse.constraints = {horizontal: 'SCALE', vertical: 'SCALE'};
    ellipse.arcData = {
      startingAngle: (start / total - 0.25) * 2 * Math.PI,
      endingAngle: ((start + num) / total - 0.25) * 2 * Math.PI,
      innerRadius: 0,
    };
    start += num;
  }
};