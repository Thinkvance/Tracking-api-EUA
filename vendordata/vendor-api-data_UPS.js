import axios from "axios";
import regex from "../Utilis/regex.js";

async function getVendorTrackingDetails_ATLANTIC(requestBody) {
  try {
    const response = await axios.post(
      "http://worldfirst.xpresion.in/api/v1/Tracking/Tracking",
      requestBody
    );
    return [...response.data.Response.Events].map((result) => ({
      EventDate: result.EventDate,
      EventTime: result.EventTime,
      EventDate1: result.EventDate1,
      EventTime1: result.EventTime1,
      Location: result.Location,
      Status: regex.replaceDPDWithShiphit(result.Status),
      FlightCode: result.FlightCode,
      FlightName: result.FlightName,
    }));
  } catch (error) {
    return { message: "Error with the API request", error: error.message };
  }
}

export default getVendorTrackingDetails_ATLANTIC;
