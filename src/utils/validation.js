const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a Valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a valid password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "about",
    "photoUrl",
    "gender",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body)
    .forEach(keys)
    .every((feild) => {
      allowedEditFields.includes(feild);
    });
  return isEditAllowed;
};


module.exports = {
  validateSignUpData,
  validateEditProfileData,

};
