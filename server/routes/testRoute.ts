import { Router } from "express";
import { getTests,  getTestbyId } from "../controllers/testController.js";

const router = Router()

router.get('/alltests', getTests)
router.get('/:testId', getTestbyId)

export default router;