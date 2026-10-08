import { Router } from "express";
import { startAttempt, getAttempt, submitAttempt } from "../controllers/attemptController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router()



router.post('/start/:testId', authMiddleware,startAttempt)
router.get('/get/:attemptId',authMiddleware, getAttempt)
router.post('/submit/:attemptId',authMiddleware, submitAttempt)



export default router


