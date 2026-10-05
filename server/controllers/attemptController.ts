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


