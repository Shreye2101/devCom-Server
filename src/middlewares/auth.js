const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "Please Login !" });
    }

    const token = header.split(" ")[1];

    const decodeToken = jwt.verify(token, process.env.jwtSecret);
    const { id } = decodeToken;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "User Not Found !" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    res.status(401).json({
      isSuccess: false,
      message: "Please login! Token error: " + err.message,
    });
  }
};

module.exports = { userAuth };
