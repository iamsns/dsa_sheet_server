const mongoose = require("mongoose")

const mongoConnect = () => {
  return mongoose
    .connect(process.env.DATABASE_URL)
}

module.exports = mongoConnect