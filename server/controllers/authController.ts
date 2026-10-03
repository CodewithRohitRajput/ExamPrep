import type { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { google } from "googleapis";
import googleClient from "../config/google.js";
import User from "../models/User.js";


export const googleLogin = async (req: Request, res: Response) => {
    const url = googleClient.generateAuthUrl({
        access_type : "offline",
        scope : [
              "https://www.googleapis.com/auth/userinfo.profile",
              "https://www.googleapis.com/auth/userinfo.email",
        ],
        prompt : "consent",
    })
    res.redirect(url);
}


export const googleCallback = async (req: Request, res:Response)=>{
    const {code} = req.query;
    if(!code){
        return res.status(400).json()
    }
    const {tokens} = await googleClient.getToken(code)
    googleClient.setCredentials(tokens)

    const oauth2 = google.oauth2({
        auth : googleClient,
        version: "v2"
    })

    const {data} = await oauth2.userinfo.get();

    let user = await User.findOne({
        googleId: data.id,
    })

    if(!user){
        user = await User.create({
        googleId: data.id,
        name: data.name,
        email: data.email,
        profileImage: data.picture,
        })
    }

    const token = jwt.sign(
        {userId : user._id,},
        process.env.JWT_SECRET!,
        {
            expiresIn : "7d"
        }
    )


        


}