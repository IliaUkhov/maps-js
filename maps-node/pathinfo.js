const fs = require("fs");
const { getPaths } = require("./path");
const { getPoints } = require("./point");
var GeoPoint = require('geopoint');

var pathinfo;

function getPathInfo(id) {
  const path = getPaths(id);
  const points = getPoints();
  var distance = 0.0;
  for (let i = 1; i < path.points.length; ++i) {
    const a = points[path.points[i - 1]];
    const b = points[path.points[i]];
    const geo1 = new GeoPoint(a.coords[0], a.coords[1]);
    const geo2 = new GeoPoint(b.coords[0], b.coords[1]);
    distance = distance + geo1.distanceTo(geo2, true);
  }
  return {
    distance: (distance).toFixed(3),
    time: (distance / path.avgSpeed).toFixed(3),
    fuel: (distance * path.avgFuelConsumption / 100).toFixed(3)
  }
}

module.exports = { getPathInfo };