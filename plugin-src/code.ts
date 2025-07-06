import { generateColorPalette, hexToRgb } from "./helpers";
import { createBarColumnChart } from "./charts/barColumnChart";
import { createPieChart } from "./charts/pieChart";
import { createLineChart } from "./charts/lineChart";
import { createScatterChart } from "./charts/scatterChart";
import { createGroupedBarColumnChart } from "./charts/groupedColumnChart";

figma.showUI(__html__, { width: 350, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate-chart") {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const { chart } = msg;
    const { colorOpts, chartOpts, data, type } = chart;
    const primaryColorHex = hexToRgb(colorOpts.primaryColor);
    const colorPalette = generateColorPalette(colorOpts.colorScheme, colorOpts.primaryColor, data.length);
    switch (type) {
      case "bar":
      case "column":
        createBarColumnChart(data, type === "column", colorPalette, chartOpts.cornerRadius);
        break;
      case "grouped-bar":
      case "grouped-column":
        createGroupedBarColumnChart(data, type === "grouped-column", colorPalette, chartOpts.cornerRadius);
        break;
      case "pie":
        createPieChart(data, colorPalette);
        break;
      case "line":
        createLineChart(data, primaryColorHex, chartOpts.lineSmoothing);
        break;
      case "scatter":
        createScatterChart(data, primaryColorHex);
        break;
    }
  }
};