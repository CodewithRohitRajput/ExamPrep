import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
    testId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Test"
    },
    question : String,
    options : {
        A : String,
        B : String,
        C : String,
        D : String,
    },
    correctAnswer : {
        type: String,
        enum : ["A","B","C","D"]
    },
    explanation : String,
    difficulty : {
        type : String,
        enum : ["easy", "medium","hard"]
    },
}, {
    timestamps: true,
})

export default mongoose.model("Question", questionSchema)