import { ChartDatum } from "../../types";
import { createBar } from "./utilities";

export const createBarColumnChart = (
  data: ChartDatum[],
  isColumn: boolean,
  colors: {
    positive: RGB[],
    negative: RGB[]
  },
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
    const rawValue = data[i][1];
    const absValue = Math.abs(rawValue);
    const isNegativeValue = rawValue < 0;
    const normalized = absValue / (isNegativeValue ? negativeMax : positiveMax);
    const maxBarLength = isNegativeValue ? maxNegativeBarLength : maxPositiveBarLength;
    const mid = Math.floor((isNegativeValue ? colors.negative.length : colors.positive.length) / 2);
    const color = isNegativeValue ? colors.negative[mid] : colors.positive[mid];

    const barLength = normalized * maxBarLength;

    createBar({
      parent: chartFrame,
      isColumn,
      isNegativeValue,
      barLength,
      maxBarLength,
      cornerRadius,
      color
    });
  }
};