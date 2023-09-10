const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
// const flash = require("connect-flash");

// const MONGODB_URI = `mongodb+srv://MEGHABHATT:${encodeURIComponent(
//   "meghabhatt"
// )}@cluster0.mvrwaim.mongodb.net/ekart?retryWrites=true&w=majority`;

const MONGODB_URI = `mongodb+srv://${
  process.env.DB_USERNAME
}:${encodeURIComponent(process.env.DB_PASSWORD)}@srishti.24jvwrg.mongodb.net/${
  process.env.DB_NAME
}?retryWrites=true&w=majority`;

const app = express();
// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: "sessions",
// });

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads/images", express.static("uploads/images"));
// app.use(
//   session({
//     secret: "It is a secret key",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//   })
// );
// // app.use(flash());

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.isAdmin = req.session.role == "admin" ? true : false;
//   if (!req.session.isLoggedIn) {
//     return next();
//   }

app.use("/api/admin", adminRoutes);
app.use("/api", shopRoutes);
app.use("/api", authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(4000, "localhost", () => {
      console.log("App is running");
    });
  })
  .catch((err) => console.log(err));
