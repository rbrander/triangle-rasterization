// engine3d.mjs -- ESModule for 3D engine

// vec3d is an object with x, y, z as numbers
// triangle is an array of 3 vec3d objects
// mesh is an array of

export class Vec3d {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Triangle {
  // each point is a Vec3d
  constructor(p1, p2, p3) {
    this.points = [p1, p2, p3];
  }
}

export class Mesh {
  constructor() {
    this.tris = [];
  }
}

export class Mat4x4 {
  constructor() {
    // create a new 4x4 array filled with 0
    this.matrix = new Array(4).fill(0).map(() => new Array(4).fill(0));
  }
}

///////////////////////////
const meshCube = new Mesh();

export const initEngine = (width, height) => {
  // meshCube initialized as a unit-vector cube from 0, 0, 0 to 1, 1, 1
  meshCube.tris = [
    // South
    new Triangle(new Vec3d(0, 0, 0), new Vec3d(0, 1, 0), new Vec3d(1, 1, 0)),
    new Triangle(new Vec3d(0, 0, 0), new Vec3d(1, 1, 0), new Vec3d(1, 0, 0)),
    // East
    new Triangle(new Vec3d(1, 0, 0), new Vec3d(1, 1, 0), new Vec3d(1, 1, 1)),
    new Triangle(new Vec3d(1, 0, 0), new Vec3d(1, 1, 1), new Vec3d(1, 0, 1)),
    // North
    new Triangle(new Vec3d(1, 0, 1), new Vec3d(1, 1, 1), new Vec3d(0, 1, 1)),
    new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 1, 1), new Vec3d(0, 0, 1)),
    // West
    new Triangle(new Vec3d(0, 0, 1), new Vec3d(0, 1, 1), new Vec3d(0, 1, 0)),
    new Triangle(new Vec3d(0, 0, 1), new Vec3d(0, 1, 0), new Vec3d(0, 0, 0)),
    // Top
    new Triangle(new Vec3d(0, 1, 0), new Vec3d(0, 1, 1), new Vec3d(1, 1, 1)),
    new Triangle(new Vec3d(0, 1, 0), new Vec3d(1, 1, 1), new Vec3d(1, 1, 0)),
    // Bottom
    new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 0, 1), new Vec3d(0, 0, 0)),
    new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 0, 0), new Vec3d(1, 0, 0)),
  ];

  // Projection matrix
  const nearPlane = 0.1;
  const farPlane = 1000.0;
  const fieldOfViewDegrees = 90;
  const aspectRatio = height / width;
};
