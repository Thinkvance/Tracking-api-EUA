function basicTrackingInfoDataFormat(data) {
  try {
    // Ensure we have a valid array
    if (!Array.isArray(data)) {
      return [];
    }

    const allowedStatuses = [
      "pickup scheduled",
      "shipment connected",
      "delivered",
    ];

    return data
      .filter((item) => {
        // Ensure Status exists and is a string
        if (!item || typeof item.Status !== "string") return false;
        return allowedStatuses.includes(item.Status.toLowerCase().trim());
      })
      .map((item) => ({
        Status: item.Status || "",
        Progress: typeof item.Progress === "boolean" ? item.Progress : false,
      }));
  } catch (error) {
    console.error("Error filtering tracking data:", error);
    return [];
  }
}

export default basicTrackingInfoDataFormat;
