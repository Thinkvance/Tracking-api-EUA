import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import vendor from "./routes/routes.js";
import axios from "axios";
import xml2js from "xml2js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8001;

app.use(
  cors({
    origin: "*", // or "*"
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

app.use("/api/tracking/v3", vendor);

app.get("/", (req, res) => {
  res.send("Tracking Service!!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} updated on 31 Oct, 25`);
});

app.get("/api/tracking/DHL", async (req, res) => {
  const url =
    "https://api.india.express.dhl.com/DHLWCFService_V6/DHLService.svc";

  const SITE_ID = "pettiecominIN";
  const PASSWORD = "P$2qZ#9hl@2fL^2n";
  const AWB = "3764128723";

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

    // STEP 1: Extract inner escaped XML
    const match = soapResponse.data.match(
      /<PostTracking_AllCheckpointResult>([\s\S]*?)<\/PostTracking_AllCheckpointResult>/,
    );
    let escapedXML = match ? match[1] : null;

    if (!escapedXML) return res.status(500).send({ error: "Result not found" });

    // STEP 2: Convert escaped XML to normal XML
    const unescapedXML = escapedXML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");

    // STEP 3: Parse XML to JSON
    xml2js.parseString(
      unescapedXML,
      { explicitArray: false },
      (err, jsonResult) => {
        if (err) return res.status(500).send({ error: "XML Parsing error" });

        res.send(jsonResult);
      },
    );
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send(err.response?.data || err.message);
  }
});
