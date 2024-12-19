import pool from "../db.js";

export async function updateDLSuspensionRecommendationDetails(
  DLSuspensionID,
  ChallanStatus,
  EntryUserID,
  Remarks
) {
  return await pool.query(
    "CALL sp_updateDLSuspensionRecommendationDetails(?, ?, ?, ?, @ErrorCode);",
    [DLSuspensionID, ChallanStatus, EntryUserID, Remarks]
  );
}
