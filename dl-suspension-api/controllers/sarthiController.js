import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import crypto from 'crypto';
import https from 'https';
import { decryptCBC } from '../sarthi-encryption.js'

export const getDlDetails = async (req, res) => {
  try {
    const { dl_number } = req.query;

        const formData = new URLSearchParams();
        formData.append('user_id', 'indra_sanyog');
        formData.append('passkey', '*=sarathi_oth_sanyog_898#@');
        formData.append('dl_number', dl_number);
    
        const agent = new https.Agent({
          rejectUnauthorized: false,
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        });
    
        const response = await fetch(process.env.SARATHI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
          agent: agent,
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const encryptedData = await response.text();
        const decryptedData = decryptCBC(encryptedData);
        const jsonData = JSON.parse(decryptedData);
    
        return res.status(200).json({
          status: 0,
          message: "Date successfully fetched",
          data: jsonData,
        });
    
  } catch (error) {
    console.error("Error fetching challans:", error.message);

    // Return error response
    return res.status(500).json({
      status: 1,
      message: "Internal Server Error",
      data: null,
    });
  }
};
