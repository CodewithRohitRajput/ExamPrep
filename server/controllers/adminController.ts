import type { Request, Response } from "express";
import Test from "../models/Test.js";
import Question from "../models/Question.js";


export const uploadTest = async (req : Request, res: Response) => {
    let testId : string | undefined;
    
    const {
      title,
      description,
      topic,
      durationMinutes,
      isFree,
      questions ,
     
    } = req.body;

    const totalQuestions = questions.length
    const test = await Test.create({
        title, description, topic, durationMinutes, totalQuestions, isFree, isPublished : false
    })

     testId  = test._id.toString()

     await Question.insertMany(
        questions.map((q : {
            question : string,
            options : {A: string; B: string; C: string; D: string},
            correctAnswer : string,
            explanation? : string,
            difficulty? : string,
        }) => ({
            testId: test._id,
            question: q.question.trim(),
            options : q.options,
            correctAnswer : q.correctAnswer,
            explanation : q.explanation || "",
            difficulty : q.difficulty || "medium"
        }))
     )


     test.isPublished = true;
     await test.save()

     return res.status(201).json({
        success :true,
        message : "Uploaded successfully",
        testId : test._id
     })



}