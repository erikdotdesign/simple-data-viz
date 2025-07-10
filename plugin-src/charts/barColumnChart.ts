import { ChartDatum, ChartBounds } from "../../types";
import { createBar } from "./utilities";

export const createBarColumnChart = (
  chartBounds: ChartBounds,
  data: ChartDatum[],
  isColumn: boolean,
  colors: {
    positive: RGB[],
    negative: RGB[]
  },
  sizeRatio: number,
  cornerRadius: number
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = "NONE";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;
  
  const values = data.map(d => d[1]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);

  const totalSlots = data.length;
  const fullAxisSize = isColumn ? chartWidth : chartHeight;
  const slotSize = fullAxisSize / totalSlots;

  const barSize = slotSize * sizeRatio;
  const barSpacing = slotSize * (1 - sizeRatio);

  for (let i = 0; i < data.length; i++) {
    const value = data[i][1];
    const isNegativeValue = value < 0;
    const color = isNegativeValue ? colors.negative[0] : colors.positive[0];
    const posAlongAxis = i * slotSize + barSpacing / 2;

    createBar({
      parent: chartFrame,
      name: `bar-${i + 1}`,
      chartWidth,
      chartHeight,
      posAlongAxis,
      min,
      max,
      barSize,
      value,
      color,
      isColumn,
      cornerRadius
    });
  }

  figma.currentPage.selection = [chartFrame];
};