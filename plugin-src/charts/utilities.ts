import { Point } from "../types";

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
  name?: string;
  isColumn: boolean;
  isNegativeValue: boolean;
  barLength: number;
  maxBarLength: number;
  cornerRadius: number;
  color: RGB;
}) => {
  const {
    parent,
    isColumn,
    isNegativeValue,
    barLength,
    maxBarLength,
    cornerRadius,
    color,
  } = options;

  const axisFrame = figma.createFrame();
  parent.appendChild(axisFrame);
  axisFrame.name = "axis-frame";
  axisFrame.layoutMode = isColumn ? "VERTICAL" : "HORIZONTAL";
  axisFrame.layoutSizingHorizontal = "FILL";
  axisFrame.layoutSizingVertical = "FILL";
  axisFrame.primaryAxisAlignItems = isColumn ? (isNegativeValue ? "MAX" : "MIN") : (isNegativeValue ? "MIN" : "MAX");
  axisFrame.counterAxisAlignItems = "CENTER";

  const barFrame = figma.createFrame();
  axisFrame.appendChild(barFrame);
  barFrame.name = "bar-frame";
  barFrame.layoutMode = isColumn ? "VERTICAL" : "HORIZONTAL";
  barFrame.layoutSizingHorizontal = "FILL";
  barFrame.layoutSizingVertical = "FILL";
  barFrame.primaryAxisAlignItems = isColumn ? (isNegativeValue ? "MIN" : "MAX") : (isNegativeValue ? "MAX" : "MIN");
  barFrame.counterAxisAlignItems = "CENTER";
  barFrame.resize(
    isColumn ? barFrame.width : maxBarLength,
    isColumn ? maxBarLength : barFrame.height
  );
  
  const bar = figma.createRectangle();
  barFrame.appendChild(bar);
  bar.name = "bar";
  bar.layoutSizingVertical = isColumn ? "FIXED" : "FILL";
  bar.layoutSizingHorizontal = isColumn ? "FILL" : "FIXED";
  bar.cornerRadius = cornerRadius;
  bar.resize(
    isColumn ? barFrame.width : barLength,
    isColumn ? barLength : barFrame.height
  );
  bar.fills = [{
    type: 'SOLID',
    color
  }];
  bar.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
};