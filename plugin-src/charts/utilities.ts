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
  pts: { x: number; y: number }[],
  chartHeight: number,
  smooth = false
) => {
  const baselineY = chartHeight;
  if (pts.length < 2) return "";

  if (smooth) {
    let d = `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y}`;
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
    return `${d} L ${last.x.toFixed(2)} ${last.y.toFixed(2)} L ${last.x} ${baselineY} Z`;
  }

  return [
    `M ${pts[0].x} ${baselineY}`,
    `L ${pts[0].x} ${pts[0].y}`,
    ...pts.slice(1).map(p => `L ${p.x} ${p.y}`),
    `L ${pts[pts.length - 1].x} ${baselineY}`,
    `Z`,
  ].join(" ");
};

export const createLineWithFill = (options: {
  parent: FrameNode;
  name?: string;
  values: number[];
  color: RGB;
  chartWidth: number;
  chartHeight: number;
  min: number;
  max: number;
  lineSmoothing: boolean;
  bottomFill: boolean;
}) => {
  const {
    parent,
    name,
    values,
    color,
    chartWidth,
    chartHeight,
    min,
    max,
    lineSmoothing,
    bottomFill,
  } = options;

  const points: Point[] = values.map((d, i) => {
    const x = (i / (values.length - 1)) * chartWidth;
    const y = chartHeight - ((d - min) / (max - min)) * chartHeight;
    return {
      x: Number.isFinite(x) ? +x.toFixed(2) : 0,
      y: Number.isFinite(y) ? +y.toFixed(2) : 0,
    };
  });

  if (bottomFill) {
    const fill = figma.createVector();
    parent.appendChild(fill);
    fill.name = "fill";
    fill.vectorPaths = [{
      data: getFilledPath(points, chartHeight, lineSmoothing),
      windingRule: "NONZERO"
    }];
    fill.fills = [{ type: 'SOLID', color, opacity: 0.2 }];
    fill.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }

  const line = figma.createVector();
  parent.appendChild(line);
  line.name = "line";
  line.vectorPaths = [{
    data: lineSmoothing ? getSmoothedPath(points) : getLinearPath(points),
    windingRule: "NONZERO"
  }];
  line.strokes = [{ type: 'SOLID', color }];
  line.strokeWeight = 2;
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
  cornerRadiusRatio: number;
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
    posAlongAxis,
    barSize,
    cornerRadiusRatio,
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
  bar.name = "bar";
  bar.x = left;
  bar.y = top;
  bar.resize(right - left, bottom - top);
  bar.fills = [{ type: 'SOLID', color }];
  bar.cornerRadius = barSize * cornerRadiusRatio;
  bar.constraints = {horizontal: 'SCALE', vertical: 'SCALE'};
  
  return bar;
};