var clone = require('clone');

function computeEdgesForGeometry(geometry) {
  return {
    positions: clone(geometry.positions),
    cells: computeEdgesForFaces(geometry.cells)
  }
}

function computeEdgesForFaces(faces) {
    var edges = [];
    for(var i=0, numFaces=faces.length; i<numFaces; i++) {
        var f = faces[i];
        for(var j=0, numVertices=f.length; j<numVertices; j++) {
            var a = f[j];
            var b = f[(j+1)%numVertices];
            edges.push([
                Math.min(a, b),
                Math.max(a, b)
            ]);
        }
    }
    return edges;
}

function computeEdges(geometryOrFaces) {
    if (geometryOrFaces.positions && geometryOrFaces.cells) {
        return computeEdgesForGeometry(geometryOrFaces);
    }
    else {
        return computeEdgesForFaces(geometryOrFaces);
    }
}

module.exports = computeEdges;
