# geom-edges

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Computes unique edges for a list of faces

## Usage

[![NPM](https://nodei.co/npm/geom-edges.png)](https://www.npmjs.com/package/geom-edges)

#### `edges(faces | geometry)`

Parameters:  
`faces` - list of face indices e.g. `[[0,1,2,3], [3,2,5,4],...]`  
`geometry` - simplicial complex geometry `{ positions: [], cells: [] }`

Returns:  
If `faces` is supplied a list of edges will be returned e.g. `[[0,1], [1,2],...]`  
If `geometry` is supplied a new geometry with cloned positions and edge cells will be returned.

## Example

```javascript
var computeEdges = require('geom-edges');

var faces = [[0,1,2,3], [3,2,5,4],...];
var edges = computeEdges(faces); //[[0,1], [1,2], ...]
```

## License

MIT, see [LICENSE.md](http://github.com/vorg/geom-edges/blob/master/LICENSE.md) for details.
