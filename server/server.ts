import  express  from "express";
const port = 8000;
const app = express()


app.use(express.json())



app.use('/', (req,res)=>{
    res.send("Hey");
})


app.listen(port, ()=>{
    console.log(`Hey server is running on port ${port}`)
})