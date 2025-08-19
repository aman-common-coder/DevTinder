const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authenication");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)




// Connect to the database
connectDB()
  .then(() => {
    console.log("DataBase connected sucesssfullly");
    app.listen(7777, () => {
      console.log("Server is running on the port 7777");
    });
  })
  .catch((err) => {
    console.log("DataBase not connected");
  });
