import type { Request, Response } from "express";
import Attempt from "../models/Attempt.js";
import Test from "../models/Test.js";
import Question from "../models/Question.js";
import Profile from "../models/Profile.js";

export const startAttempt = async (req : Request, res : Response) => {
    const {testId} = req.params
    const userId = req.user?.userId
    if(!userId){
        return res.status(401).json({
            success : false,
            message : "Not authenticated"
        })
    }
    const test = await Test.findById(testId)

    if (!test || !test.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }
    const questions = await Question.find({testId : testId}).select("-correctAnswer -explanation")
       
    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This test has no questions",
      });
    }

    const attempt = await Attempt.create({
        userId,
        testId,
        answers : [],
        startedAt : new Date()
    })

    return res.status(201).json({attemptId: attempt._id, test,questions})

}


export const getAttempt  = async (req :Request, res: Response) => {
    const {attemptId} = req.params;
    const userId = req.user?.userId,

    
    const attempt = await Attempt.findOne({_id : attemptId, userId}).populate("testId")
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const questions = await Question.find({testId : attempt.testId}).select("-correctAnswer -explanation")

    return res.status(200).json({
      success: true,
      attempt,
      questions
    });
}




export const submitAttempt = async (req: Request, res: Response) => {
    const {attemptId} = req.params;
    const {answers} = req.body;
    
    const userId = req.user?.userId


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    const attempt = await Attempt.findOne({
        _id : attemptId,
        userId : userId
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const questions = await Question.find({
        testId : attempt.testId
    })

     let correctAnswers = 0;
     
     const finalAnswers = answers.map((answer :any) => {
     const question = questions.find((q) => q._id.toString() === answer.questionId)

      if (!question) {
        return answer;
      }

      const isCorrect = question.correctAnswer === answer.selectedAnswer

      if(isCorrect) {correctAnswers++;}

      return {
        questionId: answer.questionId,
        selectedAnswer : answer.selectedAnswer,
        isCorrect
      }

     })

     const totalQuestions = questions.length;
     const wrongAnswers = totalQuestions - correctAnswers;
     const percentage = (correctAnswers/totalQuestions) * 100
     const passed = percentage >= 50;

     attempt.answers = finalAnswers;
     attempt.submittedAt = new Date()

     await attempt.save()

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = await Profile.create({
        userId,
      });
    }

    profile.totalTests += 1;
    profile.totalQuestions += totalQuestions;
    profile.correctAnswers += correctAnswers;
    profile.wrongAnswers += wrongAnswers;

     if (passed) {
      profile.testsPassed += 1;
    } else {
      profile.testsFailed += 1;
    }

     profile.averageScore =
      (profile.correctAnswers / profile.totalQuestions) * 100;

    if (percentage > profile.bestScore) {
      profile.bestScore = percentage;
    }

    await profile.save()

      return res.status(200).json({
      success: true,

      result: {
        score: correctAnswers,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        percentage,
        passed,
      },

      answers: finalAnswers,
    });

}