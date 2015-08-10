var clone = require('clone');

function compareEdgeIndices(a, b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;;
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;;
    return 0;
}

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

    edges.sort(compareEdgeIndices);

    var uniqueEdges = [ edges[0] ];
    for(var i=1, numEdges=edges.length; i<numEdges; i++) {
        var prevEdge = edges[i-1];
        var edge = edges[i];

        if (prevEdge[0] == edge[0] && prevEdge[1] == edge[1]) {
            continue;
        }
        else {
            uniqueEdges.push(edge);
        }
    }

    return uniqueEdges;
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
