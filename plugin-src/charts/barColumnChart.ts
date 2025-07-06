import { ChartDatum } from "../types";

export const createBarColumnChart = (
  data: ChartDatum[],
  isColumn: boolean,
  colors: RGB[],
  cornerRadius: number = 0
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = isColumn ? "HORIZONTAL" : "VERTICAL";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.itemSpacing = isColumn
  ? chartWidth / ((data.length * 2) - 1)
  : chartHeight / ((data.length * 2) - 1);

  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;
  
  const values = data.map(d => d[1]);
  const min = Math.min(...values, 0); // min could be negative
  const max = Math.max(...values, 0); // max could be positive
  const totalRange = max - min;
  const availableLength = isColumn ? chartHeight : chartWidth;
  const maxPositiveBarLength = (max / totalRange) * availableLength;
  const maxNegativeBarLength = (Math.abs(min) / totalRange) * availableLength;

  // Positive values only
  const positiveValues = values.filter(v => v > 0);
  const positiveMax = Math.max(...positiveValues, 0);

  // Negative values only
  const negativeValues = values.filter(v => v < 0);
  const negativeMax = Math.abs(Math.min(...negativeValues, 0));

  for (let i = 0; i < data.length; i++) {
    const label = data[i][0];
    const rawValue = data[i][1];
    const absValue = Math.abs(rawValue);
    const isNegativeValue = rawValue < 0;
    const normalized = absValue / (isNegativeValue ? negativeMax : positiveMax);
    const maxBarLength = isNegativeValue ? maxNegativeBarLength : maxPositiveBarLength;

    const barLength = normalized * maxBarLength;

    const axisFrame = figma.createFrame();
    chartFrame.appendChild(axisFrame);
    axisFrame.name = "axis-frame";
    axisFrame.layoutMode = isColumn ? "VERTICAL" : "HORIZONTAL";
    axisFrame.layoutSizingHorizontal = "FILL";
    axisFrame.layoutSizingVertical = "FILL";
    axisFrame.primaryAxisAlignItems = isColumn ? (isNegativeValue ? "MAX" : "MIN") : (isNegativeValue ? "MIN" : "MAX");
    axisFrame.counterAxisAlignItems = "CENTER";

    const barFrame = figma.createFrame();
    axisFrame.appendChild(barFrame);
    barFrame.name = "bar-frame";
    barFrame.layoutMode = isColumn ? "VERTICAL" : "HORIZONTAL";
    barFrame.layoutSizingHorizontal = "FILL";
    barFrame.layoutSizingVertical = "FILL";
    barFrame.primaryAxisAlignItems = isColumn ? (isNegativeValue ? "MIN" : "MAX") : (isNegativeValue ? "MAX" : "MIN");
    barFrame.counterAxisAlignItems = "CENTER";
    barFrame.resize(
      isColumn ? barFrame.width : maxBarLength,
      isColumn ? maxBarLength : barFrame.height
    );
    
    const bar = figma.createRectangle();
    barFrame.appendChild(bar);
    bar.name = "bar";
    bar.layoutSizingVertical = isColumn ? "FIXED" : "FILL";
    bar.layoutSizingHorizontal = isColumn ? "FILL" : "FIXED";
    bar.cornerRadius = cornerRadius;
    bar.resize(
      isColumn ? barFrame.width : barLength,
      isColumn ? barLength : barFrame.height
    );
    bar.fills = [{
      type: 'SOLID',
      color: colors[i]
    }];
  }
};