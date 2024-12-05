import express from "express";
import pool from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Secret key for JWT (ensure this is stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Login route
router.post("/login", async (req, res) => {
  try {
    const { AuthorityUserName, AuthorityPassword, UserTypeID } = req.body;

    if (!AuthorityUserName) {
      return res.status(400).json({
        status: 1,
        message: "Invalid username",
        data: null,
      });
    } else if (!AuthorityPassword) {
      return res.status(400).json({
        status: 1,
        message: "Invalid Password",
        data: null,
      });
    } else if (!UserTypeID) {
      return res.status(400).json({
        status: 1,
        message: "Invalid user type",
        data: null,
      });
    }

    const [rows] = await pool.query("CALL sp_getAuthorityLogin(?,?,?)", [
      AuthorityUserName,
      AuthorityPassword,
      UserTypeID,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 1,
        message: "Invalid username or password",
        data: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: rows[0]["AuthorityID"], name: rows[0]["AuthorityName"] }, // Payload (custom claims)
      JWT_SECRET, // Secret key
      { expiresIn: "3h" } // Token expiry
    );

    res.json({
      status: 0,
      message: "State information fetched successfully",
      data: rows[0],
      token: token,
    });
  } catch (error) {
    console.error("Error fetching state information:", error);
    res.status(500).json({
      status: 1,
      message: "An error occurred while fetching state information",
      data: null,
    });
  }
});

export default router;
