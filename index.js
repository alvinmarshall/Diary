if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}
const port = process.env.PORT;
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");

// initialize express
const app = express();

//set path
app.use(express.static(path.join(__dirname, process.env.ASSET_DIR)));
//load routes
const userRoutes = require("./src/routes/users");
// const diaryRoutes = require("./src/routes/diary");
//middle ware

//passport config
require("./src/config/passport")(passport);

//mongo db config
const db = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("mongoDb Connected"))
  .catch(err => console.error(err));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport

app.use(passport.initialize());
app.use(passport.session());

//handlebar
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
  app.locals.success_msg = req.flash("success_msg");
  app.locals.error_msg = req.flash("error_msg");
  app.locals.error = req.flash("error");
  next();
});

//routes

//index
app.get("/", (req, res) => {
  res.render("home");
});

//users
app.use("/users", userRoutes);
//diary
// app.use("/diary", diaryRoutes);
//start app
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
