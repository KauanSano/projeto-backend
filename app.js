const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
require("dotenv").config();
const app = express();
//views engine
const engine = mustacheExpress();
app.engine("mustache", engine);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//uso de rotas e helpers
app.use(require("./routes/index"));
app.use(require("./routes/pokedex"));
app.use(require("./routes/user"));
app.use(require("./helpers/populatedb"));

app.listen(process.env.APP_PORT, () => {
  console.log(`app listening on ${process.env.APP_PORT}`);
});

module.exports = app;
