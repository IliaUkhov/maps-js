const crypto = require('crypto');
const fs = require("fs");

var users;

function init() {
  users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
}

function addUser(email, password) {
  const loginHash = crypto.createHmac("sha256", email).digest("hex");
  if (loginHash in users) {
    return false;
  } else {
    const authHash = crypto.createHmac("sha256", `${email}${password}`).digest("hex");
    users[loginHash] = { auth: authHash };
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
    return true;
  }
}

function findUser(email) {
  const loginHash = crypto.createHmac("sha256", email).digest("hex");
  if (loginHash in users) {
    return users[loginHash];
  } else {
    return null;
  }
}

module.exports = { init, addUser, findUser };