import mongoose from 'mongoose'

const attemptSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    testId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Test"
    },
    answers : [
        {

            questionId : {
                type: mongoose.Schema.Types.ObjectId,
                ref  : "Question"
            },
            selectedAnswer : {
                type : String,
                enum : ["A","B","C","D"]
            }
        }
    ],
    startedAt: {
        type : Date,
        default : Date.now,
    },
    submittedAt : Date
}, {
    timestamps : true
})


export default mongoose.model("Attempt", attemptSchema)