/**
 * Converts an RGB object into a hex color code
 *
 * @param {{ r: number, g: number, b: number }} rgb An object containing the red, green, blue color components
 * @returns {`#${string}`} a hex color code string
 */
export const RGBToHex = (rgb) => {
  // Ensure the input object has the required properties
  if (
    !rgb ||
    typeof rgb.r !== "number" ||
    typeof rgb.g !== "number" ||
    typeof rgb.b !== "number"
  ) {
    throw new Error("Invalid RGB object format.");
  }

  // Clamp the values to the valid range [0, 255]
  const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));

  // Convert the RGB components to hex and concatenate
  const hex = (
    (1 << 24) |
    (clamp(rgb.r) << 16) |
    (clamp(rgb.g) << 8) |
    clamp(rgb.b)
  )
    .toString(16)
    .slice(1);

  return `#${hex.toUpperCase()}`;
};

/**
 * Converts a hex color code into an object with RGB components
 *
 * @param {`#${string}`} hex A string of a 6-character hex color code
 * @returns { r: number, g: number, b: number } An object containing the equivalent
 * red, green, blue components from the hex color code; values range
 * from 0 to 255 inclusively
 */
export const hexToRGB = (hex) => {
  // Remove the hash symbol if present
  hex = hex.replace(/^#/, "");

  // Check if it's a 3 or 6 character hex code
  if (hex.length === 3) {
    // Expand 3-char hex to 6-char hex
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse the hex code to RGB components
  const intValue = parseInt(hex, 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;

  return { r, g, b };
};

export const lerp = (v0, v1, t) => (1 - t) * v0 + t * v1;

export const lerpHexColor = (color0, color1, t) => {
  const rgb0 = hexToRGB(color0);
  const rgb1 = hexToRGB(color1);
  const rgbLerp = {
    r: lerp(rgb0.r, rgb1.r, t),
    g: lerp(rgb0.g, rgb1.g, t),
    b: lerp(rgb0.b, rgb1.b, t),
  };
  return RGBToHex(rgbLerp);
};

/**
 * Given an array of integers, this will return the minimum and maximum values
 *
 * @param {number[]} inputArray
 * @returns {[number, number]} An array of two values, min and max
 */
export const getArrayMinMax = (inputArray) => {
  if (!Array.isArray(inputArray)) {
    throw Error("Invalid or missing inputArray");
  }
  // short circuit if there are 2 or less input values
  if (inputArray.length <= 2) {
    return inputArray;
  }
  // for all other values, reduce the array to a min and max
  return inputArray.reduce(
    (minMax, curr) => [
      curr < minMax[0] ? curr : minMax[0],
      curr > minMax[1] ? curr : minMax[1],
    ],
    [inputArray[0], inputArray[0]]
  );
};
