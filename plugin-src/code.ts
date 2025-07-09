import { getChartColors } from "./colorUtils";
import { createBarColumnChart } from "./charts/barColumnChart";
import { createPieDonutChart } from "./charts/pieDonutChart";
import { createLineChart } from "./charts/lineChart";
import { createScatterChart } from "./charts/scatterChart";
import { createGroupedBarColumnChart } from "./charts/groupedBarColumnChart";
import { createAreaChart } from "./charts/areaChart";
import { createStackedBarColumnChart } from "./charts/stackedBarColumnChart";
import { createCandlestickChart } from "./charts/candlestickChart";
import { createStackedAreaChart } from "./charts/stackedAreaChart";
import { createBubbleChart } from "./charts/bubbleChart";
import { createRadarChart } from "./charts/radarChart";

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
    const { chart } = msg;
    const { colorOpts, chartOpts, data, type } = chart;
    const chartColors = getChartColors(type, data, colorOpts);
    const selection = figma.currentPage.selection[0];
    const defaultChartWidth = 800;
    const defaultChartHeight = 600;
    let chartBounds: { x: number, y: number, width: number, height: number } = {
      x: figma.viewport.center.x - defaultChartWidth / 2,
      y: figma.viewport.center.y - defaultChartHeight / 2,
      width: defaultChartWidth,
      height: defaultChartHeight
    };
    if (selection && 'width' in selection && 'height' in selection) {
      chartBounds = {
        x: selection.x,
        y: selection.y,
        width: selection.width,
        height: selection.height
      };
    }
    switch (type) {
      case "bar":
      case "column":
        createBarColumnChart(chartBounds, data, type === "column", chartColors, chartOpts.barSizeRatio, chartOpts.cornerRadius);
        break;
      case "grouped-bar":
      case "grouped-column":
        createGroupedBarColumnChart(chartBounds, data, type === "grouped-column", chartColors, chartOpts.barSizeRatio, chartOpts.barSpaceRatio, chartOpts.cornerRadius);
        break;
      case "stacked-bar":
      case "stacked-column":
        createStackedBarColumnChart(chartBounds, data, type === "stacked-column", chartColors, chartOpts.barSizeRatio, chartOpts.cornerRadius, chartOpts.percentStacked);
        break;
      case "pie":
      case "donut":
        createPieDonutChart(chartBounds, data, chartColors, type === "donut", chartOpts.innerRadius);
        break;
      case "line":
        createLineChart(chartBounds, data, chartColors, chartOpts.lineSmoothing, chartOpts.bottomFill, chartOpts.strokeWeight);
        break;
      case "area":
      case "multi-line":
        createAreaChart(chartBounds, data, type === "multi-line", chartColors, chartOpts.lineSmoothing, chartOpts.strokeWeight);
        break;
      case "stacked-area":
        createStackedAreaChart(chartBounds, data, chartColors, chartOpts.lineSmoothing, chartOpts.strokeWeight, chartOpts.percentStacked);
        break;
      case "scatter":
        createScatterChart(chartBounds, data, chartColors, chartOpts.pointRadiusRatio);
        break;
      case "bubble":
        createBubbleChart(chartBounds, data, chartColors, chartOpts.pointRadiusRatio);
        break;
      case "radar":
        createRadarChart(chartBounds, data, chartColors, chartOpts.strokeWeight);
        break;
      case "candlestick":
        createCandlestickChart(chartBounds, data, chartColors, chartOpts.barSizeRatio, chartOpts.cornerRadius, chartOpts.strokeWeight);
        break;
    }
  }
};