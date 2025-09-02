//load environment variables from .env file
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");

//load MongoDB connection
require("./config/connection");
//load passport configuration
require("./config/passport");

const app = express();

//middleware
app.use(express.json()); //parse JSON request bodies
app.use(express.urlencoded({ extended: true })); //parse URL-encoded request bodies

//session configuration: using JWT_SECRET for session encryption
app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback_secret", //session secret with fallback
    resave: false, //don't resave unchanged sessions
    saveUninitialized: false, //don't save uninitialized sessions
  })
);

//passport middleware for authentication
app.use(passport.initialize()); //initialize Passport
app.use(passport.session()); //enable session support

//oauth authentication routes
app.use("/auth", require("./routes/oauth"));

//user registration/login routes
app.use("/api/users", require("./routes/userRoutes"));

//bookmark routes
app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));

//health check/test endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//start server on configured port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
