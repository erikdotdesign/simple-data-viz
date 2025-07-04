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

export const generateTintShadeScale = (
  baseColorHex: string,
  count: number
): RGB[] => {
  const base = hexToRgb(baseColorHex);
  const white = { r: 1, g: 1, b: 1 };
  const black = { r: 0, g: 0, b: 0 };

  const colors: RGB[] = [];

  const half = Math.floor(count / 2);
  for (let i = half - 1; i >= 0; i--) {
    const t = (i + 1) / (half + 1); // avoid 1.0 white
    colors.push(blendWith(base, white, t)); // lighter tints first
  }

  if (count % 2 !== 0) {
    colors.push(base); // center color if odd
  }

  for (let i = 1; i <= count - half; i++) {
    const t = i / (count - half + 1); // avoid 1.0 black
    colors.push(blendWith(base, black, t)); // darker shades after
  }

  return colors;
}