import { getErrorCodeAndUserID } from "../models/commonModel.js";
import { getAllRTODetails, getDLSuspensionRecommendationDetails, getRTODashboardCount, getRTOUserDetails, saveCreateRtoUser } from "../models/rtoAdminModel.js";
import validateFields from "../utils/validators.js";

export const createRtoUser = async (req, res) => {
  try {
    const {
      UserID,
      Username,
      UserPassword,
      FullName,
      ContactNo,
      RtoID,
      OperationStatus,
      EntryUserID,
    } = req.body;

    // Validate required fields using the validateFields function
    try {
      validateFields(req.body, [
        "UserID",
        "Username",
        "UserPassword",
        "FullName",
        "ContactNo",
        "RtoID",
        "OperationStatus",
        "EntryUserID",
      ]);
    } catch (error) {
      return res.status(400).json({
        status: 1,
        message: error.message,
        data: null,
      });
    }

    // Call the stored procedure
    const [spResult] = await saveCreateRtoUser(
      UserID,
      Username,
      UserPassword,
      FullName,
      ContactNo,
      RtoID,
      OperationStatus,
      EntryUserID
    );

    const [errorCodeResult] = await getErrorCodeAndUserID();

    const errorCode = errorCodeResult[0].ErrorCode;

    // Extract the ErrorCode from the result
    // Handle ErrorCode
    switch (errorCode) {
      case 0:
        return res.json({
          status: 0,
          message: "User created successfully",
          data: null,
        });
      case 2:
        return res.status(409).json({
          status: 1,
          message: "Username already exists",
          data: null,
        });
      case 3:
        return res.status(409).json({
          status: 1,
          message: "RTO code does not exist",
          data: null,
        });
      default:
        return res.status(500).json({
          status: 1,
          message: "An unexpected error occurred",
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

export const getRtoUserDetails = async (req, res) => {
  try {
    const { UserID } = req.query; // Get UserID from query params

    // Validate required fields using the validateFields function
    try {
      validateFields(req.query, ["UserID"]);
    } catch (error) {
      return res.status(400).json({
        status: 1,
        message: error.message,
        data: null,
      });
    }
    // Call the stored procedure
    const [spResult] = await getRTOUserDetails(UserID);

    // Check if the result contains data
    if (spResult && spResult.length > 0) {
      const userDetails = spResult[0]; // Extract the user details from the result
      return res.json({
        status: 0,
        message: "User details fetched successfully",
        data: userDetails,
      });
    } else {
      // If no user is found
      return res.status(404).json({
        status: 1,
        message: "User not found",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "Internal server error",
      data: null,
    });
  }
};

export const getAllRtoList = async (req, res) => {
  try {
    // Call the stored procedure
    const [spResult] = await getAllRTODetails();
    // Check if the result contains data
    if (spResult && spResult[0].length > 0) {
      const rtoList = spResult[0]; // Extract the RTO details from the result
      return res.status(200).json({
        status: 0,
        message: "RTO list fetched successfully.",
        data: rtoList,
      });
    } else {
      // If no data is found
      return res.status(404).json({
        status: 1,
        message: "Failed to fetch RTO list.",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "Internal server error",
      data: null,
    });
  }
};

export const getDlSuspensionRecommendationDetails = async (req, res) => {
  try {
    const { RTOCode, ChallanNumber, DLStatus, RecordRange } = req.query;

    // Validate required fields using the validateFields function
    try {
      validateFields(req.query, ["RTOCode", "ChallanNumber", "DLStatus", "RecordRange"]);
    } catch (error) {
      return res.status(400).json({
        status: 1,
        message: error.message,
        data: null,
      });
    }

    // Fetch data from the database
    const dbResults = await getDLSuspensionRecommendationDetails(RTOCode, ChallanNumber, DLStatus, RecordRange);

    // Check if dbResults is valid
    if (!dbResults || dbResults.length === 0 || !dbResults[0]) {
      return res.status(404).json({
        status: 1,
        message: "No data found",
        data: null,
      });
    }

    const rawData = dbResults[0]; // Assuming the result is an array
    const groupedData = rawData[0].reduce((acc, record) => {
      const { DLNumber, OffenceName, OffenceAct, ...otherDetails } = record;

      if (!acc[DLNumber]) {
        // Initialize a new group for this DLNumber
        acc[DLNumber] = {
          ...otherDetails, // Copy all other details (assumed common per DLNumber)
          DLNumber,
          OffenceDetails: [], // Create an array to store offences
        };
      }

      // Add the offence details to the group
      acc[DLNumber].OffenceDetails.push({ OffenceName, OffenceAct });

      return acc;
    }, {});

    // Convert the grouped object into an array
    const groupedArray = Object.values(groupedData);

    // Send the response
    return res.json({
      status: 0,
      message: "Details fetched successfully.",
      data: groupedArray, // Return the transformed data
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "Internal server error",
      data: null,
    });
  }
};

export const getRtoDashboardCount = async (req, res) => {
  try {
    const { rto_code } = req.query;
    // Call the stored procedure
    const [spResult] = await getRTODashboardCount(rto_code);
    // Check if the result contains data
    if (spResult && spResult[0].length > 0) {
      const response = spResult[0]; // Extract the RTO details from the result
      return res.status(200).json({
        status: 0,
        message: "Dashboard count fetched successfully.",
        data: response[0],
      });
    } else {
      // If no data is found
      return res.status(400).json({
        status: 1,
        message: "Failed to fetch data",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "Internal server error",
      data: null,
    });
  }
};

