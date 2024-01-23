// app.mjs -- application entry point

import { X, Y, DRAW_FACTOR as DEFAULT_DRAW_FACTOR } from "./constants.mjs";
import { drawTriangleOutline, drawTriangleFilled } from "./triangle.mjs";

const drawFactorSlider = document.getElementById("DrawFactorSlider");
const txtDrawFactor = document.getElementById("txtDrawFactor");
const chkDrawOutline = document.getElementById("chkDrawOutline");
const chkDrawGrid = document.getElementById("chkDrawGrid");
const pauseButton = document.getElementById("btnPause");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// state variables
let DRAW_FACTOR = DEFAULT_DRAW_FACTOR;
let shouldDrawGrid = true;
let shouldDrawOutline = true;
let isPaused = false;
let numFrames = 0;
let framesPerSecond = 0;
let lastTick = 0;
// triangle state
let currentTriangle = []; // an array of 3 points
let randomColor = "#FFFFFF";

const drawFPS = () => {
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText(`FPS: ${framesPerSecond}`, 10, 50);
};

// draw a box to represent a point using DRAW_FACTOR
const drawPoint = (ctx, x, y, color) => {
  ctx.fillStyle = color;
  if (shouldDrawGrid) {
    // shrink the box by 1 pixel on all sides to show grid
    ctx.fillRect(
      x * DRAW_FACTOR + 1,
      y * DRAW_FACTOR + 1,
      DRAW_FACTOR - 2,
      DRAW_FACTOR - 2
    );
  } else
    ctx.fillRect(x * DRAW_FACTOR, y * DRAW_FACTOR, DRAW_FACTOR, DRAW_FACTOR);
};

const drawGrid = (ctx) => {
  // shift canvas by half a pixel for crisp lines
  ctx.translate(0.5, 0.5);
  ctx.strokeStyle = "#555";
  for (let i = DRAW_FACTOR; i < ctx.canvas.width; i += DRAW_FACTOR) {
    // vertical line
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
    // horizontal line
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
  }
  ctx.translate(-0.5, -0.5); // shift canvas back
};

// a function to draw a triangle using build-in canvas methods
const drawCanvasTriangle = (ctx, [p0, p1, p2]) => {
  ctx.strokeStyle = "#aaa";
  for (let lineWidth = 5; lineWidth > 0; lineWidth -= 3) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineWidth === 5 ? "#000" : "#fff";

    ctx.translate(DRAW_FACTOR / 2, DRAW_FACTOR / 2);
    ctx.beginPath();
    ctx.moveTo(p0[X] * DRAW_FACTOR, p0[Y] * DRAW_FACTOR);
    ctx.lineTo(p1[X] * DRAW_FACTOR, p1[Y] * DRAW_FACTOR);
    ctx.lineTo(p2[X] * DRAW_FACTOR, p2[Y] * DRAW_FACTOR);
    ctx.lineTo(p0[X] * DRAW_FACTOR, p0[Y] * DRAW_FACTOR);
    ctx.stroke();
    ctx.translate(-DRAW_FACTOR / 2, -DRAW_FACTOR / 2);
  }
};

const ctxDrawPoint = (x, y, color) => drawPoint(ctx, x, y, color);

const draw = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (shouldDrawGrid) drawGrid(ctx);

  drawTriangleFilled(currentTriangle, (x, y) =>
    ctxDrawPoint(x, y, randomColor)
  );
  if (shouldDrawOutline) {
    drawTriangleOutline(currentTriangle, (x, y) => ctxDrawPoint(x, y, "#eee"));
  }

  /*
  const colors = [{ r: 200, g: 50, b: 50}, {r: 50, g: 200, b: 50}, {r: 50, g: 50, b: 200}];
  const pointColors = ["#c33", "#3c3", "#33c"];
  drawTriangle2Shaded(currentTriangle, ctxDrawPoint, pointColors);
  */

  drawFPS();
};

const createRandomPoint = (maxX, maxY) => [
  Math.round(Math.random() * maxX),
  Math.round(Math.random() * maxY),
];

const update = (tick) => {
  if (tick >= lastTick + 1000) {
    // 1000ms = 1second
    framesPerSecond = numFrames;
    numFrames = 0;
    lastTick = tick;
  }
  if (isPaused) return;

  // const points = [[7, 0], [1, 6], [11, 12]]; // original
  // const points = [[1, 6], [11, 12], [7, 0]]; // reversed
  // const points = [[11, 6], [1, 12], [4, 0]]; // flipped horizontally
  // const points = [[11, 6], [1, 0], [4, 12]]; // flipped vertically

  // const points = [[0, 0], [8, 0], [4, 4]]; // upside down equalateral
  // const points = [[0, 4], [8, 4], [4, 0]]; // equalateral
  // const points = [[1, 1], [1, 5], [3, 3]]; // flat left, pointing right
  // const points = [[5, 1], [5, 5], [3, 3]]; // flat right, pointing left

  // const points = [[1, 18], [47, 49], [19, 0]]; // big

  // Random points
  const maxX = Math.floor(canvas.width / DRAW_FACTOR);
  const maxY = Math.floor(canvas.height / DRAW_FACTOR);
  const points = [
    createRandomPoint(maxX, maxY),
    createRandomPoint(maxX, maxY),
    createRandomPoint(maxX, maxY),
  ];
  currentTriangle = points;

  // generate a random color
  randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const loop = (tick) => {
  numFrames++;
  update(tick);
  draw(tick);
  requestAnimationFrame(loop);
};

const onChangeDrawFactor = (event) => {
  DRAW_FACTOR = Number(event.target.value);
  txtDrawFactor.innerText = DRAW_FACTOR.toString();
  if (DRAW_FACTOR === 1) {
    // turn off draw grid
    shouldDrawGrid = false;
    chkDrawGrid.checked = false;
  }
};

const togglePauseState = (event) => {
  isPaused = !isPaused;
  btnPause.innerText = isPaused ? "Resume" : "Pause";
};

const toggleDrawGrid = () => (shouldDrawGrid = !shouldDrawGrid);
const toggleDrawOutline = () => (shouldDrawOutline = !shouldDrawOutline);

(function init() {
  console.log("Triangle Rasterization");

  // event handlers
  drawFactorSlider.onchange = onChangeDrawFactor;
  pauseButton.onclick = togglePauseState;
  chkDrawGrid.onchange = toggleDrawGrid;
  chkDrawOutline.onchange = toggleDrawOutline;
  canvas.width = document.body.clientWidth;
  window.addEventListener("resize", () => {
    canvas.width = document.body.clientWidth;
  });

  // start
  loop();
})();
