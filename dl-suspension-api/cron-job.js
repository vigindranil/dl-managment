import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import { AESEncryption } from "./encryption.js";
import { getErrorCode } from "./models/commonModel.js";

// Schedule the cron job
async function challanScheduler() {
  // Call the function to check for challan status and update the database
  try {
    const date = new Date().toLocaleDateString("en-CA");
    const NIC_Merchant_ID = process.env.NIC_Merchant_ID;

    const req_param = {
      date: date,
      merchantid: NIC_Merchant_ID,
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
    
      if (apiResult?.code == 200 && storedCode == 0 && logErrorCode == 0) {
        // Return the API response
        console.log({
          status: "Success",
          message: `${apiResult?.challan_details?.length} records added successfully`
        });
      } 
      else if (apiResult?.code != 200) {
        console.log({
          status: 'Failure',
          message: `Failure while NIC api calling with fail code: ${apiResult?.code}`,
        });
      }
      else if (storedCode != 0) {
        console.log({
          status: 'Failure while sp calling (save)',
          message: `Challan no. already exists: ${errChallan.length != 0 && errChallan?.join(', ')}`
        });
      }
      else if (logErrorCode != 0) {
        console.log({
          status: "Failure while sp calling (log save)",
          message: `Failure executing log store procedure`,
        });
      } else {
        // Return error response
        console.log({
          status: 'Failure',
          message: `Some error occurred`,
          data: null,
        });
      }
    } catch (error) {
  
      // Return error response
      console.log({
        status: 'Failure',
        message: `Error caught: ${error.message}`,
      });
    }
}

cron.schedule("59 23 * * *", () => {
  console.log("Date: " + date);
  challanScheduler();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

// Test case
// cron.schedule("* * * * *", () => {
//   console.log("Date: " + date);
//   challanScheduler();
// }, {
//   scheduled: true,
//   timezone: "Asia/Kolkata"
// });
