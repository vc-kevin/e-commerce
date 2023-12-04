const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  verified: Boolean,
  verificationToken: String,
  verificationTokenExpiration: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpiration: Date,
  cart: [CartItemSchema],
});

const User = mongoose.model('User', UserSchema);
module.exports = User;