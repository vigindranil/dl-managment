import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import { AESEncryption } from "../encryption.js";
import { getErrorCode } from "../models/commonModel.js";
import { getNICDLSuspensionLog, saveNICDLSuspension, saveNICDLSuspensionLog } from "../models/schedulerModel.js";

export const getChallans = async (req, res) => {
  try {
    const { date, merchantid } = req.query;

    const req_param = {
      date: date,
      merchantid: merchantid,
    };

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

    // --------------------- Storing to DB : starts --------------------
    let storedCode = 0;
    let errChallan = [];
    let errCodes = [];
    apiResult?.challan_details.forEach( async (element) => {
      
      // Call the stored procedure
      await saveNICDLSuspension(element);
      
      const [saveResponse] = await getErrorCode();
      const errorCode = saveResponse[0].ErrorCode;
      storedCode += errorCode;

      if(errorCode !== 0){  // if error occurred
        errChallan = [ ...errChallan, element?.challan_no ];
        errCodes = [ ...errCodes, { error: errorCode == 2 ? "Challan record already exists" : errorCode, challan_no: element?.challan_no }]
      } 
    });
    
    
    // --------------------- Storing to DB : ends --------------------

    // Call the stored procedure
    const [spResult] = await saveNICDLSuspensionLog(date, apiResult);

    const [errorCodeResult] = await getErrorCode();

    const logErrorCode = errorCodeResult[0].ErrorCode;
    apiResult?.code == 200 && storedCode == 0 && logErrorCode == 0
    // console.log("NIC api", apiResult?.code);
    // console.log("storedCode", storedCode);
    // console.log("logErrorCode", logErrorCode);
    if (apiResult?.code == 200 && storedCode == 0 && logErrorCode == 0) {
      // Return the API response
      return res.status(200).json({
        status: 0,
        message: "Success",
        data: {...apiResult, errChallan},
      });
    } 
    else if (apiResult?.code != 200) {
      return res.status(400).json({
        status: 1,
        message: apiResult?.code,
        data: null,
      });
    }
    else if (storedCode != 0) {
      return res.status(400).json({
        status: 1,
        message: `Error occurred while storing for challan no.: ${errChallan.length != 0 && errChallan?.join(', ')}`,
        data: errCodes,
      });
    }
    else if (logErrorCode != 0) {
      return res.status(400).json({
        status: 1,
        message: "Error in Log-API call",
      });
    } else {
      // Return error response
      return res.status(500).json({
        status: 1,
        message: "Some error occurred",
        data: null,
      });
    }
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

export const getLogs = async (req, res) => {
  try {
    const { date } = req.query;
    // Call the stored procedure
    const [spResult] = await getNICDLSuspensionLog(date);
    // Check if the result contains data
    if (spResult && spResult[0].length > 0) {
      const response = spResult[0]; // Extract the RTO details from the result
      return res.status(200).json({
        status: 0,
        message: 'Log fetched successfully.',
        data: response,
      });
    } else {
      // If no data is found
      return res.status(400).json({
        status: 1,
        message: 'Failed to fetch log',
        data: null,
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: 'Internal server error',
      data: null,
    });
  }
};
