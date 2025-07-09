export type ChartType = "bar" | "column" | "stacked-bar" | "stacked-column" | "grouped-bar" | "grouped-column" | "pie" | "donut" | "line" | "multi-line" | "area" | "stacked-area" | "scatter" | "bubble" | "candlestick";

export type ColorSchemeType = "monochrome" | "polychrome";

export type ChartDatum = [label: string, value: number];

export type Point = { x: number; y: number };

export type DataPresetType = "" | "random" | "uptrend" | "downtrend" | "flat" | "shifting" | "balanced" | "dominant" | "long-tail" | "binary";

export type ChartBounds = { x: number; y: number; width: number; height: number };