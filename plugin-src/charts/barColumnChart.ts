import { ChartDatum } from "../../types";
import { createBar } from "./utilities";

export const createBarColumnChart = (
  data: ChartDatum[],
  isColumn: boolean,
  colors: {
    positive: RGB[],
    negative: RGB[]
  },
  sizeRatio: number,
  cornerRadius: number,
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = "NONE";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;
  
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
};