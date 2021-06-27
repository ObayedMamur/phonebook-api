const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Token Validation Start

const validateToken = (token) => {
  try {
    let decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    return decoded;
  } catch (err) {
    console.log("Error in token validation", err);
    return null;
  }
};

// Token Validation End

const authenticateJWT = (req, res, next) => {
  const token = req.get("authorization")?.split(" ")[1];
  if (token) {
    const decodedToken = validateToken(token);
    if (decodedToken) {
      next();
    } else {
      res
        .status(400)
        .json({ message: "Try to Log In or Create an account.", status: 400 });
    }
  } else {
    console.log(`Denying access to the route path: ${req.path}`);
    res
      .status(400)
      .json({ message: "Try to Log In or Create an account.", status: 400 });
  }
};

module.exports = authenticateJWT;
