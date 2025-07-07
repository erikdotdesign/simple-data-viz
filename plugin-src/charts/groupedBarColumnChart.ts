import { createBar } from "./utilities";

export const createGroupedBarColumnChart = (
  data: (string | number)[][],
  isColumn: boolean,
  colors: RGB[],
  cornerRadius: number = 0
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-grouped-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = isColumn ? "HORIZONTAL" : "VERTICAL";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.itemSpacing = isColumn
  ? chartWidth / ((data.length * 2) - 1)
  : chartHeight / ((data.length * 2) - 1);

  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const values = data.flatMap(d => d.slice(1) as number[]);
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
    const category = data[i][0] as string;
    const values = data[i].slice(1) as number[];

    // Frame per category
    const groupFrame = figma.createFrame();
    chartFrame.appendChild(groupFrame);
    groupFrame.name = category;
    groupFrame.layoutMode = isColumn ? "HORIZONTAL" : "VERTICAL";
    groupFrame.layoutSizingHorizontal = "FILL";
    groupFrame.layoutSizingVertical = "FILL";

    for (let j = 0; j < values.length; j++) {
      const rawValue = values[j];
      const absValue = Math.abs(rawValue);
      const isNegativeValue = rawValue < 0;
      const normalized = absValue / (isNegativeValue ? negativeMax : positiveMax);
      const maxBarLength = isNegativeValue ? maxNegativeBarLength : maxPositiveBarLength;

      const barLength = normalized * maxBarLength;

      createBar({
        parent: groupFrame,
        isColumn,
        isNegativeValue,
        barLength,
        maxBarLength,
        cornerRadius,
        color: colors[j]
      });
    }
  }
};