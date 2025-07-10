import { ChartBounds } from "../../types";

export const createStackedBarColumnChart = (
  chartBounds: ChartBounds,
  data: (string | number)[][],
  isColumn: boolean,
  colors: {
    positive: RGB[],
    negative: RGB[]
  },
  sizeRatio: number,
  cornerRadius: number,
  isPercentStacked: boolean = false
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-stacked-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = "NONE";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;

  const normalizedData = isPercentStacked
    ? data.map(([label, ...values]) => {
        const total = (values as number[]).reduce((sum, v) => sum + Math.abs(Number(v)), 0) || 1;
        const normalized = values.map(v => (Number(v) / total) * 100);
        return [label, ...normalized];
      })
    : data;

  // Determine total positive and negative stack extents
  const stackExtents = data.map(d => {
    const values = d.slice(1) as number[];
    return {
      pos: values.filter(v => v > 0).reduce((sum, v) => sum + v, 0),
      neg: values.filter(v => v < 0).reduce((sum, v) => sum + v, 0)
    };
  });

  const maxPos = isPercentStacked ? 100 : Math.max(...stackExtents.map(e => e.pos), 0);
  const minNeg = isPercentStacked ? 0 : Math.min(...stackExtents.map(e => e.neg), 0);
  const totalRange = maxPos - minNeg || 1;

  const fullAxisSize = isColumn ? chartWidth : chartHeight;
  const totalSlots = normalizedData.length;
  const slotSize = fullAxisSize / totalSlots;
  const barSize = slotSize * sizeRatio;
  const barSpacing = slotSize * (1 - sizeRatio);

  for (let i = 0; i < normalizedData.length; i++) {
    const [label, ...stack] = normalizedData[i];
    const posAlongAxis = i * slotSize + barSpacing / 2;

    let posStack = 0;
    let negStack = 0;

    const stackNodes: RectangleNode[] = [];

    for (let j = 0; j < stack.length; j++) {
      const value = Number(stack[j]);
      const isNegative = value < 0;
      const color = isNegative ? colors.negative[j] : colors.positive[j];
      const isFirst = j === 0;
      const isLast = j === stack.length - 1;

      const from = isNegative ? negStack : posStack;
      const to = from + value;

      // Normalize to [0, 1]
      const fromRatio = (from - minNeg) / totalRange;
      const toRatio = (to - minNeg) / totalRange;

      // Ensure top and bottom are correctly ordered
      const topRatio = Math.min(fromRatio, toRatio);
      const bottomRatio = Math.max(fromRatio, toRatio);

      const bar = figma.createRectangle();
      chartFrame.appendChild(bar);
      bar.name = `series-${j + 1}`;
      if (isColumn) {
        const barHeight = chartHeight * (bottomRatio - topRatio);
        bar.x = posAlongAxis;
        bar.y = chartHeight - (chartHeight * bottomRatio);
        bar.resize(barSize, barHeight);
      } else {
        bar.x = chartWidth * topRatio;
        bar.y = posAlongAxis;
        bar.resize(chartWidth * (bottomRatio - topRatio), barSize);
      }
      bar.fills = [{ type: 'SOLID', color }];
      if (isColumn) {
        if (isFirst && !isNegative || isLast && isNegative) {
          bar.bottomLeftRadius = cornerRadius;
          bar.bottomRightRadius = cornerRadius;
        }
        if (isLast && !isNegative || isFirst && isNegative) {
          bar.topLeftRadius = cornerRadius;
          bar.topRightRadius = cornerRadius;
        }
      } else {
        if (isFirst && !isNegative || isLast && isNegative) {
          bar.topLeftRadius = cornerRadius;
          bar.bottomLeftRadius = cornerRadius;
        }
        if (isLast && !isNegative || isFirst && isNegative) {
          bar.topRightRadius = cornerRadius;
          bar.bottomRightRadius = cornerRadius;
        }
      }
      bar.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };

      // Update cumulative stack
      if (isNegative) {
        negStack = to;
      } else {
        posStack = to;
      }

      stackNodes.push(bar);
    }

    const stackGroup = figma.group(stackNodes, chartFrame);
    stackGroup.name = `category-${i + 1}`;
  }

  figma.currentPage.selection = [chartFrame];
};