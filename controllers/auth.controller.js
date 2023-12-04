const User = require('../models/user.schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

require('dotenv').config();

const authController = {
  signup: async (req, res) => {
    try {
      const userData = await User.findOne({
        email: req.body.email,
      });
      let user = new User(req.body);
      if (user.email === userData?.email) {
        res.status(409).send({
          message: 'You are already registered with this email, please use another email or try to login.',
        });
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const verificationToken = generateVerificationToken();
      user.password = hashedPassword;
      user.verified = false;
      user.verificationToken = verificationToken;
      user.verificationTokenExpiration = Date.now() + 24 * 60 * 60 * 1000;
      const userDetail = await user.save();
  
      const emailBody = `Click on the following link to verify your email: http://localhost:4200/verify/${verificationToken}`;
      await sendVerificationEmail(userDetail.email, emailBody);
      res.status(200).send({
        message: 'Registration successful. Check your email for verification instructions.',
        data: userDetail
      });
    } catch (error) {
      res.status(400).send({
        message: 'Bad request',
        error: error.message,
        stack: error.stack
      });
    }
  },

  verify: async (req, res) => {
    const token = req.body.token;
    const user = await User.findOne({ verificationToken: token });
  
    if (!user) {
      res.status(400).json({
        error: 'Invalid or expired verification link.',
      });
    }
  
    if (user.verificationTokenExpiration < Date.now()) {
      res.status(400).json({
        error: 'Verification link has expired.',
      });
    }
  
    user.verified = true;
    await user.save();
  
    res.status(200).json({
      message: 'Email verified. You can now log in.',
    });
  },

  login: async (req, res) => {
    try {
      const userData = await User.findOne({
        email: req.body.email,
      });
      if (!userData) { 
        res.status(401).send({
          message: 'You are not registered yet, please register yourselves first' 
        })
      };
      if (!userData.verified) {
        res.status(401).send({
          message: 'Your account is not verified. Please check your email for verification instructions.',
        });
      }
      const passwordIsValid = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (!passwordIsValid) {
        res.status(401).send({
          message: 'Your entered password is invalid.',
        });
      }
      const payload = {
        id: userData._id,
        email: userData.email
      };
      jwt.sign(payload, process.env.SECRET_KEY, { algorithm: 'HS256' }, (err, token) => {
        if (err) throw err;
        res.status(200).send({
          message: 'Login successfully',
          token,
        });
      });
    } catch (error) {
      res.status(400).send({
        message: 'Bad request',
        error: error.message,
        stack: error.stack,
      });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(404).json({
          error: 'User not found. Please check the provided email address.',
        });
      }
  
      const resetPasswordToken = generateVerificationToken();
      const resetPasswordTokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hour
  
      // Update the user document with the reset password token and its expiration time
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordTokenExpiration = resetPasswordTokenExpiration;
      await user.save();
  
      // Send an email with the reset password instructions and token
      const emailBody = `Click on the following link to reset your password: http://localhost:4200/resetPassword/${resetPasswordToken}`;
      await sendVerificationEmail(user.email, emailBody); 
  
      res.status(200).json({
        message: 'Password reset instructions have been sent to your email address.',
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while processing your request.',
      });
    }
  },

  resetPassword: async (req, res) => {
    const { resetPasswordToken, password } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        res.status(400).json({
          error: 'Invalid or expired reset password token. Please request a new one.',
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password and clear the reset password token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiration = undefined;
      await user.save();
  
      res.status(200).json({
        message: 'Password reset successful. You can now log in with your new password.',
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while processing your request.',
      });
    }
  }
}

function generateVerificationToken() {
  return uuidv4();
}

async function sendVerificationEmail(email, text) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'kevinsmavani007@gmail.com',
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: 'kevinsmavani007@gmail.com',
    to: email,
    subject: 'Email Verification',
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
}

module.exports = authController;