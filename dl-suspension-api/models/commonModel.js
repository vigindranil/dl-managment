import pool from "../db.js";

export async function getErrorCode() {
  return await pool.query("SELECT @ErrorCode AS ErrorCode;");
}

export async function getErrorCodeAndUserID() {
  return await pool.query('SELECT @ErrorCode AS ErrorCode, @OUTUserID as OUTUserID;');
}

