import mongoose from 'mongoose'

const testSchema = new mongoose.Schema({
    title : String,
    description : String,
    topic : String,
    totalQuestions: Number,
    durationMinutes: Number,
    isFree :{
        type: Boolean,
        default : false
    },
    isPublished : {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})


export default mongoose.model("Test", testSchema)