export type ChartType = "bar" | "column" | "stacked-bar" | "stacked-column" | "grouped-bar" | "grouped-column" | "pie" | "donut" | "line" | "area" | "scatter" | "candlestick";

export type ColorSchemeType = "monochrome" | "polychrome";

export type ChartDatum = [label: string, value: number];

export type Point = { x: number; y: number };

export type DataPresetType = "uptrend" | "downtrend" | "flat" | "shifting" | "balanced" | "dominant" | "long-tail" | "binary";