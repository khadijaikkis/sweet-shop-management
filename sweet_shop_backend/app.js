var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

// Configure routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRoute = require("./routes/auth/register");
const loginRoute = require("./routes/auth/login");
const sweetsRoute = require("./routes/sweets/index");
const inventoryRoute = require("./routes/inventories/index");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Register routes path
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/api/auth/register", registerRoute);
app.use("/api/auth/login", loginRoute);

app.use("/api/sweets", sweetsRoute);

app.use("/api/sweets", inventoryRoute);

// Test DB connection
const db = require("./db/dbConfig");

db.query("SELECT 1 from dual", (error, results) => {
  if (error) throw error;
});

module.exports = app;
