import 'dotenv/config'
import  express  from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import authMiddleware from "./middleware/authMiddleware.js";
import testRoute from "./routes/testRoute.js"
import attemptRoute from "./routes/attemptRoute.js"
import profileRoute from "./routes/profileRoute.js"


const port = 8000;
const app = express()


app.use(cors({origin : 'http://localhost:3000', credentials: true}))
app.use(express.json())
app.use(cookieParser())

await connectDB()

app.use('/login', authRoute)
app.use('/test', testRoute)
app.use('/attempt', attemptRoute)
app.use('/profile', profileRoute)

app.use('/me', authMiddleware,(req,res)=>{
    res.json({
        success : true,
        userId : req.user?.userId
    })
})




app.listen(port, ()=>{
    console.log(`Hey server is running on port ${port}`)
})