import Router from "express"
import { uploadTest } from "../controllers/adminController.js"
import authMiddleware from "../middleware/authMiddleware.js"
const router = Router()



router.post('/upload',authMiddleware ,uploadTest)

export default router