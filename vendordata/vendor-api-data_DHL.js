import axios from "axios";
import xml2js from "xml2js";

const DEFAULT_TRACKING_TIMELINE = [
  {
    Status: "DELIVERED",
    Location: "",
    Progress: false,
    DateTime: "",
    dropdown: "",
  },
  {
    Status: "Out For Delivery Today",
    Location: "",
    Progress: false,
    DateTime: "",
    dropdown: "",
  },
  {
    Status: "On the way",
    Location: "",
    Progress: false,
    DateTime: "",
    dropdown: "",
  },
  {
    Status: "Custom Clearence",
    Location: "",
    Progress: false,
    DateTime: "",
    dropdown: "",
  },
];

function updateStatus(timeline, status, location, dateTime) {
  const item = timeline.find((t) => t.Status === status);
  if (!item) return;

  item.Progress = true;
  item.Location = location;
  item.DateTime = dateTime;
}

function formatDHLTracking(data) {
  if (
    !data ||
    !data.AWBInfo ||
    !data.AWBInfo.ShipmentEvent ||
    Object.keys(data.AWBInfo).length === 0
  ) {
    return DEFAULT_TRACKING_TIMELINE;
  }

  const events = [...data.AWBInfo.ShipmentEvent].map((e) => ({
    ...e,
    dateTime: new Date(`${e.Date}T${e.Time}`),
  }));

  // Oldest → Latest
  events.sort((a, b) => a.dateTime - b.dateTime);

  const timeline = JSON.parse(JSON.stringify(DEFAULT_TRACKING_TIMELINE));

  let outForDeliveryIndex = -1;

  // Pass 1: detect Delivered / OFD / Customs
  events.forEach((event, index) => {
    const desc = event.Description || "";
    const location = event.ServiceAreaDescription || "";
    const dateTime = `${event.Date} ${event.Time}`;

    if (/delivered/i.test(desc)) {
      updateStatus(timeline, "DELIVERED", location, dateTime);
    }

    if (/out with courier|out for delivery/i.test(desc)) {
      updateStatus(timeline, "Out For Delivery Today", location, dateTime);
      outForDeliveryIndex = index;
    }

    if (/custom/i.test(desc)) {
      updateStatus(timeline, "Custom Clearence", location, dateTime);
    }
  });

  // Pass 2: On the way
  if (outForDeliveryIndex > 0) {
    // Preferred: event immediately before OFD
    const prevEvent = events[outForDeliveryIndex - 1];

    updateStatus(
      timeline,
      "On the way",
      prevEvent.ServiceAreaDescription || "",
      `${prevEvent.Date} ${prevEvent.Time}`,
    );
  } else {
    // 🔁 Fallback: any shipment movement = On the way
    const lastTransitEvent = [...events]
      .reverse()
      .find((e) =>
        /picked up|processed|arrived|departed/i.test(e.Description || ""),
      );

    if (lastTransitEvent) {
      updateStatus(
        timeline,
        "On the way",
        lastTransitEvent.ServiceAreaDescription || "",
        `${lastTransitEvent.Date} ${lastTransitEvent.Time}`,
      );
    }
  }

  // Reverse for UI (Latest → Oldest)
  const reversedTimeline = timeline.reverse();

  // Pass 3: Progress chain normalization
  let firstTrueIndex = -1;

  reversedTimeline.forEach((item, index) => {
    if (item.Progress && firstTrueIndex === -1) {
      firstTrueIndex = index;
    }
  });

  if (firstTrueIndex !== -1) {
    for (let i = 0; i < firstTrueIndex; i++) {
      reversedTimeline[i].Progress = true;
    }
  }
  // ✅ Pass 4: Add dropdown for "On the way"
  reversedTimeline.forEach((item) => {
    if (item.Status === "On the way" && item.Progress) {
      item.dropdown = "View More";
    }
  });

  return reversedTimeline;
}

async function getVendorTrackingDetails_DHL(AWB) {
  const url =
    "https://api.india.express.dhl.com/DHLWCFService_V6/DHLService.svc";

  const SITE_ID = "pettiecominIN";
  const PASSWORD = "P$2qZ#9hl@2fL^2n";

  const xmlData = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:Header>
        <tem:AuthHeader>
          <tem:SiteID>${SITE_ID}</tem:SiteID>
          <tem:Password>${PASSWORD}</tem:Password>
        </tem:AuthHeader>
      </soapenv:Header>
      <soapenv:Body>
        <tem:PostTracking_AllCheckpoint>
          <tem:awbnumber>${AWB}</tem:awbnumber>
        </tem:PostTracking_AllCheckpoint>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const soapResponse = await axios.post(url, xmlData, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "http://tempuri.org/IDHLService/PostTracking_AllCheckpoint",
      },
    });

    // STEP 1: Extract escaped XML
    const match = soapResponse.data.match(
      /<PostTracking_AllCheckpointResult>([\s\S]*?)<\/PostTracking_AllCheckpointResult>/,
    );

    if (!match) {
      throw new Error("PostTracking_AllCheckpointResult not found");
    }

    const escapedXML = match[1];

    // STEP 2: Unescape XML
    const unescapedXML = escapedXML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");

    // STEP 3: Parse XML → JSON (PROMISE-based)
    const jsonResult = await xml2js.parseStringPromise(unescapedXML, {
      explicitArray: false,
    });

    if (jsonResult.AWBInfo == "") {
      return false;
    }

    // ✅ RETURN DATA
    function formatTrackingEvents(events) {
      return events.map((event) => ({
        Datetime: `${event.Date} ${event.Time}`,
        Location: event.ServiceAreaDescription,
        Status: event.Description.replace(/dhl/gi, "ShipHit"),
      }));
    }

    return {
      viewMoreDetails: formatTrackingEvents(
        jsonResult.AWBInfo.ShipmentEvent.reverse(),
      ),
      trackingDetails: formatDHLTracking(jsonResult),
    };
  } catch (error) {
    console.error("DHL Tracking Error:", error.message);
    throw error; // important so caller can catch it
  }
}

export default getVendorTrackingDetails_DHL;