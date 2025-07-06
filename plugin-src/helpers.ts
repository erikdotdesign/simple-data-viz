export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
};

export const blendWith = (
  base: { r: number; g: number; b: number },
  target: { r: number; g: number; b: number },
  t: number
): RGB => {
  return {
    r: base.r * (1 - t) + target.r * t,
    g: base.g * (1 - t) + target.g * t,
    b: base.b * (1 - t) + target.b * t
  };
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }

  return { h, s, l };
};

const hslToRgb = (h: number, s: number, l: number) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

export const generateMonochromePalette = (
  baseColorHex: string,
  count: number
): RGB[] => {
  const base = hexToRgb(baseColorHex);

  const lightest = blendWith(base, { r: 1, g: 1, b: 1 }, 0.7); // 70% white
  const darkest = blendWith(base, { r: 0, g: 0, b: 0 }, 0.8); // 80% black

  const colors: RGB[] = [];

  if (count === 1) {
    return [base];
  }

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1); // range [0, 1]
    if (t === 0) {
      colors.push(lightest); // first = lightest
    } else if (t === 1) {
      colors.push(darkest); // last = darkest
    } else {
      // Midpoints blend between lightest → base → darkest
      const midT = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;

      if (t < 0.5) {
        // From lightest → base
        colors.push(blendWith(lightest, base, midT));
      } else {
        // From base → darkest
        colors.push(blendWith(base, darkest, midT));
      }
    }
  }

  return colors;
};

export const generatePolychromePalette = (
  baseColorHex: string,
  count: number
): RGB[] => {
  const clean = baseColorHex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const baseHsl = rgbToHsl(r, g, b);
  const colors: RGB[] = [];

  for (let i = 0; i < count; i++) {
    const hue = (baseHsl.h + (360 / count) * i) % 360;
    const rgb = hslToRgb(hue, baseHsl.s, baseHsl.l);
    colors.push({
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255,
    });
  }

  return colors;
};

export const generateColorPalette = (
  type: "monochrome" | "polychrome",
  baseColorHex: string,
  count: number
) => {
  switch(type) {
    case "monochrome":
      return generateMonochromePalette(baseColorHex, count);
    case "polychrome":
      return generatePolychromePalette(baseColorHex, count);
  }
};