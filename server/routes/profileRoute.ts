import { Router } from "express";
import { getProfile } from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = Router()

router.get('/',authMiddleware ,getProfile)


export default router