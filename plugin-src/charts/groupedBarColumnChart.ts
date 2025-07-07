import { createBar } from "./utilities";

export const createGroupedBarColumnChart = (
  data: (string | number)[][],
  isColumn: boolean,
  colors: {
    positive: RGB[],
    negative: RGB[]
  },
  cornerRadius: number,
  barSpacingRatio: number
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-grouped-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = "NONE";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const values = data.flatMap(d => d.slice(1) as number[]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);

  const groupCount = data.length;
  const seriesCount = data[0].length - 1;
  const groupSize = (isColumn ? chartWidth : chartHeight) / (2 * groupCount - 1);
  const groupSpacing = groupSize;
  const totalBarSpacing = (seriesCount - 1) * barSpacingRatio;
  const barSize = groupSize / (seriesCount + totalBarSpacing);
  const barSpacing = barSize * barSpacingRatio;
  
  for (let i = 0; i < data.length; i++) {
    const category = data[i][0] as string;
    const values = data[i].slice(1) as number[];

    const nodes: RectangleNode[] = [];

    for (let j = 0; j < values.length; j++) {
      const value = values[j];
      const isNegativeValue = value < 0;
      const color = isNegativeValue ? colors.negative[j] : colors.positive[j];

      const posAlongAxis = (i * groupSize) + (i * groupSpacing) + (j * barSize) + (j * barSpacing);
      
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
      
      nodes.push(bar);
    }

    const barGroup = figma.group(nodes, chartFrame);
    barGroup.name = "bar-group";
  }
};