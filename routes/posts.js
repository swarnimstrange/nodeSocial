const express = require("express");
const {
  createPost,
  deletePost,
  likeAndUnlikePost,
  getPostOfFollowing,
  updatePost,
  addComment,
  deleteComment,
  getmylikedposts,
  getPeopleWhoLiked,
} = require("../controlller/post");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/upload").post(isAuthenticated, createPost);

router
  .route("/posts/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .delete(isAuthenticated, deletePost)
  .put(isAuthenticated, updatePost);

router.route("/getposts").get(isAuthenticated, getPostOfFollowing);
router
  .route("/comment/:id")
  .put(isAuthenticated, addComment)
  .delete(isAuthenticated, deleteComment);

router.route("/me/liked").get(isAuthenticated, getmylikedposts);
router.route("/me/liked/:id").get(isAuthenticated, getPeopleWhoLiked);

module.exports = router;
