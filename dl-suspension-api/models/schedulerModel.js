import pool from "../db.js";

export async function saveNICDLSuspension(element) {
  return await pool.query(
    "CALL sp_saveNICDLSuspension(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode);",
    [
      element?.dl_number || "N/A",
      element?.challan_no || "N/A",
      element?.challan_date || "N/A",
      element?.challan_place || "N/A",
      element?.state_code || "N/A",
      element?.accused_type || "N/A",
      element?.officer_name || "N/A",
      element?.officer_designation || "N/A",
      element?.vehicle_no || "N/A",
      element?.dl_dl_no || "N/A",
      element?.dl_driver_name || "N/A",
      element?.dl_relation_name || "N/A",
      element?.dl_present_addr || "N/A",
      element?.dl_permanent_addr || "N/A",
      element?.dl_dob || "N/A",
      element?.dl_blood_group || "N/A",
      element?.dl_issue_date || "N/A",
      element?.dl_issue_date_tr || "N/A",
      element?.dl_valid_upto || "N/A",
      element?.dl_valid_upto_tr || "N/A",
      element?.dl_gender || "N/A",
      element?.dl_vehicle_desc || "N/A",
      element?.dl_vehicle_class || "N/A",
      element?.dl_rto_code || "N/A",
      element?.dl_rto_name || "N/A",
      element?.accused_name || "N/A",
      element?.contact_no || "N/A",
      element?.rto_name || "N/A",
      element?.rto_code || "N/A",
      element?.challan_status || "N/A",
      element?.department || "N/A",
      JSON.stringify(element?.offence_details) || "[]",
      "N/A",
      element?.vehicleImg || "N/A",
      element?.vehicleImpoundImg || "N/A",
      element?.docImpoundImg || "N/A",
      "N/A",
      "N/A",
      "N/A",
      element?.dl_details_permAdd1 || "N/A",
      element?.dl_details_permAdd2 || "N/A",
      element?.dl_details_permAdd3 || "N/A",
      element?.dl_details_permPin || "N/A",
      element?.dl_details_tempAdd1 || "N/A",
      element?.dl_details_tempAdd2 || "N/A",
      element?.dl_details_tempAdd3 || "N/A",
      element?.dl_details_tempPin || "N/A",
      element?.dl_details_mobileNo || "N/A",
      element?.dl_details_dlno || "N/A",
      element?.dl_details_gender || "N/A",
      element?.dl_details_issuedt || "N/A",
      element?.dl_details_authorityName || "N/A",
      element?.dl_details_authorityCode || "N/A",
      element?.dl_details_dob || "N/A",
      element?.dl_details_bloodGroup || "N/A",
      element?.dl_details_fatherName || "N/A",
    ]
  );
}

export async function saveNICDLSuspensionLog(date, apiResult) {
  return await pool.query("CALL sp_saveNICDLSuspensionLog(?, ?, @ErrorCode);", [
    date,
    apiResult ? JSON.stringify(apiResult) : "",
  ]);
}

export async function getNICDLSuspensionLog(date) {
  return await pool.query("CALL sp_getNICDLSuspensionLog(?);", [date]);
}
