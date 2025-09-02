//import required modules
const express = require("express");
const passport = require("passport");
const { signToken } = require("../utils/auth");

//create a new router instance
const router = express.Router();

//initiates GitHub OAuth login flow: @route GET /auth/github

router.get(
  "/github",
  //use Passport.js to authenticate with GitHub, requesting access to user's email
  passport.authenticate("github", { scope: ["user:email"] })
);

//handles GitHub OAuth callback: @route GET /auth/github/callback

router.get(
  "/github/callback",
  //authenticate with GitHub and handle failure redirects
  passport.authenticate("github", {
    failureRedirect: "/auth/github/failure",
    session: false, //don't store user data in session
  }),
  //if authentication succeeds, generate JWT token and respond with JSON
  (req, res) => {
    //create JWT token for the logged-in user
    const token = signToken(req.user);

    //respond with JSON containing token and user data
    res.json({
      message: "GitHub login successful",
      token,
      user: req.user,
    });
  }
);

//handles GitHub authentication failure: @route GET /auth/github/failure
router.get("/github/failure", (req, res) => {
  //return 401 error with failure message
  res.status(401).json({ message: "GitHub authentication failed" });
});

//export router
module.exports = router;
