import { ChartBounds } from "../../types";

export const createCandlestickChart = (
  chartBounds: ChartBounds,
  data: (string | number)[][],
  colors: {
    positive: RGB[],
    negative: RGB[]
  },
  sizeRatio: number,
  cornerRadius: number,
  strokeWeight: number
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;

  const chartFrame = figma.createFrame();
  chartFrame.name = `sdv-candlestick-chart`;
  chartFrame.layoutMode = "NONE";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;
  
  const values = data.flatMap(d => d.slice(1) as number[]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const valueRange = max - min || 1;

  const totalSlots = data.length;
  const slotSize = chartWidth / totalSlots;

  const barSize = slotSize * sizeRatio;
  const barSpacing = slotSize * (1 - sizeRatio);

  for (let i = 0; i < data.length; i++) {
    const [label, open, high, low, close] = data[i] as [string, number, number, number, number];
    const isPositive = close >= open;
    const color = isPositive ? colors.positive[0] : colors.negative[0];

    const scale = (v: number) => {
      const norm = (v - min) / valueRange;
      return chartHeight * (1 - norm);
    };

    const lowPos = scale(low);
    const highPos = scale(high);
    const openPos = scale(open);
    const closePos = scale(close);

    const x = i * slotSize + barSpacing / 2;
    const y = Math.min(openPos, closePos);
    const width = barSize;
    const height = Math.abs(closePos - openPos);

    const candlestickNodes: (RectangleNode | LineNode)[] = [];

    // Candle body
    const candle = figma.createRectangle();
    chartFrame.appendChild(candle);
    candle.name = "body";
    candle.resize(width, height);
    candle.cornerRadius = cornerRadius;
    candle.fills = [{ type: 'SOLID', color }];
    candle.x = x;
    candle.y = y;
    candle.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };

    candlestickNodes.push(candle);

    // Wick (thin line)
    const wickWidth = strokeWeight;
    const wickHeight = scale(low) - scale(high);
    const wick = figma.createRectangle();
    chartFrame.appendChild(wick);
    wick.name = "shadow";
    wick.resize(wickWidth, wickHeight);
    wick.fills = [{ type: 'SOLID', color }];
    wick.x = x + (width - wickWidth) / 2;
    wick.y = scale(high);
    wick.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };

    candlestickNodes.push(wick);

    const candlestickGroup = figma.group(candlestickNodes, chartFrame);
    candlestickGroup.name = `candle-${i + 1}`;
  }

  figma.currentPage.selection = [chartFrame];
};