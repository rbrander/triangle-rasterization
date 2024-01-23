// line.mjs -- draw line function
// Bresenham's line algorithm: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

import { lerpHexColor } from "./utils.mjs";

/**
 * Draws a horizontal line given two x-cooridnates and a y. Uses a drawPoint callback
 *
 * @param {number} x0 start position of the line segment (inclusive)
 * @param {number} x1 end position of the line segment (inclusive)
 * @param {number} y Y position for the horizontal line
 * @param {(x: number, y: number) => void} drawPoint A callback function used for each point on the line
 */
export const drawHorizontalLine = (x0, x1, y, drawPoint) => {
  const start = x0 > x1 ? x1 : x0;
  const end = x0 > x1 ? x0 : x1;
  for (let x = start; x <= end; x++) drawPoint(x, y);
};

/**
 * Draws a vertical line given two x-cooridnates and a y. Uses a drawPoint callback
 *
 * @param {number} x X position for the vertical line
 * @param {number} y0 start position of the line segment (inclusive)
 * @param {number} y1 end position of the line segment (inclusive)
 * @param {(x, y) => void} drawPoint A callback function used for each point on the line
 */
export const drawVerticalLine = (x, y0, y1, drawPoint) => {
  const start = y0 > y1 ? y1 : y0;
  const end = y0 > y1 ? y0 : y1;
  for (let y = start; y <= end; y++) drawPoint(x, y);
};

// used for when the slope is <= 1
const drawLineLowSlope = (x0, y0, x1, y1, drawPoint) => {
  const dx = x1 - x0;
  let dy = y1 - y0;
  let yi = 1;
  if (dy < 0) {
    yi = -1;
    dy = -dy;
  }
  let D = 2 * dy - dx;
  let y = y0;

  for (let x = x0; x <= x1; x++) {
    drawPoint(x, y);
    if (D > 0) {
      y = y + yi;
      D = D + 2 * (dy - dx);
    } else {
      D = D + 2 * dy;
    }
  }
};

// used for when the slope is >= 1
const drawLineHighSlope = (x0, y0, x1, y1, drawPoint) => {
  let dx = x1 - x0;
  const dy = y1 - y0;
  let xi = 1;
  if (dx < 0) {
    xi = -1;
    dx = -dx;
  }
  let D = 2 * dx - dy;
  let x = x0;

  for (let y = y0; y <= y1; y++) {
    drawPoint(x, y);
    if (D > 0) {
      x = x + xi;
      D = D + 2 * (dx - dy);
    } else {
      D = D + 2 * dx;
    }
  }
};

/**
 * A function that draws a line segment, using two points and a function to draw a point
 *
 * @param {number} x0 first point, x coordinate
 * @param {number} y0 first point, y coordinate
 * @param {number} x1 second point, x coordinate
 * @param {number} y1 second point, y coordinate
 * @param {(x, y) => void} drawPoint A callback function for drawing a single pixel
 */
export const drawLine = (x0, y0, x1, y1, drawPoint) => {
  // check if the line is mostly horizontal (low) or mostly vertical (high) by checking the slope
  const hasLowSlope = Math.abs(y1 - y0) < Math.abs(x1 - x0);
  if (hasLowSlope) {
    const isLineHorizontal = y0 === y1;
    if (isLineHorizontal) {
      if (x0 > x1) {
        drawHorizontalLine(x1, x0, y0, drawPoint);
      } else {
        drawHorizontalLine(x0, x1, y0, drawPoint);
      }
    } else {
      if (x0 > x1) {
        drawLineLowSlope(x1, y1, x0, y0, drawPoint);
      } else {
        drawLineLowSlope(x0, y0, x1, y1, drawPoint);
      }
    }
  } else {
    // check for vertical line
    const isLineVertical = x0 === x1;
    if (isLineVertical) {
      drawVerticalLine(x0, y0, y1, drawPoint);
    } else {
      if (y0 > y1) {
        drawLineHighSlope(x1, y1, x0, y0, drawPoint);
      } else {
        drawLineHighSlope(x0, y0, x1, y1, drawPoint);
      }
    }
  }
};

export const drawHorizontalLineColorLerp = (
  x0,
  x1,
  y,
  color0,
  color1,
  drawPoint
) => {
  drawHorizontalLine(x0, x1, y, (x, y) =>
    drawPoint(x, y, lerpHexColor(color0, color1, x / Math.abs(x1 - x0)))
  );
};

/**
 * Factory function to create a drawPoint function that calls a given draw point,
 * using linear interpolation for color
 *
 * @param {number} x0 start point, X coordinate
 * @param {number} y0 start point, Y coordinate
 * @param {number} x1 end point, X coordinate
 * @param {number} y1 end point, Y coordinate
 * @param {`#${string}`} color0 hex string for color of start point
 * @param {`#${string}`} color1 hex string for color of end point
 * @param {(x: number, y: number, color: string) => void} drawPoint callback function for drawing a point
 */
export const createDrawPointColorLerp = (
  x0,
  y0,
  x1,
  y1,
  color0,
  color1,
  drawPoint
) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const lengthSquared = dx * dx + dy * dy;
  const getPercentTravelledOnLine = (x, y) => {
    const t = ((x - x0) * dx + (y - y0) * dy) / lengthSquared;
    // Clamp the parameter value to be within the [0, 1] range
    return Math.max(0, Math.min(1, t));
  };
  return (x, y) =>
    drawPoint(
      x,
      y,
      lerpHexColor(color0, color1, getPercentTravelledOnLine(x, y))
    );
};
