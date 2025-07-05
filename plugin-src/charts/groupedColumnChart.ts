export const createGroupedBarColumnChart = (
  headers: string[],
  data: (string | number)[][],
  isColumn: boolean,
  colors: RGB[],
  includeBarValues: boolean = true,
) => {
  const chartWidth = 800;
  const chartHeight = 600;

  const chartFrame = figma.createFrame();
  chartFrame.name = `data-viz--grouped-${isColumn ? 'column' : 'bar'}-chart`;
  chartFrame.layoutMode = isColumn ? "HORIZONTAL" : "VERTICAL";
  chartFrame.resize(chartWidth, chartHeight);
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  chartFrame.itemSpacing = ((isColumn ? chartWidth : chartHeight) / data.length) * 0.4;

  chartFrame.x = figma.viewport.center.x - chartWidth / 2;
  chartFrame.y = figma.viewport.center.y - chartHeight / 2;

  const allValues = data.flatMap(d => d.slice(1) as number[]);
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues);

  for (let i = 0; i < data.length; i++) {
    const category = data[i][0] as string;
    const values = data[i].slice(1) as number[];

    // Frame per category
    const groupFrame = figma.createFrame();
    chartFrame.appendChild(groupFrame);
    groupFrame.name = category;
    groupFrame.layoutMode = isColumn ? "HORIZONTAL" : "VERTICAL";
    groupFrame.layoutSizingHorizontal = "FILL";
    groupFrame.layoutSizingVertical = "FILL";

    for (let j = 0; j < values.length; j++) {
      const value = values[j];
      const normalized = (value - min) / (max - min);
      const barValueSpace = includeBarValues ? 24 : 0;

      const barLength = isColumn
        ? normalized * (chartHeight - barValueSpace)
        : normalized * (chartWidth - barValueSpace);

      const barFrame = figma.createFrame();
      groupFrame.appendChild(barFrame);
      barFrame.name = `${category} - Series ${j + 1}`;
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
        color: colors[j] || { r: 0.6, g: 0.6, b: 0.6 } // fallback color
      }];

      // insert bar before text (if bar chart)
      if (!isColumn && includeBarValues) {
        barFrame.insertChild(0, bar);
      }
    }
  }
};