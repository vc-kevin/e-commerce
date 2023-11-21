const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  verified: Boolean,
  verificationToken: String,
  verificationTokenExpiration: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpiration: Date,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;