const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectionString = process.env.mongodb_connection_string;
const colors = require("colors");

const dbConnection = () => {
  try {
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected successfully`.bgGreen);
  } catch (error) {
    console.error(`MongoDB connection error`.bgRed, error);
  }
};

module.exports = dbConnection;
