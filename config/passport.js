const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

//configure GitHub OAuth authentication strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, //GitHub app client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET, //GitHub app client secret
      callbackURL: process.env.GITHUB_CALLBACK_URL, //OAuth callback URL
      scope: ["user:email"], //request email scope from GitHub
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //try to find user by their GitHub ID (primary lookup)
        let user = await User.findOne({ githubId: profile.id });

        //extract email from GitHub profile if available
        //note: GitHub users can hide their email, so this may be undefined
        const email =
          profile.emails && profile.emails.length
            ? profile.emails[0].value.toLowerCase() //normalize email to lowercase
            : undefined;

        //if user not found by GitHub ID but email exists, try linking accounts
        //this handles the case where a user signed up with email first, then uses GitHub OAuth
        if (!user && email) {
          user = await User.findOne({ email });
          if (user) {
            //link existing email account with GitHub ID
            user.githubId = profile.id;
            await user.save();
          }
        }

        //create new user if no existing user found
        //schema allows users without email if they have githubId
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username || `gh_${profile.id}`, //fallback username if missing
            email, //may be undefined, allowed by schema when githubId exists
          });
        }

        //authentication successful: pass user to passport
        return done(null, user);
      } catch (err) {
        //authentication failed: pass error to passport
        return done(err);
      }
    }
  )
);

// Serialize user ID to session (stores minimal data in session)
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from session ID (exclude password from query)
passport.deserializeUser((id, done) =>
  User.findById(id).select("-password").exec(done)
);
