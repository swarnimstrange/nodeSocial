const User = require("../models/User");

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!userToFollow) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    if (userToFollow._id.toString() === user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });
    }

    if (user.following.includes(req.params.id)) {
      const indexFollowing = user.following.indexOf(userToFollow._id);
      user.following.splice(indexFollowing, 1);

      const indexFollowers = userToFollow.followers.indexOf(user._id);
      userToFollow.followers.splice(indexFollowers, 1);

      await user.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "Unfollowed user",
      });
    } else {
      user.following.push(userToFollow._id);
      userToFollow.followers.push(user._id);

      await user.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "Followed user",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
