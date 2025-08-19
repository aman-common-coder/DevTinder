const express = require("express");
const authRouter = express.Router();
const app = express();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the user
    validateSignUpData(req);
    const { password, firstName, lastName, emailId, age } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Sucessfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = await jwt.sign(
        { _id: user._id },
        "DEV@TINDERBYAKSHAYSHARMA",
        { expiresIn: "3d" }
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 100 * 3600000),
      });
      res.send("Login Sucessfull!!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Sucessfull!!!");
});

module.exports = authRouter;
