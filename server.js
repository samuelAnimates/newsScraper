const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const app = express();

// Serve static content for the app from the "public" directory in the application directory.
// =============================================================
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static content for the app from the "public" directory in the application directory.
// =============================================================
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
// =============================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Set Handlebars.
// =============================================================
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// =============================================================
var routes = require("./controllers/articlesController.js");
app.use("/", routes);

app.listen(port);