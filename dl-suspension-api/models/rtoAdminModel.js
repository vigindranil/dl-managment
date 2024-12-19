import pool from "../db.js";

export async function saveCreateRtoUser(
  UserID,
  Username,
  UserPassword,
  FullName,
  ContactNo,
  RtoID,
  OperationStatus,
  EntryUserID
) {
  return await pool.query(
    "CALL sp_saveCreateRtoUser(?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode, @OUTUserID);",
    [
      UserID,
      Username,
      UserPassword,
      FullName,
      ContactNo,
      RtoID,
      OperationStatus,
      EntryUserID,
    ]
  );
}

export async function getRTOUserDetails(UserID) {
  return await pool.query("CALL sp_getRTOUserDetails(?);", [UserID]);
}

export async function getAllRTODetails() {
  return await pool.query("CALL sp_getAllRTODetails();");
}

export async function getDLSuspensionRecommendationDetails(
  RTOCode,
  ChallanNumber,
  DLStatus,
  RecordRange
) {
  return await pool.query(
    "CALL sp_getDLSuspensionRecommendationDetails(?,?,?,?);",
    [RTOCode, ChallanNumber, DLStatus, RecordRange]
  );
}

export async function getRTODashboardCount(rto_code) {
  return await pool.query("CALL sp_getRTODashboardCount(?);", [rto_code]);
}
