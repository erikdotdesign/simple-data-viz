import { ChartDatum, ChartBounds } from "../../types";

export const createPieDonutChart = (
  chartBounds: ChartBounds,
  data: ChartDatum[], 
  colors: RGB[],
  isDonut: boolean,
  donutRadiusRatio: number = 0.5
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  // Outer frame
  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-${isDonut ? "donut" : "pie"}-chart`;
  chartFrame.layoutMode = "HORIZONTAL";
  chartFrame.primaryAxisAlignItems = "CENTER";
  chartFrame.counterAxisAlignItems = "CENTER";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;

  // Pie frame
  const pieFrame = figma.createFrame();
  const pieSize = chartFrame.width > chartFrame.height ? chartFrame.height : chartFrame.width;
  const equalSize = chartFrame.width === chartFrame.height;
  chartFrame.appendChild(pieFrame);
  pieFrame.name = `${isDonut ? "donut" : "pie"}-frame`;
  pieFrame.fills = [];
  pieFrame.layoutMode = "NONE";
  pieFrame.layoutSizingHorizontal = equalSize ? "FILL" : chartFrame.width > chartFrame.height ? "FIXED" : "FILL";
  pieFrame.layoutSizingVertical = equalSize ? "FILL" : chartFrame.height > chartFrame.width ? "FIXED" : "FILL";
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
    ellipse.name = `category-${i + 1}`;
    ellipse.resizeWithoutConstraints(pieFrame.width, pieFrame.height);
    ellipse.fills = [{ type: 'SOLID', color: color }];
    ellipse.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    ellipse.arcData = {
      startingAngle: (start / total - 0.25) * 2 * Math.PI,
      endingAngle: ((start + num) / total - 0.25) * 2 * Math.PI,
      innerRadius: 0,
    };
    if (isDonut) {
      const munchkinSize = pieSize * donutRadiusRatio;
      const inner = figma.createEllipse();
      pieFrame.appendChild(inner);
      inner.resize(munchkinSize, munchkinSize);
      inner.x = (pieSize - munchkinSize) / 2;
      inner.y = (pieSize - munchkinSize) / 2;
      const boolNode = figma.subtract([ellipse, inner], pieFrame);
      const flattenedNode = figma.flatten([boolNode]);
      flattenedNode.fills = [{ type: 'SOLID', color: color }];
      flattenedNode.name = `category-${i + 1}`;
      flattenedNode.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    }
    start += num;
  }

  figma.currentPage.selection = [chartFrame];
};