const mongoose = require("mongoose")
const env = require("dotenv").config()
const dataBaseConnection = mongoose.connect(process.env.mongooseUrl).then(()=>console.log("database connected ")).catch((error)=>console.log(error))
module.exports = dataBaseConnection