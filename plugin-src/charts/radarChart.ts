import { ChartBounds } from "../../types";

export const createRadarChart = (
  chartBounds: ChartBounds,
  data: (string | number)[][],
  colors: RGB[],
  strokeWeight: number
) => {
  const chartWidth = chartBounds.width;
  const chartHeight = chartBounds.height;
  const dimensionCount = data.length > 0 ? data.length : 0;
  const radius = Math.min(chartWidth, chartHeight) / 2;
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;

  const allValues = data.flatMap(row =>
    row.slice(1).map(val => {
      const num = parseFloat(val as string);
      return isFinite(num) ? num : 0;
    })
  );

  const maxValue = Math.max(...allValues, 1);

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-radar-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = chartBounds.x;
  chartFrame.y = chartBounds.y;

  // Create the grid rings

  const ringCount = 5;

  const gridRingNodes: VectorNode[] = [];

  for (let r = 1; r <= ringCount; r++) {
    const ratio = r / ringCount;
    
    const points = Array.from({ length: dimensionCount }, (_, i) => {
      const angle = (Math.PI * 2 * i) / dimensionCount - Math.PI / 2;
      const length = ratio * radius;
      const x = centerX + length * Math.cos(angle);
      const y = centerY + length * Math.sin(angle);
      return `${x.toFixed(2)} ${y.toFixed(2)}`;
    });

    const ringPath = `M ${points.join(" L ")} Z`;

    const ring = figma.createVector();
    chartFrame.appendChild(ring);
    ring.name = `grid-ring-${r}`;
    ring.vectorPaths = [{
      windingRule: "NONZERO",
      data: ringPath
    }];
    ring.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.15 }];
    ring.strokeWeight = strokeWeight;
    ring.fills = [];
    ring.constraints = { horizontal: "SCALE", vertical: "SCALE" };
    gridRingNodes.push(ring);
  }

  const gridRingsGroup = figma.group(gridRingNodes, chartFrame);
  gridRingsGroup.name = "grid-rings";

  // Create the series vectors

  const seriesList: number[][] = Array.from(
    { length: data[0].length - 1 },
    (_, i) => data.map(row => Number(row[i + 1]))
  );

  for (let i = 0; i < seriesList.length; i++) {
    const data = seriesList[i];
    const dimensionCount = data.length;
    if (dimensionCount < 3) continue; // Need at least a triangle

    const points = data.map((value, i) => {
      const safeValue = isFinite(value) ? value : 0;
      const angle = (Math.PI * 2 * i) / dimensionCount - Math.PI / 2;
      const length = (safeValue / maxValue) * radius;
      const x = centerX + length * Math.cos(angle);
      const y = centerY + length * Math.sin(angle);
      return {
        x: x.toFixed(2),
        y: y.toFixed(2),
      }
    });

    const pathData = `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")} Z`;

    const shape = figma.createVector();
    chartFrame.appendChild(shape);
    shape.name = `series-${i + 1}`;
    shape.vectorPaths = [{
      windingRule: "NONZERO",
      data: pathData
    }];
    shape.strokes = [{ type: "SOLID", color: colors[i] }];
    shape.strokeWeight = strokeWeight;
    shape.fills = [{ type: "SOLID", color: colors[i], opacity: 0.15 }];
    shape.strokeJoin = "ROUND";
    shape.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }

  figma.currentPage.selection = [chartFrame];
};