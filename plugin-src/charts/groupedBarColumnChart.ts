import { ChartBounds } from "../../types";
import { createBar } from "./utilities";

export const createGroupedBarColumnChart = (
  chartBounds: ChartBounds,
  data: (string | number)[][],
  isColumn: boolean,
  colors: {
    positive: RGB[],
    negative: RGB[]
  },
  sizeRatio: number,
  barSpacingRatio: number,
  cornerRadius: number
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-grouped-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = "NONE";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;

  const values = data.flatMap(d => d.slice(1) as number[]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);

  const groupCount = data.length;
  const seriesCount = data[0].length - 1;
  const axisSize = isColumn ? chartWidth : chartHeight;

  // === 1. Apply sizeRatio to group slot ===
  const groupSlotSize = axisSize / groupCount;
  const groupSize = groupSlotSize * sizeRatio;
  const groupMargin = groupSlotSize * (1 - sizeRatio) / 2;

  // === 2. Handle bar sizing and spacing within group ===
  const totalBarSpacing = (seriesCount - 1) * barSpacingRatio;
  const barSize = groupSize / (seriesCount + totalBarSpacing);
  const barSpacing = barSize * barSpacingRatio;
  
  for (let i = 0; i < data.length; i++) {
    const category = data[i][0] as string;
    const values = data[i].slice(1) as number[];
    const groupStart = i * groupSlotSize + groupMargin;

    const groupNodes: RectangleNode[] = [];

    for (let j = 0; j < values.length; j++) {
      const value = values[j];
      const isNegativeValue = value < 0;
      const color = isNegativeValue ? colors.negative[j] : colors.positive[j];

      const posInGroup = j * (barSize + barSpacing);
      const posAlongAxis = groupStart + posInGroup;
      
      const bar = createBar({
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
      
      groupNodes.push(bar);
    }

    const barGroup = figma.group(groupNodes, chartFrame);
    barGroup.name = "bar-group";
  }

  figma.currentPage.selection = [chartFrame];
};