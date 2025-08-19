const express = require("express");
const profileRouter = express.Router();
const app = express();
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cookieParser());

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}  your profile has been updated sucessfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      throw new Error("Password is required");
    }
    const passwordChange = req.user;
    passwordChange.password = await bcrypt.hash(password, 10);
    await passwordChange.save();
    res.send("Password edited successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
