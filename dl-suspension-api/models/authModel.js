import pool from "../db.js";

export async function getAuthorityLogin(
  AuthorityUserName,
  AuthorityPassword,
  UserTypeID
) {
  return await pool.query("CALL sp_getAuthorityLogin(?,?,?)", [
    AuthorityUserName,
    AuthorityPassword,
    UserTypeID,
  ]);
}
