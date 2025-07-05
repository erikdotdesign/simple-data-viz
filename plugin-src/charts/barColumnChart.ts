import { ChartDatum } from "../types";

export const createBarColumnChart = (
  headers: string[],
  data: ChartDatum[],
  isColumn: boolean,
  colors: RGB[],
  includeBarValues: boolean = false,
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = `data-viz--${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = isColumn ? "HORIZONTAL" : "VERTICAL";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.itemSpacing = ((isColumn ?  chartWidth : chartHeight) / data.length) * 0.5;

  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const min = Math.min(...data.map(d => d[1]), 0);
  const max = Math.max(...data.map(d => d[1]));

  for (let i = 0; i < data.length; i++) {
    const label = data[i][0];
    const value = data[i][1];
    const normalized = (value - min) / (max - min);
    const barValueSpace = includeBarValues ? 24 : 0;

    const barLength = isColumn
      ? normalized * (chartHeight - barValueSpace)
      : normalized * (chartWidth - barValueSpace);

    const barFrame = figma.createFrame();
    chartFrame.appendChild(barFrame);
    barFrame.name = label;
    barFrame.layoutMode = isColumn ? "VERTICAL" : "HORIZONTAL";
    barFrame.layoutSizingHorizontal = "FILL";
    barFrame.layoutSizingVertical = "FILL";
    barFrame.primaryAxisAlignItems = isColumn ? "MAX" : "MIN";
    barFrame.counterAxisAlignItems = "CENTER";

    if (includeBarValues) {
      const barValue = figma.createText();
      barFrame.appendChild(barValue);
      barValue.characters = value.toString();
      barValue.fontSize = 12;
      barValue.name = "label";
      barValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      barValue.layoutSizingVertical = isColumn ? "FIXED" : "FILL";
      barValue.layoutSizingHorizontal = isColumn ? "FILL" : "FIXED";
      barValue.textAlignHorizontal = isColumn ? "CENTER" : "LEFT"
      barValue.textAlignVertical = isColumn ? "BOTTOM" : "CENTER";
      barValue.resize(
        isColumn ? barFrame.width : barValueSpace,
        isColumn ? barValueSpace : barFrame.height
      );
    }

    const bar = figma.createRectangle();
    barFrame.appendChild(bar);
    bar.name = "bar";
    bar.layoutSizingVertical = isColumn ? "FIXED" : "FILL";
    bar.layoutSizingHorizontal = isColumn ? "FILL" : "FIXED";
    bar.resize(
      isColumn ? barFrame.width : barLength,
      isColumn ? barLength : barFrame.height
    );
    bar.fills = [{
      type: 'SOLID',
      color: colors[i]
    }];

    // insert bar before text (if bar chart)
    if (!isColumn && includeBarValues) {
      barFrame.insertChild(0, bar);
    }
  }
};