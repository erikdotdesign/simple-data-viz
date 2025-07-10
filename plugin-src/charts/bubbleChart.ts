import { ChartDatum, ChartBounds } from "../../types";

export const createBubbleChart = (
  chartBounds: ChartBounds,
  data: number[],
  color: RGB,
  maxBubbleRadiusRatio: number  // max radius as ratio of smallest chart dimension
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;
  const baseDimension = Math.min(chartWidth, chartHeight);
  const maxBubbleRadius = baseDimension * maxBubbleRadiusRatio;
  const padding = maxBubbleRadius;

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-bubble-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;

  const maxX = Math.max(...data.map(d => parseFloat(d[0])));
  const minX = Math.min(...data.map(d => parseFloat(d[0])));
  const maxY = Math.max(...data.map(d => d[1]));
  const minY = Math.min(...data.map(d => d[1]));
  const maxSize = Math.max(...data.map(d => d[2]));
  const minSize = Math.min(...data.map(d => d[2]));

  const plotWidth = chartWidth - padding * 2;
  const plotHeight = chartHeight - padding * 2;

  for (let i = 0; i < data.length; i++) {
    const [xLabel, yVal, sizeVal] = data[i];
    const x = parseFloat(xLabel);
    const size = sizeVal;

    // Normalize X and Y to [0, 1]
    const normX = (x - minX) / (maxX - minX);
    const normY = (yVal - minY) / (maxY - minY);

    // Normalize size to [0, 1]
    const normSize = (size - minSize) / (maxSize - minSize);

    const cx = padding + normX * plotWidth;
    const cy = padding + (1 - normY) * plotHeight; // Invert Y

    // Calculate radius scaled by normalized size and maxBubbleRadius
    const radius = Math.max(2, normSize * maxBubbleRadius); // min radius 2 for visibility

    const bubble = figma.createEllipse();
    chartFrame.appendChild(bubble);
    bubble.resize(radius * 2, radius * 2);
    bubble.x = cx - radius;
    bubble.y = cy - radius;
    bubble.fills = [{ type: 'SOLID', color }];
    bubble.name = `bubble-${i + 1}`;
    bubble.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
  }

  figma.currentPage.selection = [chartFrame];
};