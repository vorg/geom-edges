import { avec3, vec3 } from "pex-math";
import typedArrayConstructor from "typed-array-constructor";

function compareEdgeIndices(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
}

let TEMP_CELL = vec3.create();

function computeEdges(faces) {
  const isFlatArray = !faces[0]?.length;

  const cellCount = faces.length / (isFlatArray ? 3 : 1);

  let faceSize = 3;
  let edges = [];

  for (let i = 0; i < cellCount; i++) {
    if (isFlatArray) {
      avec3.set(TEMP_CELL, 0, faces, i);
    } else {
      TEMP_CELL = faces[i];
      faceSize = faces[i].length;
    }

    for (let j = 0; j < faceSize; j++) {
      const a = TEMP_CELL[j];
      const b = TEMP_CELL[(j + 1) % faceSize];
      edges.push([Math.min(a, b), Math.max(a, b)]);
    }
  }

  edges.sort(compareEdgeIndices);

  let uniqueEdges = [edges[0]];

  for (let i = 1; i < edges.length; i++) {
    const prevEdge = edges[i - 1];
    const edge = edges[i];

    if (prevEdge[0] === edge[0] && prevEdge[1] === edge[1]) continue;

    uniqueEdges.push(edge);
  }

  if (isFlatArray) {
    uniqueEdges = uniqueEdges.flat();
    return new (typedArrayConstructor(Math.max(...uniqueEdges)))(uniqueEdges);
  }

  return uniqueEdges;
}

export default computeEdges;
