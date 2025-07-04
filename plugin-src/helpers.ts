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

  const lightest = blendWith(base, { r: 1, g: 1, b: 1 }, 0.7); // 90% white
  const darkest = blendWith(base, { r: 0, g: 0, b: 0 }, 0.8); // 90% black

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