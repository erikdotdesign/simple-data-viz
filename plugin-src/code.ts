import { getChartColors } from "./colorUtils";
import { createBarColumnChart } from "./charts/barColumnChart";
import { createPieDonutChart } from "./charts/pieDonutChart";
import { createLineChart } from "./charts/lineChart";
import { createScatterChart } from "./charts/scatterChart";
import { createGroupedBarColumnChart } from "./charts/groupedBarColumnChart";
import { createAreaChart } from "./charts/areaChart";

figma.showUI(__html__, { width: 350, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'save-storage') {
    await figma.clientStorage.setAsync(msg.key, msg.value);
  }
  if (msg.type === 'load-storage') {
    const value = await figma.clientStorage.getAsync(msg.key);
    figma.ui.postMessage({ type: 'storage-loaded', key: msg.key, value });
  }
  if (msg.type === "generate-chart") {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const { chart } = msg;
    const { colorOpts, chartOpts, data, type } = chart;
    const chartColors = getChartColors(type, data, colorOpts);
    switch (type) {
      case "bar":
      case "column":
        createBarColumnChart(data, type === "column", chartColors, chartOpts.barSizeRatio, chartOpts.cornerRadius);
        break;
      case "grouped-bar":
      case "grouped-column":
        createGroupedBarColumnChart(data, type === "grouped-column", chartColors, chartOpts.barSizeRatio, chartOpts.barSpaceRatio, chartOpts.cornerRadius);
        break;
      case "pie":
      case "donut":
        createPieDonutChart(data, chartColors, type === "donut", chartOpts.innerRadius);
        break;
      case "line":
        createLineChart(data, chartColors, chartOpts.lineSmoothing, chartOpts.bottomFill, chartOpts.strokeWeight);
        break;
      case "area":
        createAreaChart(data, chartColors, chartOpts.lineSmoothing, chartOpts.strokeWeight);
        break;
      case "scatter":
        createScatterChart(data, chartColors, chartOpts.pointRadiusRatio);
        break;
    }
  }
};