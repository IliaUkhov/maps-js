const fs = require("fs");

var paths;

function init() {
  paths = JSON.parse(fs.readFileSync("paths.json", "utf-8"));
}

function addPath(name, points, avgSpeed, avgFuelConsumption) {
  paths.push({
    name: name,
    points: points,
    avgSpeed: avgSpeed,
    avgFuelConsumption: avgFuelConsumption
  });
}

function getPaths(id = null) {
  return id ? paths[id] : paths ;
}

module.exports = { init, addPath, getPaths };