const express = require("express")
const cors = require("cors")
const routes = require("./routes")
const logging = require("express-pino-logger")()

const app = express()

app.use(cors())
app.use(logging)
app.use(express.json())
app.use(routes)

app.listen(3333)
