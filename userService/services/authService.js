
//this basically contain login/register
//and other auth functions

const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (username, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const user = await User.create({ username, email, password });
  return { user, token: generateToken(user) };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid Credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid Credentials");

  return { user, token: generateToken(user) };
};

module.exports = { registerUser, loginUser };
