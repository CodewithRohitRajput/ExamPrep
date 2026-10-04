import { Router } from "express";
import { getTests } from "../controllers/testController.js";

const router = Router()

router.get('/alltests', getTests)

export default router;