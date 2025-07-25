import chroma from "chroma-js";
import { ChartType, ColorSchemeType } from "../types";

export const hexToRgb = (hex: string): RGB => {
  const [r, g, b] = chroma(hex).rgb(); // 0–255
  return { r: r / 255, g: g / 255, b: b / 255 }; // normalize to 0–1
};

export const rgbToHex = ({ r, g, b }: RGB): string => {
  return chroma.rgb(r * 255, g * 255, b * 255).hex();
};

export const generateMonochromePalette = (
  baseColorHex: string,
  count: number
): RGB[] => {
  const maxTint = chroma.mix(baseColorHex, "#fff", 0.5);
  const maxShade = chroma.mix(baseColorHex, "#000", 0.9);

  const scale = chroma
    .scale([maxTint, baseColorHex, maxShade])
    .mode("lab") // smoother perceptual gradient
    .colors(count);

  return scale.map(hex => hexToRgb(hex));
};

export const generatePolychromePalette = (
  baseColorHex: string,
  count: number
): RGB[] => {
  const base = chroma(baseColorHex).hsl();
  const hueStart = base[0];
  const saturation = base[1];
  const lightness = base[2];

  const colors: string[] = Array.from({ length: count }, (_, i) => {
    const hue = (hueStart + (360 / count) * i) % 360;
    return chroma.hsl(hue, saturation, lightness).hex();
  });

  return colors.map(hex => hexToRgb(hex));
};

export const generateColorPalette = (
  type: "monochrome" | "polychrome",
  baseColorHex: string,
  count: number
): RGB[] => {
  return type === "monochrome"
    ? generateMonochromePalette(baseColorHex, count)
    : generatePolychromePalette(baseColorHex, count);
};

export const shiftHue = (hex: string, degrees: number): string => {
  const [h, s, l] = chroma(hex).hsl();
  return chroma.hsl((h + degrees) % 360, s, l).hex();
};

export const adjustColorForNegative = (rgb: RGB): RGB => {
  const hex = rgbToHex(rgb);
  const adjusted = chroma(hex).darken(1).desaturate(1); // tweak as needed
  return hexToRgb(adjusted.hex());
};

const getDivergingNegativeBase = (baseHex: string): string => {
  const base = chroma(baseHex);
  const hue = base.get("hsl.h");
  const lum = base.luminance();       // 0 (black) → 1 (white)
  const sat = base.get("hsl.s");      // 0 → grayscale, > 0 → colored

  const isGray = sat < 0.2;

  if (hue >= 80 && hue <= 160) return "#e53935"; // green → red
  if (hue <= 20 || hue >= 340) return "#43a047"; // red → green
  if (isGray && lum < 0.4) return "#f5f5f5";      // dark gray → light gray
  if (isGray && lum > 0.6) return "#212121";      // light gray → dark gray

  return shiftHue(baseHex, 180); // fallback: rotate hue
};

export const generateDivergingPalette = (
  type: "monochrome" | "polychrome",
  baseColorHex: string,
  count: number
): { positive: RGB[]; negative: RGB[] } => {
  const negativeBase = getDivergingNegativeBase(baseColorHex);
  return {
    positive: generateColorPalette(type, baseColorHex, count),
    negative: generateColorPalette(type, negativeBase, count),
  };
};

export const getChartColors = (
  type: ChartType, 
  data: (string | number)[][], 
  colorOpts: {
    primaryColor: string;
    colorScheme: ColorSchemeType;
  }
): RGB | RGB[] | { positive: RGB[], negative: RGB[] } => {
  switch (type) {
    case "bar":
    case "column":
    case "candlestick": {
      // Only need 1 color each for positive and negative
      return generateDivergingPalette(colorOpts.colorScheme, colorOpts.primaryColor, 1);
    }

    case "grouped-bar":
    case "grouped-column":
    case "stacked-bar":
    case "stacked-column": {
      const seriesCount = data[0].length ? data[0].length - 1 : 1; // assumes structure like [["label", val1, val2, val3]]
      switch(colorOpts.colorScheme) {
        case "monochrome":
          return generateDivergingPalette(colorOpts.colorScheme, colorOpts.primaryColor, seriesCount);
        case "polychrome":
          const posColors = generateColorPalette(colorOpts.colorScheme, colorOpts.primaryColor, seriesCount);
          const negColors = posColors.map(adjustColorForNegative);
          return {
            positive: posColors,
            negative: negColors
          };
      }
    }

    case "area":
    case "stacked-area":
    case "multi-line":
    case "radar": {
      const seriesCount = data[0].length ? data[0].length - 1 : 1; // assumes structure like [["label", val1, val2, val3]]
      return generateColorPalette(colorOpts.colorScheme, colorOpts.primaryColor, seriesCount);
    }

    case "pie":
    case "donut": {
      const categoryCount = data.length;
      return generateColorPalette(colorOpts.colorScheme, colorOpts.primaryColor, categoryCount);
    }

    case "line":
    case "scatter":
    case "bubble": {
      // Only need base color
      return hexToRgb(colorOpts.primaryColor);
    }
  }
}