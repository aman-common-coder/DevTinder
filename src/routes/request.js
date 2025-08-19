const express = require("express");
const requestRouter = express.Router();
const app = express();
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
app.use(express.json());
app.use(cookieParser());

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      //Status that can send
      const alllowedStatus = ["ignored", "intrested"];
      if (!alllowedStatus.includes(status)) {
        return res.json({
          message: "Invalid Status type : " + status,
        });
      }
      // if user not in the database
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.json({
          message: "User not found",
        });
      }
      // If the requset is already sent cannot send the request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res.json({
          message: "Coonnection Request already sent",
        });
      }
      const data = await connectionRequest.save();
      res.json({
        message: "Connection Request Sent Sucessfully",
        data,
      });
    } catch (err) {
      throw new Error("ERROR : " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Incorrect status type" });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      });
      
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Coonection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);
module.exports = requestRouter;
