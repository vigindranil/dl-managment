import { getErrorCode } from "../models/commonModel.js";
import { updateDLSuspensionRecommendationDetails } from "../models/challanModel.js";
import { AESEncryption } from "../encryption.js";


export const getImpondedDocs = async (req, res) => {
  try {
    const { date, merchantid, challan_no } = req.query;
    let req_param = {};

    if (challan_no) {
      // if we have a challan number it will return the single chanllang with documents
      req_param = {
        date: date,
        merchantid: merchantid,
        challan_no: challan_no,
      };
    } else {
      return res.status(400).json({
        status: 1,
        message: "Please enter challan number",
        data: null,
      });
    }

    const encryptedParameters = AESEncryption(JSON.stringify(req_param));

    // Set up the headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

    // Prepare the body payload
    const raw = JSON.stringify({
      request_data: encryptedParameters,
    });

    // Define the request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // Make the API call
    const response = await fetch(process.env.NIC_API_URL, requestOptions);

    // Parse the response
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const apiResult = await response.json();

    const impounded_docs = {
      challan_no: apiResult.challan_details[0].challan_no,
      impounded_docs: apiResult.challan_details[0].impounded_document,
      vehicleImg: apiResult.challan_details[0].vehicleImg,
      vehicleImpoundImg: apiResult.challan_details[0].vehicleImpoundImg,
      docImpoundImg: apiResult.challan_details[0].docImpoundImg,
    };

    return res.status(200).json({
      status: 0,
      message: "Success",
      data: impounded_docs,
    });
  } catch (error) {
    console.error("Error fetching challans:", error.message);
    // Return error response
    return res.status(500).json({
      status: 1,
      message: "Error fetching challans",
      data: null,
    });
  }
};

export const updatedDlSuspensionRecommendationDetails = async (req, res) => {
  try {
    const { DLSuspensionID, ChallanStatus, EntryUserID, Remarks } = req.body;

    // Call the stored procedure
    const [spResult] = await updateDLSuspensionRecommendationDetails(
      DLSuspensionID,
      ChallanStatus,
      EntryUserID,
      Remarks
    );

    const [errorCodeResult] = await getErrorCode();

    const errorCode = errorCodeResult[0].ErrorCode;

    // Handle ErrorCode
    if (errorCode == 0) {
      return res.json({
        status: 0,
        message: "Status updated successfully",
        data: null,
      });
    } else {
      return res.json({
        status: 1,
        message: "Failed to updat status",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: "Internal server error",
      data: null,
    });
  }
};
