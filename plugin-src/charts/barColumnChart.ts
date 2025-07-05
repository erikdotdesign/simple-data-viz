import { ChartDatum } from "../types";

export const createBarColumnChart = (
  headers: string[],
  data: ChartDatum[],
  isColumn: boolean,
  colors: RGB[],
  includeBarValues: boolean = false,
) => {
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

    let barValueSpace = 0;

    if (includeBarValues) {
      const barValue = figma.createText();
      barValueSpace = 24;
      barFrame.appendChild(barValue);
      barValue.characters = value.toString();
      barValue.fontSize = 12;
      barValue.name = "label";
      barValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      barValue.layoutSizingVertical = isColumn ? "FIXED" : "FILL";
      barValue.layoutSizingHorizontal = isColumn ? "FILL" : "FIXED";
      barValue.textAlignHorizontal = isColumn ? "CENTER" : "LEFT"
      barValue.textAlignVertical = isColumn ? "BOTTOM" : "CENTER";
      barValue.resize(
        isColumn ? barFrame.width : barValueSpace,
        isColumn ? barValueSpace : barFrame.height
      );
    }

    const normalized = (value - min) / (max - min);

    const barLength = isColumn
      ? normalized * (chartHeight - barValueSpace)
      : normalized * (chartWidth - barValueSpace);

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