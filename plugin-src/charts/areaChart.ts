export const createAreaChart = (
  data: (string | number)[][],
  colors: RGB[],
  lineSmoothing = false
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = "sdv-area-chart";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.layoutMode = "NONE";
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const parseAreaChartData = (data: (string | number | null)[][]) => {
    const clean = data.filter(row => row.length > 1 && row[0] != null);

    const labels = clean.map(row => row[0] as string);
    const seriesCount = clean[0].length - 1;

    const series = Array.from({ length: seriesCount }, (_, i) => ({
      name: `Series ${i + 1}`,
      values: clean.map(row => row[i + 1] as number)
    }));

    return { labels, series };
  };

  const { labels, series } = parseAreaChartData(data);

  const values = series.flatMap(s => s.values);
  const min = Math.min(...values);
  const max = Math.max(...values);

  for (let i = 0; i < series.length; i++) {
    const { name, values } = series[i];

    const categoryFrame = figma.createFrame();
    chartFrame.appendChild(categoryFrame);
    categoryFrame.name = name;
    categoryFrame.resize(chartWidth, chartHeight);
    categoryFrame.fills = [];
    categoryFrame.constraints = { horizontal: "SCALE", vertical: "SCALE" };

    const points = values.map((d, i) => {
      const x = (i / (values.length - 1)) * chartWidth;
      const y = chartHeight - ((d - min) / (max - min)) * chartHeight;
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

    const filledVector = figma.createVector();
    categoryFrame.appendChild(filledVector);
    filledVector.name = "fill";
    filledVector.vectorPaths = [{
      data: lineSmoothing ? getFilledPathSmooth(points) : getFilledPathLinear(points),
      windingRule: "NONZERO"
    }];
    filledVector.fills = [{
      type: 'SOLID',
      opacity: 0.2,
      color: colors[i]
    }];
    filledVector.constraints = { horizontal: "SCALE", vertical: "SCALE" };

    const pathData = lineSmoothing ? getSmoothedPath(points) : getLinearPath(points);

    const vector = figma.createVector();
    categoryFrame.appendChild(vector);
    vector.name = "line";
    vector.vectorPaths = [{
      data: pathData,
      windingRule: "NONZERO"
    }];
    vector.strokes = [{ type: 'SOLID', color: colors[i] }];
    vector.strokeWeight = 2;
    vector.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }
};