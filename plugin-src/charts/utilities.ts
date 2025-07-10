import { Point } from "../../types";

export const getLinearPath = (pts: { x: number; y: number }[]) =>
  `M ${pts.map(p => `${p.x} ${p.y}`).join(" L ")}`;

export const getSmoothedPath = (pts: { x: number; y: number }[]) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const xc = ((curr.x + next.x) / 2).toFixed(2);
    const yc = ((curr.y + next.y) / 2).toFixed(2);
    const cpx = curr.x.toFixed(2);
    const cpy = curr.y.toFixed(2);
    d += ` Q ${cpx} ${cpy} ${xc} ${yc}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
};

export const getFilledPath = (
  valuePoints: { x: number; y: number }[],
  basePoints?: { x: number; y: number }[],
  smooth = false,
  smoothBase = smooth
): string => {
  if (valuePoints.length < 2) return "";

  const fallbackY = Math.max(...valuePoints.map(v => v.y)) + 20;
  const bottom = (basePoints !== undefined && basePoints !== null)
    ? basePoints
    : valuePoints.map(p => ({ x: p.x, y: fallbackY }));
  const reversed = [...bottom].reverse();

  let d = `M ${valuePoints[0].x} ${valuePoints[0].y}`;

  // TOP LINE
  if (smooth) {
    for (let i = 1; i < valuePoints.length - 1; i++) {
      const curr = valuePoints[i];
      const next = valuePoints[i + 1];
      const xc = (curr.x + next.x) / 2;
      const yc = (curr.y + next.y) / 2;
      d += ` Q ${curr.x} ${curr.y} ${xc} ${yc}`;
    }
    const last = valuePoints[valuePoints.length - 1];
    d += ` L ${last.x} ${last.y}`; // sharp end
  } else {
    d += valuePoints.slice(1).map(p => ` L ${p.x} ${p.y}`).join("");
  }

  // BOTTOM LINE
  if (smoothBase && reversed.length >= 2) {
    d += ` L ${reversed[0].x} ${reversed[0].y}`; // sharp corner at end of area
    for (let i = 1; i < reversed.length - 1; i++) {
      const curr = reversed[i];
      const next = reversed[i + 1];
      const xc = (curr.x + next.x) / 2;
      const yc = (curr.y + next.y) / 2;
      d += ` Q ${curr.x} ${curr.y} ${xc} ${yc}`;
    }
    const last = reversed[reversed.length - 1];
    d += ` L ${last.x} ${last.y}`; // sharp start
  } else {
    d += reversed.map(p => ` L ${p.x} ${p.y}`).join("");
  }

  d += " Z";
  return d;
};

export const createLineWithFill = (options: {
  parent: FrameNode;
  name?: string;
  values: number[];
  baseline?: number[];
  color: RGB;
  chartWidth: number;
  chartHeight: number;
  min: number;
  max: number;
  lineSmoothing: boolean;
  bottomFill: boolean;
  strokeWeight: number;
}) => {
  const {
    parent,
    name,
    values,
    baseline,
    color,
    chartWidth,
    chartHeight,
    min,
    max,
    lineSmoothing,
    bottomFill,
    strokeWeight
  } = options;

  const valuePoints: Point[] = values.map((d, i) => {
    const x = (i / (values.length - 1)) * chartWidth;
    const y = chartHeight - ((d - min) / (max - min)) * chartHeight;
    return {
      x: Number.isFinite(x) ? +x.toFixed(2) : 0,
      y: Number.isFinite(y) ? +y.toFixed(2) : 0,
    };
  });

  const basePoints: Point[] = baseline
    ? baseline.map((d, i) => {
        const x = (i / (baseline.length - 1)) * chartWidth;
        const y = chartHeight - ((d - min) / (max - min)) * chartHeight;
        return {
          x: Number.isFinite(x) ? +x.toFixed(2) : 0,
          y: Number.isFinite(y) ? +y.toFixed(2) : 0,
        };
      })
    : valuePoints.map((p) => ({ x: p.x, y: chartHeight }));

  if (bottomFill) {
    const fill = figma.createVector();
    parent.appendChild(fill);
    fill.name = "fill";
    fill.vectorPaths = [{
      data: getFilledPath(valuePoints, basePoints, lineSmoothing),
      windingRule: "NONZERO"
    }];
    fill.fills = [{ type: 'SOLID', color, opacity: 0.2 }];
    fill.constraints = { horizontal: "SCALE", vertical: "SCALE" };
    fill.strokes = [];
  }

  const line = figma.createVector();
  parent.appendChild(line);
  line.name = name ? name : "line";
  line.vectorPaths = [{
    data: lineSmoothing ? getSmoothedPath(valuePoints) : getLinearPath(valuePoints),
    windingRule: "NONZERO"
  }];
  line.strokes = [{ type: 'SOLID', color }];
  line.strokeWeight = strokeWeight;
  line.constraints = { horizontal: "SCALE", vertical: "SCALE" };
};

export const createBar = (options: {
  parent: FrameNode;
  chartWidth: number;
  chartHeight: number;
  value: number;
  min: number;
  max: number;
  posAlongAxis: number;
  barSize: number;
  name?: string;
  isColumn: boolean;
  cornerRadius: number;
  color: RGB;
}): RectangleNode => {
  const {
    parent,
    isColumn,
    chartWidth,
    chartHeight,
    value,
    min,
    max,
    name,
    posAlongAxis,
    barSize,
    cornerRadius,
    color,
  } = options;

  let left, right, top, bottom;

  if (isColumn) {
    left = posAlongAxis;
    right = left + barSize;
    top = chartHeight - chartHeight * (Math.max(0, value) - min) / (max - min);
    bottom = chartHeight - chartHeight * (Math.min(0, value) - min) / (max - min);
  } else {
    top = posAlongAxis;
    bottom = top + barSize;
    left = chartWidth * (Math.min(0, value) - min) / (max - min);
    right = chartWidth * (Math.max(0, value) - min) / (max - min);
  }

  const bar = figma.createRectangle();
  parent.appendChild(bar);
  bar.name = name ? name : "bar";
  bar.x = left;
  bar.y = top;
  bar.resize(right - left, bottom - top);
  bar.fills = [{ type: 'SOLID', color }];
  bar.cornerRadius = cornerRadius;
  bar.constraints = {horizontal: 'SCALE', vertical: 'SCALE'};
  
  return bar;
};