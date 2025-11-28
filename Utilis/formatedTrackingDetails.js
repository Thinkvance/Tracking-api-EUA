import basicTrackingInfoDataFormat from "./basicTrackingInfoDataFormat.js";
import getRecentEvent from "./getRecentEvent.js";

function getUpdatedTrackingStructure(
  trackingData,
  statusTrail,
  shipmentDetails
) {
  const STATUS_OUT_FOR = "pickup";
  const STATUS_DELIVERED = "delivered";

  const fixedStructure = [
    { Status: "UNDER CLEARANCE PROCESS" },
    { Status: "On the way" },
    { Status: STATUS_OUT_FOR },
    { Status: STATUS_DELIVERED },
  ];

  function parseDateTime(datetime) {
    if (!datetime) return null;
    const dateObj = new Date(datetime);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  }

  const delayRegex = /\bCUSTOMS(ed)?\b/i;

  function processTrackingData(data) {
    const finalStatuses = [];
    const delayStatus = [];
    const onTheWay = [];

    for (const { status, datetime, location } of data) {
      const timestamp = parseDateTime(datetime);
      const entry = {
        Status: status,
        Location: location,
        timestamp,
        DateTime: datetime,
      };

      if (status === STATUS_OUT_FOR || status === STATUS_DELIVERED) {
        finalStatuses.push(entry);
      } else if (delayRegex.test(status)) {
        delayStatus.push({ ...entry, Status: "UNDER CLEARANCE PROCESS" });
      } else {
        onTheWay.push({ ...entry, Status: "On the way" });
      }
    }

    const latestOnTheWay = onTheWay.length > 0 ? onTheWay[0] : null;
    const merged = [
      ...(latestOnTheWay ? [latestOnTheWay] : []),
      ...delayStatus,
      ...finalStatuses,
    ];

    const uniqueStatusMap = new Map();
    for (const item of merged) {
      if (!uniqueStatusMap.has(item.Status)) {
        uniqueStatusMap.set(item.Status, item);
      }
    }

    return Array.from(uniqueStatusMap.values()).sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return a.timestamp - b.timestamp;
    });
  }

  const result = processTrackingData(trackingData || []);

  const resultMap = new Map(result.map((item) => [item.Status, item]));

  let updatedStructure = fixedStructure.map((item) => {
    const match = resultMap.get(item.Status);
    return match
      ? {
          ...item,
          Progress: true,
          DateTime: match.DateTime || "",
          Location: match.Location || "",
        }
      : {
          ...item,
          Progress: false,
          DateTime: "",
          Location: "",
        };
  });

  // Mark previous steps as Progress if next step is completed
  for (let i = updatedStructure.length - 2; i >= 0; i--) {
    if (updatedStructure[i + 1].Progress) {
      updatedStructure[i].Progress = true;
    }
  }

  const lastIndex = updatedStructure
    .map((item, index) =>
      item.Progress && item.Status !== STATUS_DELIVERED ? index : -1
    )
    .filter((i) => i !== -1)
    .pop();

  if (lastIndex !== undefined && lastIndex !== null && lastIndex >= 0) {
    updatedStructure[lastIndex].dropdown = "View More";
  }
  const formatedDate = trackingData.map((value) => ({
    Status: value.status,
    Description: value.description,
    Location: value.location,
    Datetime: value.datetime,
  }));

  updatedStructure = updatedStructure.map((value) => ({
    Status: value.Status == "pickup" ? "out for delivery" : value.Status,
    Progress: value.Progress,
    DateTime: value.DateTime,
    Location: value.Location,
    dropdown: value.dropdown ? value.dropdown : "",
  }));

  return {
    shipmentDetails,
    trackingDetails: [...statusTrail, ...updatedStructure],
    viewMoreDetails: (formatedDate || []).slice().reverse(),
    basicTrackingData: basicTrackingInfoDataFormat([
      ...statusTrail,
      ...updatedStructure,
    ]),
    currentStatus: getRecentEvent([...statusTrail, ...updatedStructure]),
  };
}

