import formatFirestoreTimestamp from "./formatFirestoreTimestamp.js";
import STATUS_FLOW from "./status.js";

const getTrackingStatus = (currentStatus, docData) => {
  const location = "Chennai";
  const upperStatus = currentStatus?.toUpperCase();
  const currentIndex = STATUS_FLOW.indexOf(upperStatus);
  if (currentIndex === -1) {
    return [{ Status: "Unknown Status", Location: location }];
  }

  let dataTimeDataset = [
    formatFirestoreTimestamp(docData.pickupDatetime),
    docData.pickupCompletedDatatime,
    "-",
    "-",
    "-",
    docData.PaymentComfirmedDate,
    docData.packageConnectedDataTime,
  ];

  return STATUS_FLOW.map((status, index) => ({
    Status:
      status == "RUN SHEET"
        ? "Pickup Scheduled"
        : status == "INCOMING MANIFEST"
        ? "Packed/Weighed"
        : status == "PAYMENT DONE"
        ? "Payment Received"
        : status,
    Location: location,
    Progress: index <= currentIndex,
    DateTime: dataTimeDataset[index],
    dropdown:
      status == "EXECUTIVE ON THE WAY"
        ? index <= currentIndex == true
          ? ""
          : ""
        : status == "PAYMENT DONE"
        ? index <= currentIndex == true
          ? "View Receipt"
          : ""
        : "",
  }));
};

export default getTrackingStatus;
