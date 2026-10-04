import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

const authMiddleware = async (req: Request, res: Response, next : NextFunction) => {
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                success: false,
                message : "Not authenticated"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({success : false, message : "Invalid or expired token"})
    }
}


export default authMiddleware