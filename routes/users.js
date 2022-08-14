const express = require("express");
const {
  register,
  login,
  logout,
  editProfile,
  deleteProfile,
  getmyProfile,
  getProfile,
} = require("../controlller/user");
const { isAuthenticated } = require("../middlewares/auth");
const { followUser } = require("../controlller/follow");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/update/profile").put(isAuthenticated, editProfile);
router.route("/delete/profile").delete(isAuthenticated, deleteProfile);
router.route("/me").get(isAuthenticated, getmyProfile);
router.route("/profile/:id").get(isAuthenticated, getProfile);
router.route("/follow/:id").get(isAuthenticated, followUser);

module.exports = router;
