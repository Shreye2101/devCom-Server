//user routes
const express = require("express")
const router = express.Router();

const {
  signUp,
  login,
  logout,
  forgetPassword,
  deleteUser,
  sendOtp,
  sendOtpForDeleteUser
} = require("../controller/authController");

const { userAuth } = require("../middlewares/auth");

router.post("/sendOtp", sendOtp);
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/updatePassword", forgetPassword);
router.post("/sendDeleteOtp", userAuth, sendOtpForDeleteUser);
router.post("/delete", userAuth, deleteUser);

module.exports = router;
