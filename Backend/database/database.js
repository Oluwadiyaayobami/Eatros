const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoUri = process.env.mongooseUrl || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eatro";

const dataBaseConnection = mongoose
  .connect(mongoUri)
  .then(() => console.log("database connected"))
  .catch((error) => console.log("database connection error:", error));

module.exports = dataBaseConnection;