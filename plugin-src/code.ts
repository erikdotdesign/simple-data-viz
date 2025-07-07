import { getChartColors } from "./helpers";
import { createBarColumnChart } from "./charts/barColumnChart";
import { createPieDonutChart } from "./charts/pieDonutChart";
import { createLineChart } from "./charts/lineChart";
import { createScatterChart } from "./charts/scatterChart";
import { createGroupedBarColumnChart } from "./charts/groupedBarColumnChart";
import { createAreaChart } from "./charts/areaChart";

figma.showUI(__html__, { width: 350, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate-chart") {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const { chart } = msg;
    const { colorOpts, chartOpts, data, type } = chart;
    const chartColors = getChartColors(type, data, colorOpts);
    switch (type) {
      case "bar":
      case "column":
        createBarColumnChart(data, type === "column", chartColors, chartOpts.cornerRadius);
        break;
      case "grouped-bar":
      case "grouped-column":
        createGroupedBarColumnChart(data, type === "grouped-column", chartColors, chartOpts.cornerRadius, chartOpts.barSpacingRatio);
        break;
      case "pie":
      case "donut":
        createPieDonutChart(data, chartColors, type === "donut", chartOpts.innerRadius);
        break;
      case "line":
        createLineChart(data, chartColors, chartOpts.lineSmoothing, chartOpts.bottomFill);
        break;
      case "area":
        createAreaChart(data, chartColors, chartOpts.lineSmoothing);
        break;
      case "scatter":
        createScatterChart(data, chartColors);
        break;
    }
  }
};