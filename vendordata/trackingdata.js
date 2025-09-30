const trackingData = [
  {
    EventDate: "23/07/2025",
    EventTime: "1917",
    EventDate1: "23rd July 2025",
    EventTime1: "7:17 PM",
    Location: "Delhi Hub",
    Status: "Shipment Manifested Day End Process",
    FlightCode: "",
    FlightName: "",
  },
  {
    EventDate: "24/07/2025",
    EventTime: "1030",
    EventDate1: "24th July 2025",
    EventTime1: "10:30 AM",
    Location: "Mumbai Hub",
    Status: "Out For Delivery Today",
    FlightCode: "",
    FlightName: "",
  },
  {
    EventDate: "24/07/2025",
    EventTime: "1530",
    EventDate1: "24th July 2025",
    EventTime1: "3:30 PM",
    Location: "Customer Location",
    Status: "DELIVERED",
    FlightCode: "",
    FlightName: "",
  },
];

function getUpdatedTrackingStructure(trackingData, statusTrail) {
  const STATUS_OUT_FOR = "Out For Delivery Today";
  const STATUS_DELIVERED = "DELIVERED";

  const fixedStructure = [
    { Status: "Custom clearance" },
    { Status: "On the way" },
    { Status: STATUS_OUT_FOR },
    { Status: STATUS_DELIVERED },
  ];

  function parseDateTime(date, time) {
    if (!date || !time) return new Date(); // fallback to current date
    try {
      return new Date(
        `${date.split("/").reverse().join("-")}T${time.replace(
          /(..)(..)/,
          "$1:$2"
        )}`
      );
    } catch {
      return new Date(); // fallback
    }
  }

  const delayRegex = /\bdelay(ed)?\b/i;

  function processTrackingData(data) {
    if (!data || data.length === 0) return [];

    const finalStatuses = [];
    const delayStatus = [];
    const onTheWay = [];

    for (const { Status, EventDate1, EventDate, EventTime, Location } of data) {
      const entry = {
        Status,
        EventDate1: EventDate1 || "",
        Location: Location || "",
        timestamp: parseDateTime(EventDate, EventTime),
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

    return Array.from(uniqueStatusMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }

  const result = processTrackingData(trackingData);
  const resultMap = new Map(result.map((item) => [item.Status, item]));

  let updatedStructure = fixedStructure.map((item) => {
    const match = resultMap.get(item.Status);
    return match
      ? {
          ...item,
          Progress: true,
          DateTime: match.EventDate1,
          Location: match.Location,
        }
      : {
          ...item,
          Progress: false,
          DateTime: "",
          Location: "",
        };
  });

  // ✅ Backfill: if next step is true, mark previous as true
  for (let i = updatedStructure.length - 2; i >= 0; i--) {
    if (updatedStructure[i + 1].Progress) {
      updatedStructure[i].Progress = true;
    }
  }

  // ✅ Extra rule: if trackingData exists, always mark first step as true
  if (trackingData.length > 0) {
    updatedStructure[0].Progress = true;
  }

  return {
    vendorData: updatedStructure,
    internalData: statusTrail,
  };
}
