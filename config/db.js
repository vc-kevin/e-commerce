const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DATABASE_URI;

const mongoDbConnection = () => {
  try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    throw error;
  }
};

module.exports = mongoDbConnection;