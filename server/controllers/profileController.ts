import type {Request,Response} from "express"
import Profile from "../models/Profile.js"

export const getProfile = async (req : Request, res: Response) => {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    let profile = await Profile.findOne({userId}).populate("userId", "name email profileImage subscriptionStatus")

    if (!profile) {
        profile = await Profile.create({userId}).populate("userId", "name email profileImage subscriptionStatus")
    }

    return res.status(200).json({
        success: true,
        profile
    })


}
