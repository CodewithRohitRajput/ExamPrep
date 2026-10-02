import  express  from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from "./config/db.js";

const port = 8000;
const app = express()

dotenv.config()

app.use(cors({origin : 'http://localhost:3000'}))
app.use(express.json())

await connectDB()

app.use('/', (req,res)=>{
    res.send("Hey");
})


app.listen(port, ()=>{
    console.log(`Hey server is running on port ${port}`)
})