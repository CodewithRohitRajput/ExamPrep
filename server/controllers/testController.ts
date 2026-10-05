import type { Request, Response } from "express";
import Test from "../models/Test.js";

export const getTests = async (req : Request, res: Response) => {
    const tests = await Test.find({
        isPublished : true
    }).sort({createdAt : -1})

    return res.status(200).json({success : true, tests})
}

export const getTestbyId = async (req : Request, res: Response) => {
    const {testId} = req.params;
    const test = await Test.findById(testId);
    if(!test){
        return res.status(404).json({success : false, message : "Test not found"})
    }
    if(!test.isPublished){
        return res.status(404).json({
            success : false,
            message : "Test is not published"
        })
    }
    return res.status(200).json({test})
}