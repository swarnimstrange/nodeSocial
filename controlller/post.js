const User = require("../models/User");
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    if (req.body.image) {
      images = {
        public_id: req.body.image.public_id,
        url: req.body.image.url,
      };
    } else {
      images = null;
    }

    const newPostData = {
      caption: req.body.caption,
      image: images,
      owner: req.user._id,
    };

    const post = await Post.create(newPostData);

    const user = await User.findById(req.user._id);
    user.posts.push(post._id);

    await user.save();

    res.status(201).json({
      success: true,
      post,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist" });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    await post.remove();

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist" });
    }

    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);

      const indexofPost = req.user.likes.indexOf(req.params.id);
      req.user.likes.splice(indexofPost, 1);

      await post.save();
      await req.user.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked",
      });
    } else {
      post.likes.push(req.user._id);
      req.user.likes.push(req.params.id);
      await post.save();
      await req.user.save();
      return res.status(200).json({
        success: true,
        message: "Post liked",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({ owner: { $in: user.following } });

    postss = [];

    posts.forEach((post) => {
      postss.push({
        caption: post.caption,
        image: post.image,
        comments: post.comments,
      });
    });

    res.status(200).json({
      success: true,
      postss,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist" });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    post.caption = req.body.caption;
    if (req.body.image) {
      post.image = {
        public_id: req.body.image.public_id,
        url: req.body.image.url,
      };
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist" });
    }

    let commentIndex = -1;

    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      {
        post.comments[commentIndex].comment = req.body.comment;
        await post.save();
        res.status(200).json({
          success: true,
          message: "Comment updated",
        });
      }
    } else {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });
      await post.save();

      res.status(200).json({
        success: true,
        message: "Comment added",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist" });
    }

    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId === undefined) {
        return res
          .status(400)
          .json({ success: false, message: "Comment id is required" });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected Comment deleted",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      res.status(200).json({
        success: true,
        message: "Your Comment deleted",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getmylikedposts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const postss = await Post.find({ _id: { $in: user.likes } });

    posts = [];

    postss.forEach((post) => {
      if (post.owner.toString() !== req.user._id.toString()) {
        posts.push({
          id: post._id,
          caption: post.caption,
          image: post.image,
          comments: post.comments,
        });
      }
    });

    res.status(200).json({
      posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPeopleWhoLiked = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist" });
    }
    const userss = await User.find({ _id: { $in: post.likes } });

    users = [];

    userss.forEach((user) => {
      users.push({
        id: user._id,
        name: user.name,
      });
    });

    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
