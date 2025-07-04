import { generateTintShadeScale } from "./helpers";

figma.showUI(__html__, { width: 300, height: 300 });

type ChartDatum = [label: string, value: number];

figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate-chart") {
    const colors = generateTintShadeScale(msg.chart.color, msg.chart.data.length);
    switch (msg.chart.type) {
      case "bar":
      case "column":
        await createBarOrColumnChart(msg.chart.headers, msg.chart.data, msg.chart.type === "column", colors);
        break;
      case "pie":
        await createPieChart(msg.chart.headers, msg.chart.data, colors);
        break;
    }
  }
};

const createBarOrColumnChart = async (headers: string[], data: ChartDatum[], isVertical: boolean, colors: RGB[]) => {
  // Inter Regular is the font that objects will be created with by default in
  // Figma. We need to wait for fonts to load before creating text using them.
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const chartWidth = 800;
  const chartHeight = 600;

  // Outer frame
  const chartFrame = figma.createFrame();
  chartFrame.name = "data-viz--bar-chart";
  chartFrame.layoutMode = "HORIZONTAL"; // Arrange bars side-by-side
  chartFrame.primaryAxisSizingMode = "FIXED";
  chartFrame.counterAxisSizingMode = "FIXED";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  chartFrame.strokeWeight = 2;
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.paddingTop = 24;
  chartFrame.paddingBottom = 24;
  chartFrame.paddingLeft = 24;
  chartFrame.paddingRight = 24;

  // Center in viewport
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  // Inner frame
  const innerFrame = figma.createFrame();
  chartFrame.appendChild(innerFrame);
  innerFrame.name = "bars"
  innerFrame.layoutMode = isVertical ? "VERTICAL" : "HORIZONTAL";
  innerFrame.layoutSizingVertical = "FILL";
  innerFrame.layoutSizingHorizontal = "FILL";
  innerFrame.layoutPositioning = "AUTO";
  innerFrame.layoutWrap = "NO_WRAP";
  innerFrame.itemSpacing = ((isVertical ?  chartHeight : chartWidth) / data.length) * 0.5;

  const min = data.reduce((a, b) => Math.min(a, b[1]), 0)
  const max = data.reduce((a, b) => Math.max(a, b[1]), 0)

  for (let i = 0; i < data.length; i++) {
    const label = data[i][0];
    const value = data[i][1];

    const barFrame = figma.createFrame();
    innerFrame.appendChild(barFrame);
    barFrame.layoutMode = "VERTICAL";
    barFrame.layoutSizingVertical = "FILL";
    barFrame.layoutSizingHorizontal = "FILL";
    barFrame.primaryAxisAlignItems = "MAX";
    barFrame.counterAxisAlignItems = "CENTER";
    barFrame.name = label;


    // Bar (Rectangle)
    const bar = figma.createRectangle();
    const normalized = (value - min) / (max - min);
    barFrame.appendChild(bar);
    bar.name = "bar";
    bar.layoutSizingVertical = "FILL";
    bar.layoutSizingHorizontal = "FILL";
    bar.fills = [{
      type: "GRADIENT_LINEAR",
      gradientTransform: isVertical ? [[1, 0, 0], [0, 1, 0]] : [[0, -1, 1], [1,  0, 0]],
      gradientStops: [
        {
          position: 0,
          color: { r: colors[i].r, g: colors[i].g, b: colors[i].b , a: 1}
        },
        {
          position: normalized,
          color: { r: colors[i].r, g: colors[i].g, b: colors[i].b , a: 1}
        },
        {
          position: normalized,
          color: { r: 1, g: 0, b: 0, a: 0 }
        },
        {
          position: 1,
          color: { r: 1, g: 0, b: 0, a: 0 }
        }
      ]
    }];
  }
}

export const createPieChart = async (headers: string[], data: ChartDatum[], colors: RGB[]) => {
  // Inter Regular is the font that objects will be created with by default in
  // Figma. We need to wait for fonts to load before creating text using them.
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const chartWidth = 800;
  const chartHeight = 600;

  // Outer frame
  const chartFrame = figma.createFrame();
  chartFrame.name = "data-viz--pie-chart";
  chartFrame.layoutMode = "HORIZONTAL"; // Arrange bars side-by-side
  chartFrame.primaryAxisSizingMode = "FIXED";
  chartFrame.counterAxisSizingMode = "FIXED";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  chartFrame.strokeWeight = 2;
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.paddingTop = 24;
  chartFrame.paddingBottom = 24;
  chartFrame.paddingLeft = 24;
  chartFrame.paddingRight = 24;

  // Center in viewport
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  // Inner frame
  const innerFrame = figma.createFrame();
  chartFrame.appendChild(innerFrame);
  innerFrame.name = "inner-frame"
  innerFrame.layoutMode = "HORIZONTAL";
  innerFrame.layoutSizingVertical = "FILL";
  innerFrame.layoutSizingHorizontal = "FILL";
  innerFrame.layoutPositioning = "AUTO";
  innerFrame.primaryAxisAlignItems = "CENTER";
  innerFrame.counterAxisAlignItems = "CENTER";
  innerFrame.layoutWrap = "NO_WRAP";

  // Pie frame
  const pieFrame = figma.createFrame();
  const pieSize = (innerFrame.width > innerFrame.height ? innerFrame.height : innerFrame.width) * 0.5;
  innerFrame.appendChild(pieFrame);
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
}