import express from "express";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import pool from "../db.js";
import { AESEncryption } from "../encryption.js";
const router = express.Router();

router.get("/get-challans", async (req, res) => {
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
      req_param = { date: date, merchantid: merchantid };
    }

    const encryptedParameters = AESEncryption(JSON.stringify(req_param));
    // console.log("json",JSON.stringify({ date: "2024-11-12", merchantid: "WB116XHRUP13265" }));
    // console.log("req_param",req_param);

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

    // const APIRequestResponse = JSON.stringify({
    //   request: req_param,
    //   response: apiResult,
    // });
    // console.log(APIRequestResponse);
    // // Call the stored procedure
    // const [spResult] = await pool.query(
    //   "CALL sp_saveNICDLSuspensionLog(?, ?, @ErrorCode);",
    //   [date, APIRequestResponse]
    // );

    // const [errorCodeResult] = await pool.query(
    //   "SELECT @ErrorCode AS ErrorCode;"
    // );

    // const errorCode = errorCodeResult[0].ErrorCode;
    // console.log("errorCode: ", errorCodeResult);

    // if (apiResult?.data?.code == 200 && errorCode == 0) {
    //   // Return the API response
    //   return res.status(200).json({
    //     status: 0,
    //     message: "Success",
    //   });
    // } else if (apiResult?.data?.code !== 200) {
    //   return res.status(400).json({
    //     status: 1,
    //     message: apiResult?.data?.code,
    //   });
    // } else if (errorCode != 0) {
    //   return res.status(400).json({
    //     status: 1,
    //     message: "Error in Log-API call",
    //   });
    // } else {
    //   // Return error response
    //   return res.status(500).json({
    //     status: 1,
    //     message: "Some error occurred",
    //     data: null,
    //   });
    // }
  } catch (error) {
    console.error("Error fetching challans:", error.message);

    // Return error response
    return res.status(500).json({
      status: 1,
      message: "Error fetching challans",
      data: null,
    });
  }
});

export default router;
