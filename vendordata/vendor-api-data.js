import axios from "axios";
import regex from "../Utilis/regex.js";

async function getVendorTrackingDetails(requestBody, token) {
  try {
    const response = await axios.post(
      "https://api.expluslogistics.com/index.php?action=GetExplusTracking",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"5ae5ecea2a57fdb227d9168eade332344bb38d17205d750c6260f34bad62a65a"}`, // Add Bearer token here
        },
      }
    );
    const vendorAwbNumber = requestBody.tracking[0];

    return response.data.results[vendorAwbNumber].events
      .reverse()
      .map((result) => ({
        status: result.status,
        description: result.description,
        location: regex.replaceDPDWithShiphit(result.location),
        datetime: result.datetime,
      })); // Return API response
  } catch (error) {
    return { message: "Error with the API request", error: error.message };
  }
}

export default getVendorTrackingDetails;
