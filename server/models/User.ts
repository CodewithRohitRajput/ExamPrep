import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    googleId: {
        type : String,
        required: true
    },
    name:{
        type: String
    },
    email : {
        type : String,
        unique : true
    },
    profileImage: String,
    isAdmin : {
        type : Boolean,
        default: false
    },
    subscriptionStatus : {
        type: String,
        enum : ["Free", "Active", "Expired"],
        default: "Free"
    },
    subscriptionExpiry  : {
        type: Date
    },
},{
    timestamps : true
})

export default mongoose.model("User", userSchema)