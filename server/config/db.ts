import mongoose from 'mongoose'

const connectDB = async () =>{
    try{
        const uri = process.env.MONGODB_URI;
        if(!uri){
            console.error("MONGODB URI is not defined in the env")
            process.exit(1)
        }
        await mongoose.connect(uri)
        console.log("MongoDB Connected")
    }catch(err){
        console.error("MongoDB Connection Failed")
        process.exit(1)
    }
}

export default connectDB