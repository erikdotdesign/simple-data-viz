import { generateColorPalette, hexToRgb } from "./helpers";
import { createBarColumnChart } from "./charts/barColumnChart";
import { createPieChart } from "./charts/pieChart";
import { createLineChart } from "./charts/lineChart";
import { createScatterChart } from "./charts/scatterChart";
import { createGroupedBarColumnChart } from "./charts/groupedColumnChart";

figma.showUI(__html__, { width: 300, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate-chart") {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const primaryColor = hexToRgb(msg.chart.color);
    const primaryColorScale = generateColorPalette(msg.chart.colorScheme, msg.chart.color, msg.chart.data.length);
    switch (msg.chart.type) {
      case "bar":
      case "column":
        createBarColumnChart(msg.chart.data, msg.chart.type === "column", primaryColorScale);
        break;
      case "grouped-bar":
      case "grouped-column":
        createGroupedBarColumnChart(msg.chart.data, msg.chart.type === "grouped-column", primaryColorScale);
        break;
      case "pie":
        createPieChart(msg.chart.data, primaryColorScale);
        break;
      case "line":
        createLineChart(msg.chart.data, primaryColor);
        break;
      case "scatter":
        createScatterChart(msg.chart.data, primaryColor);
        break;
    }
  }
};