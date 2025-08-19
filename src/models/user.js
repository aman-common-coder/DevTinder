const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      MaxLength: 30,
      index: true,
    },
    lastName: {
      type: String,
      MaxLength: 30,
    },
    age: {
      type: Number,
      required: true,
      min: 16,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter strong Password");
        }
      },
    },
    gender: {
      type: String,
      // required: true,
      lowercase: true,
      validate(value) {
        if (!["male", "female"].includes(value.toLowerCase())) {
          throw new Error("Gender is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about us of the user",
    },
    photoUrl: {
      type: String,
      defalut:
        "https://t4.ftcdn.net/jpg/10/74/24/27/240_F_1074242797_xGzmAvkckmCFb2u1e7fhpu6RbWljnnsb.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo Url");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model("User", userSchema);
