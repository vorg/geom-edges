import computeEdges from "../index.js";
import { cube } from "primitive-geometry";

import createContext from "pex-context";
import { mat4 } from "pex-math";
import createGUI from "pex-gui";

const State = {
  pause: true,
  geometry: 0,
  geometries: ["dodecahedron", "cube", "box"],
};

function dodecahedron({ radius = 0.5 } = {}) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = radius;
  const b = radius / phi;
  const c = radius * (2 - phi);

  return {
    positions: [
      [c, 0, a],
      [-c, 0, a],
      [-b, b, b],
      [0, a, c],
      [b, b, b],
      [b, -b, b],
      [0, -a, c],
      [-b, -b, b],
      [c, 0, -a],
      [-c, 0, -a],
      [-b, -b, -b],
      [0, -a, -c],
      [b, -b, -b],
      [b, b, -b],
      [0, a, -c],
      [-b, b, -b],
      [a, c, 0],
      [-a, c, 0],
      [-a, -c, 0],
      [a, -c, 0],
    ],
    cells: [
      [4, 3, 2, 1, 0],
      [7, 6, 5, 0, 1],
      [12, 11, 10, 9, 8],
      [15, 14, 13, 8, 9],
      [14, 3, 4, 16, 13],
      [3, 14, 15, 17, 2],
      [11, 6, 7, 18, 10],
      [6, 11, 12, 19, 5],
      [4, 0, 5, 19, 16],
      [12, 8, 13, 16, 19],
      [15, 9, 10, 18, 17],
      [7, 1, 2, 17, 18],
    ],
  };
}

// Setup
const W = 1280;
const H = 720;
const ctx = createContext({
  width: W,
  height: H,
  element: document.querySelector("main"),
  pixelRatio: devicePixelRatio,
});

const viewMatrix = mat4.create();
const modelMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0]);
mat4.perspective(projectionMatrix, Math.PI / 4, W / H, 0.1, 100);

const geometries = {
  // Polygon faces
  dodecahedron: dodecahedron(),
  // Triangulated geometry
  cube: cube(),
  // Quad faces
  box: {
    positions: [
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
    cells: [
      [0, 1, 2, 3], // +z
      [3, 2, 5, 4], // +x
      [4, 5, 6, 7], // -z
      [7, 6, 1, 0], // -x
      [7, 0, 3, 4], // +y
      [1, 6, 5, 2], // -y
    ],
  },
};
for (let geometry of Object.values(geometries)) {
  geometry.edges = computeEdges(geometry.cells);

  geometry.cmdOptions = {
    attributes: {
      aPosition: ctx.vertexBuffer(geometry.positions),
    },
    indices: ctx.indexBuffer(geometry.edges),
  };
}
console.log(geometries);

const clearCmd = {
  pass: ctx.pass({
    clearColor: [0.2, 0.2, 0.2, 1],
    clearDepth: 1,
  }),
};

const drawCmd = {
  pipeline: ctx.pipeline({
    vert: /* glsl */ `#version 300 es
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

in vec3 aPosition;

out vec3 vPositionWorld;

void main () {
  vPositionWorld = (uModelMatrix * vec4(aPosition, 1.0)).xyz;

  gl_Position = uProjectionMatrix * uViewMatrix * vec4(vPositionWorld, 1.0);
}`,
    frag: /* glsl */ `#version 300 es
precision highp float;

in vec3 vPositionWorld;

out vec4 fragColor;

void main() {
  fragColor = vec4(normalize(vPositionWorld * 0.5) + 0.5, 1.0);
  // fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`,
    depthTest: true,
    cullFace: false,
    primitive: ctx.Primitive.Lines,
  }),
  uniforms: {
    uProjectionMatrix: projectionMatrix,
    uViewMatrix: viewMatrix,
    uModelMatrix: modelMatrix,
  },
};
const gui = createGUI(ctx);
gui.addParam("Pause", State, "pause");
gui.addRadioList(
  "Geometry",
  State,
  "geometry",
  State.geometries.map((name, value) => ({ name, value })),
);

let dt = 0;

ctx.frame(() => {
  if (!State.pause) {
    dt += 0.005;
    mat4.rotate(modelMatrix, dt % 0.02, [0, 1, 0]);
    mat4.lookAt(viewMatrix, [0, 0 + Math.sin(dt * 2) * 1, 2], [0, 0, 0]);
  }

  ctx.submit(clearCmd);

  const geometry = geometries[State.geometries[State.geometry]];

  ctx.submit(drawCmd, geometry.cmdOptions);

  gui.draw();
});
