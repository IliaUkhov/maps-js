const { addUser, findUser } = require("./user");
const { getPoints, addPoint } = require("./point");
const { getPaths, addPath } = require("./path");
const { getPathInfo } = require("./pathinfo");
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

router.post("/api/users", (req, res) => {
  console.log(`POST user`);
  const creds = req.body;
  if (addUser(creds.email, creds.password)) {
    res.status(201).send("Created")
  } else {
    res.status(400).send("Client error");
  }
});

router.post("/api/auth", (req, res) => {
  console.log(`POST auth`);
  const creds = req.body;
  const user = findUser(creds.email);
  if (!user) {
    res.status(401).send("Unauthorized");
  } else {
    const authHash = crypto.createHmac('sha256', `${creds.email}${creds.password}`).digest('hex');
    if (user.auth === authHash) {
      res.status(200).send();
    } else {
      res.status(401).send("Unauthorized");
    }
  }
});

router.get("/api/points", (req, res) => {
  console.log(`GET points`);
  res.json(getPoints());
});

router.post("/api/points", (req, res) => {
  console.log(`POST points`);
  const point = req.body;
  addPoint(point.name, point.coords, point.destination);
  res.status(201).send("Created");
});

router.get("/api/paths", (req, res) => {
  console.log(`GET paths`);
  res.json(getPaths());
});

router.post("/api/paths", (req, res) => {
  console.log(`POST paths`);
  const path = req.body;
  addPath(path.name, path.points, path.avgSpeed, path.avgFuelConsumption);
  res.status(201).send("Created");
});

router.get("/api/pathinfo/:num", (req, res) => {
  console.log(`GET pathinfo`);
  const pathId = req.params.num;
  res.json(getPathInfo(pathId));
});

module.exports = router;
