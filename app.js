var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const cors = require("cors");

var indexRouter = require("./routes/index");
var managerRouter = require("./routes/manager");
var usersRouter = require("./routes/users");
const sessionRouter = require("./routes/session");
const shortsRouter = require("./routes/shorts");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "pug");

// set up user session
app.use(
  session({
    secret: "sigma-nu-url-shortener",
    resave: true,
    saveUninitialized: true,
  })
);

// allows us to make requests from POSTMAN
app.use(cors());

// set up the app to use dev logger
app.use(logger("dev"));

// accept json
app.use(express.json());

// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
// allows object nesting in POST
app.use(express.urlencoded({ extended: false }));

// cookies for sessions
app.use(cookieParser());

// server html+css+js frontend
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users/session", sessionRouter);
app.use("/api/shorts", shortsRouter);
app.use("/api/users", usersRouter);
app.use("/manager", managerRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
