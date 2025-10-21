const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const path = require("path")
const ownersRouter = require("./routes/ownersRouter")
const productsRouter = require("./routes/productsRouter")
const usersRouter = require("./routes/usersRouter")

const db = require("./config/mongoose-connection")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname , "public")))

app.use("/owners" , ownersRouter)
app.use("/users" , usersRouter)
app.use("/products" , productsRouter)

const PORT = 3000
app.listen(PORT , () => {
    console.log(`App is running on PORT ${3000}`)
})