import express from "express";
import { getChallans, getLogs } from "../controllers/schedulerController.js";
const router = express.Router();

router.get('/get-challans', getChallans);
router.get('/get-logs', getLogs);

export default router;
