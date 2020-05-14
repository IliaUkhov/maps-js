const fs = require("fs");

var points;

function init() {
  points = JSON.parse(fs.readFileSync("points.json", "utf-8"));
}

function addPoint(name, coords, destination) {
  points.push({
    name: name,
    coords: coords,
    destination: destination
  });
}

function getPoints() {
  return points;
}

module.exports = { init, addPoint, getPoints };
