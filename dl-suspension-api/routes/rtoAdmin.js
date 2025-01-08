import express from "express";
import { createRtoUser, getAllRtoList, getDlSuspensionRecommendationDetails, getRtoDashboardCount, getRtoUserDetails, updateUserPassword } from "../controllers/rtoAdminController.js";
const router = express.Router();

router.post('/create-rto-user', createRtoUser);
router.get('/get-rto-user-details', getRtoUserDetails);
router.get('/get-all-rto-list', getAllRtoList);
router.get('/get-dl-suspension-recommendation-details', getDlSuspensionRecommendationDetails);
router.get('/get-rto-dashboard-count', getRtoDashboardCount);
router.post('/update-user-password', updateUserPassword);

export default router;
