import pool from "../db.js";

export async function updateDLSuspensionRecommendationDetails(
  DLSuspensionID,
  ChallanStatus,
  OnlineMeetingLink,
  EntryUserID,
  Remarks,
  HearingDate 
) {
  return await pool.query(
    "CALL sp_updateDLSuspensionRecommendationDetails(?, ?, ?, ?, ?, ?, @ErrorCode);",
    [DLSuspensionID, ChallanStatus,OnlineMeetingLink, EntryUserID, Remarks, HearingDate ]
  );
}