function getUpdatedTrackingStructure_ATLANTIC(
  trackingData,
  statusTrail,
  shipmentDetails
) {
  const STATUS_OUT_FOR = "Out for Delivery";
  const STATUS_DELIVERED = "Delivered";

  const fixedStructure = [
    { Status: "Custom clearance" },
    { Status: "On the way" },
    { Status: STATUS_OUT_FOR },
    { Status: STATUS_DELIVERED },
  ];

  function parseDateTime(date, time) {
    if (!date || !time) return null;
    const [dd, mm, yyyy] = date.split("/");
    if (!dd || !mm || !yyyy) return null;
    const formattedTime = time.replace(/(..)(..)/, "$1:$2");
    const dateObj = new Date(`${yyyy}-${mm}-${dd}T${formattedTime}`);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  }

  const delayRegex = /\bdelay(ed)?\b/i;

  function processTrackingData(data) {
    const finalStatuses = [];
    const delayStatus = [];
    const onTheWay = [];

    for (const { Status, EventDate1, EventDate, EventTime, Location } of data) {
      const timestamp = parseDateTime(EventDate, EventTime);
      const entry = {
        Status,
        EventDate1,
        Location,
        timestamp,
      };

      if (Status === STATUS_OUT_FOR || Status === STATUS_DELIVERED) {
        finalStatuses.push(entry);
      } else if (delayRegex.test(Status)) {
        delayStatus.push({ ...entry, Status: "Custom clearance" });
      } else {
        onTheWay.push({ ...entry, Status: "On the way" });
      }
    }

    const latestOnTheWay =
      onTheWay.length > 0 ? onTheWay[onTheWay.length - 1] : null;
    const merged = [
      ...(latestOnTheWay ? [latestOnTheWay] : []),
      ...delayStatus,
      ...finalStatuses,
    ];

    const uniqueStatusMap = new Map();
    for (const item of merged) {
      if (!uniqueStatusMap.has(item.Status)) {
        uniqueStatusMap.set(item.Status, item);
      }
    }

    return Array.from(uniqueStatusMap.values()).sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return a.timestamp - b.timestamp;
    });
  }

  const result = processTrackingData(trackingData || []);
  const resultMap = new Map(result.map((item) => [item.Status, item]));

  // ✅ Build updated structure with matched results
  let updatedStructure = fixedStructure.map((item) => {
    const match = resultMap.get(item.Status);
    return match
      ? {
          ...item,
          Progress: true,
          DateTime: match.EventDate1 || "",
          Location: match.Location || "",
        }
      : {
          ...item,
          Progress: false,
          DateTime: "",
          Location: "",
        };
  });

  // ✅ Propagate progress backward
  for (let i = updatedStructure.length - 2; i >= 0; i--) {
    if (updatedStructure[i + 1].Progress) {
      updatedStructure[i].Progress = true;
    }
  }

  // ✅ Find last Progress = true (excluding DELIVERED) and add dropdown: "View More"
  const lastIndex = updatedStructure
    .map((item, index) =>
      item.Progress && item.Status !== STATUS_DELIVERED ? index : -1
    )
    .filter((i) => i !== -1)
    .pop(); // last index that is not DELIVERED

  if (lastIndex !== undefined && lastIndex !== null && lastIndex >= 0) {
    updatedStructure[lastIndex].dropdown = "View More";
  }
  trackingData = trackingData.map((result) => ({
    Datetime: result.EventDate1 + result.EventTime1,
    Location: result.Location,
    Status: result.Status,
  }));
  return {
    shipmentDetails: shipmentDetails,
    trackingDetails: [...statusTrail, ...updatedStructure],
    viewMoreDetails: (trackingData || []).slice().reverse(),
    basicTrackingData: basicTrackingInfoDataFormat([
      ...statusTrail,
      ...updatedStructure,
    ]),
    currentStatus: getRecentEvent([...statusTrail, ...updatedStructure]),
  };
}

