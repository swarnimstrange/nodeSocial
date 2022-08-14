const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: String,

  image: {
    public_id: String,
    url: String,
  },

  video: {
    public_id: String,
    url: String,
  },

  owner: {
    type: Number,
    ref: "User",
  },

  likes: [
    {
      type: Number,
      ref: "User",
    },
  ],

  comments: [
    {
      user: {
        type: Number,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Post", postSchema);
