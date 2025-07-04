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
      case "line":
        await createLineChart(msg.chart.headers, msg.chart.data, colors);
        break;
      case "scatter":
        await createScatterChart(msg.chart.headers, msg.chart.data, colors);
        break;
    }
  }
};

const createBarOrColumnChart = async (
  headers: string[],
  data: ChartDatum[],
  isColumn: boolean,
  colors: RGB[],
  includeBarValues: boolean = true,
) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = "data-viz--bar-chart";
  chartFrame.layoutMode = isColumn ? "HORIZONTAL" : "VERTICAL";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.itemSpacing = ((isColumn ?  chartWidth : chartHeight) / data.length) * 0.5;

  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const min = data.reduce((a, b) => Math.min(a, b[1]), 0);
  const max = data.reduce((a, b) => Math.max(a, b[1]), 0);

  for (let i = 0; i < data.length; i++) {
    const label = data[i][0];
    const value = data[i][1];

    const barFrame = figma.createFrame();
    chartFrame.appendChild(barFrame);
    barFrame.name = label;
    barFrame.layoutMode = isColumn ? "VERTICAL" : "HORIZONTAL";
    barFrame.layoutSizingHorizontal = "FILL";
    barFrame.layoutSizingVertical = "FILL";
    barFrame.primaryAxisAlignItems = isColumn ? "MAX" : "MIN";
    barFrame.counterAxisAlignItems = "CENTER";

    let labelSpace = 0;

    if (includeBarValues) {
      const text = figma.createText();
      labelSpace = 24;
      barFrame.appendChild(text);
      text.characters = value.toString();
      text.fontSize = 12;
      text.name = "label";
      text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      text.layoutSizingVertical = isColumn ? "FIXED" : "FILL";
      text.layoutSizingHorizontal = isColumn ? "FILL" : "FIXED";
      text.textAlignHorizontal = isColumn ? "CENTER" : "LEFT"
      text.textAlignVertical = isColumn ? "BOTTOM" : "CENTER";
      text.resize(
        isColumn ? barFrame.width : labelSpace,
        isColumn ? labelSpace : barFrame.height
      );
    }

    const normalized = (value - min) / (max - min);

    const barLength = isColumn
      ? normalized * (chartHeight - labelSpace)
      : normalized * (chartWidth - labelSpace);

    const bar = figma.createRectangle();
    barFrame.appendChild(bar);
    bar.name = "bar";
    bar.layoutSizingVertical = isColumn ? "FIXED" : "FILL";
    bar.layoutSizingHorizontal = isColumn ? "FILL" : "FIXED";
    bar.resize(
      isColumn ? barFrame.width : barLength,
      isColumn ? barLength : barFrame.height
    );
    bar.fills = [{
      type: 'SOLID',
      color: colors[i]
    }];

    // insert bar before text (if bar chart)
    if (!isColumn && includeBarValues) {
      barFrame.insertChild(0, bar);
    }
  }
};

export const createPieChart = async (headers: string[], data: ChartDatum[], colors: RGB[]) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

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

const createLineChart = async (headers: string[], data: ChartDatum[], colors: RGB[]) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

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
  vector.strokes = [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }];
  vector.strokeWeight = 4;

  chartFrame.appendChild(vector);
};

const createScatterChart = async (headers: string[], data: ChartDatum[], colors: RGB[]) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const chartWidth = 800;
  const chartHeight = 600;
  const pointRadius = 4;
  const padding = pointRadius;

  const chartFrame = figma.createFrame();
  chartFrame.name = "data-viz--scatter-plot";
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
    dot.resize(pointRadius * 2, pointRadius * 2);
    dot.x = cx - pointRadius;
    dot.y = cy - pointRadius;
    dot.fills = [{ type: 'SOLID', color: colors[i] }];
    dot.name = `point-${i}`;
    chartFrame.appendChild(dot);
  }
};


// Gradient bar chart

// const createBarOrColumnChart = async (headers: string[], data: ChartDatum[], isVertical: boolean, colors: RGB[]) => {
//   await figma.loadFontAsync({ family: "Inter", style: "Regular" });

//   const chartWidth = 800;
//   const chartHeight = 600;

//   // Outer frame
//   const chartFrame = figma.createFrame();
//   chartFrame.name = "data-viz--bar-chart";
//   chartFrame.layoutMode = isVertical ? "VERTICAL" : "HORIZONTAL";
//   chartFrame.resize(chartWidth, chartHeight);
//   chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
//   chartFrame.itemSpacing = ((isVertical ?  chartHeight : chartWidth) / data.length) * 0.5;

//   // Center in viewport
//   chartFrame.x = figma.viewport.center.x - chartWidth / 2;
//   chartFrame.y = figma.viewport.center.y - chartHeight / 2;

//   const min = data.reduce((a, b) => Math.min(a, b[1]), 0)
//   const max = data.reduce((a, b) => Math.max(a, b[1]), 0)

//   for (let i = 0; i < data.length; i++) {
//     const label = data[i][0];
//     const value = data[i][1];

//     const barFrame = figma.createFrame();
//     chartFrame.appendChild(barFrame);
//     barFrame.layoutMode = "VERTICAL";
//     barFrame.layoutSizingVertical = "FILL";
//     barFrame.layoutSizingHorizontal = "FILL";
//     barFrame.primaryAxisAlignItems = "MAX";
//     barFrame.counterAxisAlignItems = "CENTER";
//     barFrame.name = label;


//     // Bar (Rectangle)
//     const bar = figma.createRectangle();
//     const normalized = (value - min) / (max - min);
//     barFrame.appendChild(bar);
//     bar.name = "bar";
//     bar.layoutSizingVertical = "FILL";
//     bar.layoutSizingHorizontal = "FILL";
//     bar.fills = [{
//       type: "GRADIENT_LINEAR",
//       gradientTransform: isVertical ? [[1, 0, 0], [0, 1, 0]] : [[0, -1, 1], [1,  0, 0]],
//       gradientStops: [
//         {
//           position: 0,
//           color: { r: colors[i].r, g: colors[i].g, b: colors[i].b , a: 1}
//         },
//         {
//           position: normalized,
//           color: { r: colors[i].r, g: colors[i].g, b: colors[i].b , a: 1}
//         },
//         {
//           position: normalized,
//           color: { r: 1, g: 0, b: 0, a: 0 }
//         },
//         {
//           position: 1,
//           color: { r: 1, g: 0, b: 0, a: 0 }
//         }
//       ]
//     }];
//   }
// }