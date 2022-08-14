const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const postRoute = require("./routes/posts");
const userRoute = require("./routes/users");

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URL);

const con = mongoose.connection;

con.on("open", () => {
  console.log("...connected");
});

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);

app.listen(8000, () => {
  console.log("server connected to port ", 8000);
});
