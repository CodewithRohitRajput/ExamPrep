import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "User"
    },
    totalTests : {
        type : Number,
        default : 0
    },
      testsPassed: {
      type: Number,
      default: 0,
    },
    testsFailed: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
     averageScore: {
      type: Number,
      default: 0,
    },
      bestScore: {
      type: Number,
      default: 0,
    },
}, {
    timestamps : true
})

export default mongoose.model("Profile", profileSchema)