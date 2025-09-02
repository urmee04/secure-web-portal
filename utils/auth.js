//import the jsonwebtoken library for token creation and verification
const jwt = require("jsonwebtoken");

//signs a JWT token with user data.

function signToken(user) {
  //sign a token with user data and a secret key, expiring in 24 days
  return jwt.sign(
    { _id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24d" }
  );
}

//middleware to authenticate requests using JWT tokens.

function authMiddleware(req, res, next) {
  //extract the Authorization header from the request
  const header = req.headers.authorization || "";
  //extract the token from the header, removing the "Bearer " prefix
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  //if no token is provided, return a 401 error
  if (!token) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  try {
    //verify the token using the secret key
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach user data to the request object
    req.user = {
      id: payload._id,
      email: payload.email,
      username: payload.username,
    };
    //call the next middleware function
    return next();
  } catch {
    //if token verification fails return 401 error
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

//export the signToken and authMiddleware functions
module.exports = { signToken, authMiddleware };
