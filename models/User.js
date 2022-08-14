const mongoose = require("mongoose");
const { isValidPassword } = require("mongoose-custom-validators");
const autoIncrement = require("mongoose-sequence")(mongoose);
var mongooseIntlPhoneNumber = require("mongoose-intl-phone-number");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: [true, "Must be Unique"],
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    select: false,
    validate: {
      validator: isValidPassword,
      message:
        "Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    },
  },

  gender: {
    type: String,
    required: [true, "Please enter your gender"],
  },

  mobile: {
    type: String,
    required: [true, "Please enter a mobile number"],
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  followers: [
    {
      type: Number,
      ref: "User",
    },
  ],

  following: [
    {
      type: Number,
      ref: "User",
    },
  ],
});

userSchema.plugin(autoIncrement);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

userSchema.plugin(mongooseIntlPhoneNumber, {
  hook: "validate",
  phoneNumberField: "mobile",
  countryCodeField: "countryCode",
});

module.exports = mongoose.model("User", userSchema);
