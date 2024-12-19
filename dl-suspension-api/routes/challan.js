import express from "express";
import { getImpondedDocs, updatedDlSuspensionRecommendationDetails } from "../controllers/challanController.js";
const router = express.Router();

router.get('/get-imponded-docs', getImpondedDocs);
router.post('/update-dl-suspension-recommendation-details', updatedDlSuspensionRecommendationDetails);

export default router;
