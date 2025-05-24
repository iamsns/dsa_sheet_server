const express = require("express")
const cors = require("cors")
require("dotenv").config()

const routes = require("./routes/routes")
const mongoConnect = require("./db_connection/mongoose")

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

mongoConnect()
  .then(async () => {
    console.log("++++++ db connected ++++++")
    app.listen(process.env.PORT, () => {
      console.log(`****** Server is running on ${process.env.PORT} ******`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
