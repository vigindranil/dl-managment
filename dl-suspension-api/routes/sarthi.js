import express from "express";
import { getDlDetails } from "../controllers/sarthiController.js";
const router = express.Router();

router.get('/get-dl-details', getDlDetails);

export default router;
