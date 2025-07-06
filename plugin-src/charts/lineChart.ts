import { ChartDatum } from "../types";

export const createLineChart = (
  data: ChartDatum[],
  color: RGB,
  lineSmoothing = false,
  bottomFill = false
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-line-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const max = Math.max(...data.map(d => d[1]));
  const min = Math.min(...data.map(d => d[1]));

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d[1] - min) / (max - min)) * chartHeight;
    return {
      x: Number.isFinite(x) ? +x.toFixed(2) : 0,
      y: Number.isFinite(y) ? +y.toFixed(2) : 0
    };
  });
  
  const baselineY = chartHeight; // baseline at bottom of chart

  const getFilledPathLinear = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return "";

    const path = [
      `M ${pts[0].x} ${baselineY}`,
      `L ${pts[0].x} ${pts[0].y}`,
      ...pts.slice(1).map(p => `L ${p.x} ${p.y}`),
      `L ${pts[pts.length - 1].x} ${baselineY}`,
      `Z`
    ];

    return path.join(" ");
  };

  const getFilledPathSmooth = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return "";

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
    d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)} L ${last.x} ${baselineY} Z`;

    return d;
  };

  const getSmoothedPath = (pts: { x: number; y: number }[]) => {
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

    // Finish with a final L to the last point (no T!)
    const last = pts[pts.length - 1];
    d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;

    return d;
  };

  const getLinearPath = (pts: { x: number; y: number }[]) => {
    return `M ${pts.map(p => `${p.x} ${p.y}`).join(" L ")}`;
  };

  if (bottomFill) {
    const filledVector = figma.createVector();
    chartFrame.appendChild(filledVector);
    filledVector.name = "fill";
    filledVector.vectorPaths = [{
      data: lineSmoothing ? getFilledPathSmooth(points) : getFilledPathLinear(points),
      windingRule: "NONZERO"
    }];
    filledVector.fills = [{
      type: 'SOLID',
      opacity: 0.2,
      color
    }];
    filledVector.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }

  const pathData = lineSmoothing ? getSmoothedPath(points) : getLinearPath(points);

  const vector = figma.createVector();
  chartFrame.appendChild(vector);
  vector.name = "line";
  vector.vectorPaths = [{
    data: pathData,
    windingRule: "NONZERO"
  }];
  vector.strokes = [{ type: 'SOLID', color }];
  vector.strokeWeight = 2;
  vector.constraints = { horizontal: "SCALE", vertical: "SCALE" };
};