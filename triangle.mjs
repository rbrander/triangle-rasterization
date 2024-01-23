// triangle.mjs --  ESModule for drawing triangles

import { X, Y } from "./constants.mjs";
import {
  drawLine,
  drawHorizontalLine,
  /*
    createDrawPointColorLerp,
    drawHorizontalLineColorLerp,
  */
} from "./line.mjs";
import { /* lerpHexColor, */ getArrayMinMax } from "./utils.mjs";

// Sort the points in order of Y coordinate, so first point is the top one.
// In case of equal Y coordinates, sort according to X coordinates.
const sortPoints = (points) =>
  [...points].sort((a, b) => (a[Y] === b[Y] ? a[X] - b[X] : a[Y] - b[Y]));

/**
 * Draws a outline of a triangle by drawing three lines between given points
 *
 * @param {[[number, number], [number, number], [number, number]]} initialPoints An array of 3 points, where each point is an array of two values: X and Y (e.g. [[1,2], [5,1], [3,13]])
 * @param {(x, y) => void} drawPoint A callback function for drawing a single point/pixel
 */
export const drawTriangleOutline = (initialPoints, drawPoint) => {
  const points = sortPoints(initialPoints);
  const [p0, p1, p2] = points;
  const [[x0, y0], [x1, y1], [x2, y2]] = [p0, p1, p2];

  // exit if there is no area (max Y = min Y)
  if (y0 === y2) return;

  drawLine(x0, y0, x1, y1, drawPoint);
  drawLine(x1, y1, x2, y2, drawPoint);
  drawLine(x0, y0, x2, y2, drawPoint);
};

/**
 * Draws a filled-in triangle by drawing three lines between given points and horizontal lines between thosse lines
 *
 * @param {[[number, number], [number, number], [number, number]]} initialPoints An array of 3 points, where each point is an array of two values: X and Y (e.g. [[1,2], [5,1], [3,13]])
 * @param {(x: number, y: number) => void} drawPoint A callback function for drawing a single point/pixel
 */
export const drawTriangleFilled = (initialPoints, drawPoint) => {
  const points = sortPoints(initialPoints);

  // exit if there is no area (max Y = min Y)
  if (points[0][Y] === points[2][Y]) return;

  // make a list of all points around the perimeter
  // by using visitPoint as a drawPoint function
  const pointsVisited = [];
  const visitPoint = (x, y, color) => {
    pointsVisited.push({ x, y, color });
  };
  drawTriangleOutline(points, visitPoint);

  // group all the visited points by Y so we can iterate from top to bottom to draw the horizontal lines
  const pointsGroupedByY = pointsVisited.reduce(
    (pointsGroupedByY, point) => ({
      ...pointsGroupedByY,
      [point.y]: [...(pointsGroupedByY[point.y] ?? []), point],
    }),
    {}
  );

  // we only need the left-most and right-most x-positions for each horizontal line
  const minMaxXByY = Object.entries(pointsGroupedByY).reduce(
    (minMaxXByY, [y, points]) => ({
      ...minMaxXByY,
      [y]: getArrayMinMax(points.map(({ x }) => x)),
    }),
    {}
  );

  // iterate over each line from top to bottom and draw horizontal lines
  // between points (or a point when there is only a single value)
  Object.keys(minMaxXByY).forEach((y) => {
    const points = minMaxXByY[y];
    const hasSinglePoint = points.length < 2 || points[0] === points[1];
    if (hasSinglePoint) {
      drawPoint(points[0], y);
    } else {
      // draw a line between the two points
      drawHorizontalLine(points[0], points[1], y, drawPoint);
    }
  });
};

/**
 * Draws a filled-in triangle by interpolating shading between point colors.
 *
 * @param {[[number, number], [number, number], [number, number]]} initialPoints An array of 3 points, where each point is an array of two values: X and Y (e.g. [[1,2], [5,1], [3,13]])
 * @param {(x: number, y: number) => void} drawPoint A callback function for drawing a single point/pixel
 * @param {[string, string, string]} pointColors An array of hex color codes for each point in order
 */
// export const drawTriangleShaded = (initialPoints, drawPoint, pointColors) => {};
// TODO: migrate code from drawTriangle2Shaded to drawTriangleShaded
/*
export const drawTriangle2Shaded = (points, drawPoint, pointColors) => {
  const pointsWithColors = points.map((point, i) => [...point, pointColors[i]]);

  // Sort the points in order of Y coordinate, so first point is the top one.
  // In case of equal Y coordinates, sort according to X coordinates.
  pointsWithColors.sort((a, b) => (a[Y] === b[Y] ? a[X] - b[X] : a[Y] - b[Y]));

  const [p0, p1, p2] = pointsWithColors;
  const [[x0, y0, color0], [x1, y1, color1], [x2, y2, color2]] = [p0, p1, p2];

  // Refuse to draw arealess triangles.
  if (y0 === y2) return;

  // draw the long line (p0 -> p2) and store the points
  const pointsVisited = [];
  const visitPoint = (x, y, color) => {
    pointsVisited.push({ x, y, color });
  };

  drawLine(
    x0,
    y0,
    x2,
    y2,
    createDrawPointColorLerp(x0, y0, x2, y2, color0, color2, visitPoint)
  );
  // add the points of the other two lines, p0->p1 and p1->p2;
  drawLine(
    x0,
    y0,
    x1,
    y1,
    createDrawPointColorLerp(x0, y0, x1, y1, color0, color1, visitPoint)
  );
  drawLine(
    x1,
    y1,
    x2,
    y2,
    createDrawPointColorLerp(x1, y1, x2, y2, color1, color2, visitPoint)
  );

  // group all the visited points by Y so we can iterate from top to bottom to draw the horizontal lines
  const pointsByY = pointsVisited.reduce(
    (pointsByY, point) => ({
      ...pointsByY,
      [point.y]: [...(pointsByY[point.y] ?? []), point],
    }),
    {}
  );

  const getMinMaxPoints = (pointsAtY) => {
    if (pointsAtY.length === 0) return [];
    if (pointsAtY.length === 1) return [pointsAtY[0], pointsAtY[0]];
    return pointsAtY.reduce(
      (minMax, point) => [
        point.x < minMax[0].x ? point : minMax[0],
        point.x > minMax[1].x ? point : minMax[1],
      ],
      [pointsAtY[0], pointsAtY[0]]
    );
  };

  for (let y = y0; y <= y2; y++) {
    const pointsAtY = Array.from(new Set(pointsByY[y] ?? [])).sort(
      (a, b) => a.x - b.x
    );
    const [minPoint, maxPoint] = getMinMaxPoints(pointsAtY);
    if (minPoint.x === maxPoint.x) {
      drawPoint(
        minPoint.x,
        y,
        lerpHexColor(minPoint.color, maxPoint.color, 0.5)
      );
    } else {
      drawHorizontalLineColorLerp(
        minPoint.x,
        maxPoint.x,
        y,
        minPoint.color,
        maxPoint.color,
        drawPoint
      );
    }
  }
};
*/
