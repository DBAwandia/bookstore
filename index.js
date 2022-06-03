const express = require("express")
const dotenv = require ("dotenv")
const cors = require("cors")
const app =express()
const mongoose =require("mongoose")
const cookieParser = require("cookie-parser")
const PORT =process.env.PORT || 5000

dotenv.config()
app.use(express.json())
app.use(cors())
app.use(cookieParser())



mongoose.connect(process.env.MONGO_URL ,{ useNewUrlParser: true})
const db = mongoose.connection
db.on("err", ()=>console.log("err"))
db.once("open",()=>console.log("connected to db"))

//middlewares
app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })

})

// const adoUser = require("./example/ado")
// app.use("/ado", adoUser)

// const savedRouter = require("./example/Nyumba")
// app.use("/Nyumba", savedRouter)

const roomsRouter = require("./routes/rooms")
app.use("/rooms", roomsRouter)
// const kijikoRouter = require("./example/kijikos")
// app.use("/kijikos", kijikoRouter)

const hotelsRouter = require("./routes/hotels")
app.use("/hotels", hotelsRouter)

const userRouter = require("./routes/Users")
app.use("/Users", userRouter)

app.listen(`${PORT}`,()=> console.log("Server working"))