function getUpdatedTrackingStructure_UPS(
  trackingData,
  statusTrail,
  shipmentDetails
) {
  const STATUS_OUT_FOR = "Out for Delivery";
  const STATUS_DELIVERED = "Delivered";

  const fixedStructure = [
    { Status: "Custom clearance" },
    { Status: "On the way" },
    { Status: STATUS_OUT_FOR },
    { Status: STATUS_DELIVERED },
  ];

  function parseDateTime(date, time) {
    if (!date || !time) return null;
    const [dd, mm, yyyy] = date.split("/");
    if (!dd || !mm || !yyyy) return null;
    const formattedTime = time.replace(/(..)(..)/, "$1:$2");
    const dateObj = new Date(`${yyyy}-${mm}-${dd}T${formattedTime}`);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  }

  const delayRegex = /\bdelay(ed)?\b/i;

  function processTrackingData(data) {
    const finalStatuses = [];
    const delayStatus = [];
    const onTheWay = [];

    for (const { Status, EventDate1, EventDate, EventTime, Location } of data) {
      const timestamp = parseDateTime(EventDate, EventTime);
      const entry = {
        Status,
        EventDate1,
        Location,
        timestamp,
      };

      if (Status === STATUS_OUT_FOR || Status === STATUS_DELIVERED) {
        finalStatuses.push(entry);
      } else if (delayRegex.test(Status)) {
        delayStatus.push({ ...entry, Status: "Custom clearance" });
      } else {
        onTheWay.push({ ...entry, Status: "On the way" });
      }
    }

    const latestOnTheWay = onTheWay.length > 0 ? onTheWay[0] : null;

    const merged = [
      ...(latestOnTheWay ? [latestOnTheWay] : []),
      ...delayStatus,
      ...finalStatuses,
    ];

    const uniqueStatusMap = new Map();
    for (const item of merged) {
      if (!uniqueStatusMap.has(item.Status)) {
        uniqueStatusMap.set(item.Status, item);
      }
    }

    return Array.from(uniqueStatusMap.values()).sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return a.timestamp - b.timestamp;
    });
  }

  const result = processTrackingData(trackingData || []);
  const resultMap = new Map(result.map((item) => [item.Status, item]));

  // ✅ Build updated structure with matched results
  let updatedStructure = fixedStructure.map((item) => {
    const match = resultMap.get(item.Status);
    return match
      ? {
          ...item,
          Progress: true,
          DateTime: match.EventDate1 || "",
          Location: match.Location || "",
        }
      : {
          ...item,
          Progress: false,
          DateTime: "",
          Location: "",
        };
  });

  // ✅ Propagate progress backward
  for (let i = updatedStructure.length - 2; i >= 0; i--) {
    if (updatedStructure[i + 1].Progress) {
      updatedStructure[i].Progress = true;
    }
  }

  // ✅ Find last Progress = true (excluding DELIVERED) and add dropdown: "View More"
  const lastIndex = updatedStructure
    .map((item, index) =>
      item.Progress && item.Status !== STATUS_DELIVERED ? index : -1
    )
    .filter((i) => i !== -1)
    .pop(); // last index that is not DELIVERED

  if (lastIndex !== undefined && lastIndex !== null && lastIndex >= 0) {
    updatedStructure[lastIndex].dropdown = "View More";
  }
  trackingData = trackingData.map((result) => ({
    Datetime: result.EventDate1 + result.EventTime1,
    Location: result.Location,
    Status: result.Status,
  }));
  return {
    shipmentDetails: shipmentDetails,
    trackingDetails: [...statusTrail, ...updatedStructure],
    viewMoreDetails: (trackingData || []).slice().reverse(),
    basicTrackingData: basicTrackingInfoDataFormat([
      ...statusTrail,
      ...updatedStructure,
    ]),
    currentStatus: getRecentEvent([...statusTrail, ...updatedStructure]),
  };
}

export default {
  getUpdatedTrackingStructure: getUpdatedTrackingStructure,
  getUpdatedTrackingStructure_ATLANTIC: getUpdatedTrackingStructure_ATLANTIC,
  getUpdatedTrackingStructure_UPS: getUpdatedTrackingStructure_UPS,
};
