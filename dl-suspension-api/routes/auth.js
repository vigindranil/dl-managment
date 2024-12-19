import express from "express";
import {login} from '../controllers/authController.js';
const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - AuthorityUserName
 *               - AuthorityPassword
 *               - UserTypeID
 *             properties:
 *               AuthorityUserName:
 *                 type: string
 *                 example: PBDHSPUser
 *               AuthorityPassword:
 *                 type: string
 *                 example: admin@123
 *               UserTypeID:
 *                 type: integer
 *                 example: 10
 */
router.post('/login', login);

export default router;