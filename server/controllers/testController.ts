import type { Request, Response } from "express";
import Test from "../models/Test.js";

export const getTests = async (req : Request, res: Response) => {
    const tests = await Test.find({
        isPublished : true
    }).sort({createdAt : -1})

    return res.status(200).json({success : true, tests})
}