const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

const routes = require("./routes");

require("./user").init();
require("./point").init();
require("./path").init();

const corsOptions = {
  "origin": true,
  "methods": [
    "GET",
    "HEAD",
    "PUT",
    "PATCH",
    "POST",
    "DELETE"
  ],
  "allowedHeaders": [
    "Authorization",
    "X-Requested-With",
    "Content-Type",
    "Cache-Control",
    "Accept"
  ]
}

app.use(cors(corsOptions))    

app.use("/", routes);
app.listen(8000);
