/*
Creating a User Model 
The User model will be used to interact with the users collection in the database.
This basically tells the details of the user that will be stored in the database. 
The User model will have three fields: username, email, and password.
The username and email fields are required and must be unique.
Along with it before saving the password it will be hashed using bcryptjs.
*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});



// Hash password before saving


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
