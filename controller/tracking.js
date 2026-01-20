import getVendorTrackingDetails from "../vendordata/vendor-api-data.js";
import getTrackingStatus from "../Utilis/dataformat.js";
import admin from "firebase-admin";
import getUpdatedTrackingStructure from "../Utilis/formatedTrackingDetails.js";
import staticData from "../Utilis/staticData.js";
import getEstimatedDate from "../Utilis/getEstimatedDate.js";
import getRecentEvent from "../Utilis/getRecentEvent.js";
import basicTrackingInfoDataFormat from "../Utilis/basicTrackingInfoDataFormat.js";
import vendorCredentials from "../Utilis/credentials.js";
import getVendorTrackingDetails_ATLANTIC from "../vendordata/vendor-api-data_ATLANTIC.js";
import getVendorTrackingDetails_UPS from "../vendordata/vendor-api-data_UPS.js";
import getVendorTrackingDetails_ICLSelf from "../vendordata/vendor-api-data_ICLSelf.js";
import getVendorTrackingDetails_DHL from "../vendordata/vendor-api-data_DHL.js";
// Load service account JSON using fs/promises
const serviceAccount = {
  type: "service_account",
  project_id: "shiphitmobileapppickup-fb7e2",
  private_key_id: "0644b5011ef76b7fa4580fe78f4486ab63ed1d4d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTlqTcu+appYIB\n92IMWnFjRtRZ6zkdpXrjWSrRqL0BKq9IlFR3DJ7xUUoXYS4J9k74I2jR/s7rip6K\npo/2KX/E+7zPNWjQ4B2G8xMweLckI8P5wn4FtXW4xFt1gk2RowjjeUJpy8Hz9ZDi\nPaAXSD/p++EdYx+UXHOwdWW9O3XpBgjvK2J/gd86+o8A9mwkD2SqA2XWSMFqNgNn\nYGThZba/zKM3qiwY3pD0mBwETt1GLgQKe9w412S7fVnM4mnaUrW7MeMj7GATHcxR\n8y3J8E9VBWl9f/KsrIzz+mW0QYrk74Yc/TrsoMfHfAyc65igMazf7Afwhoue1bmg\nKKqKCa7PAgMBAAECggEACrr4pwEYesE1mkGGq9DoyZVNlTad2BtzFsiIDvq06xqh\nED5r5V9Me2x/ip2Xc7kVp1vhJ8hf8gelPRIJYJbmL4IDJ0PMI87Z1uT8GiWYR0rq\npP+KDvwO3+a4kXlt0zvANz9uo/+wJfeHXqt4mcJ32B2GYxkkM6ZX1gd+HpFymPVp\nUYbXC09ANrjciLpoZQ3xAVb71ao9QYDjVu3PVoFbkgsbrng9C6wr8mkFpeHdieG7\nzNWJqnJbenPUPCp7B2ullm9/0+RTbuxbSFd6Rw3Fb2CF8V0+8t1TaHcg8QIk/Hru\nYahhIum9UaGNhaWdpco/Tmq5vrhA96h6Xt6yPgIgMQKBgQD66Hr+/5oLHowolSKp\njRDFtuMM3OOmsXCfa0JqJI4cCMKQcODQmKJM0/ey845XS4Ag+B4Ctw8eYYD0hOTj\nGjFbR6w1ttwzWkz8fgKnWmHyfBfEXxeCa2esfqAnHpd1gfbck3exRyy+9ankv6ya\n8/0q3De/JlgV9IykD6cst5S9ewKBgQDX4ePEOzz+QtxjJ/kD6uUi7u/irPMhBtz8\n2N/Yk3EQHcTlNdTy0MV2HjXddRtViNyWrlDm2U/IZk04BZIPxSGNjwNsZvtWZ26S\n5MPNkNugkliL3P/QhxAzmYsvggwXKAHmhsByYK34WpyUr1/zRhvmEJx0rNHWkb3p\n1XAfFrvxvQKBgBpSJwz3DVbbRoK/WlqFBNxo2hqwVWVYOeNPYjE2Un4YYSi73qmj\nSWtb1SE9sZHwxqkuvh80yu459kgwZL56MfFMbIFaBHGSqH7YTTj3H01LvUaJXzL8\nR2zt/6j66ZKXJqlvAuBjAguqQ79OaDH9JHLJlUOFJzpuZA6V4cisHXtfAoGBAIUR\n44DY9v7PneOtBwzIJNfEqq9x5igMf/mHgWuRbtb9Upnq9cl6sMzfUFqizeeKhlaH\nOq0hdNFVZfHLVT5NSCJm7jhKvlCDTyBSzPMQgKDYtKX54uHZ7z2vPqFZKzS2330G\nwOd/+pyk1fG8rItbQuUshhRRVsNJcOQLQaKYM9+NAoGBAPCs+pxTT1w0d2ich4me\nOz8+K0CCjJbd/VmOfc3nt2v788fsVlP4P+b3X6SDiAr1as7zQb1v/22lomH8XFPS\nOOHl0XffpH5d7YyT3RxOMxa6WlUs9+ZqeE5MYbxvPNXoog81lN/+f4JVk07MykVZ\nCGNyvNCzfNEuozQEZ/6cdgAM\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@shiphitmobileapppickup-fb7e2.iam.gserviceaccount.com",
  client_id: "109503023363384616572",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40shiphitmobileapppickup-fb7e2.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getTrackingDetails = async (req, res) => {
  const { awbNumber } = req.body;

  if (!awbNumber) {
    return res.status(400).json({ error: "awbNumber is required" });
  }

  try {
    const snapshot = await db
      .collection("pickup")
      .where("awbNumber", "==", awbNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "No document found with that awbNumber" });
    }

    const docData = snapshot.docs[0].data();
    const requestBody = {
      carrier: "ExPlus",
      tracking: [docData.vendorAwbnumber?.toUpperCase()],
    };

    const shipmentDetails = {
      awbNumber: docData.awbNumber,
      consigneephonenumber: docData.consigneephonenumber,
      consignorphonenumber: docData.consignorphonenumber,
      Delivery_Mode: docData.service,
      Number_of_Boxes: docData.actualNoOfPackages
        ? docData.actualNoOfPackages
        : docData.postNumberOfPackages
          ? docData.postNumberOfPackages
          : Math.ceil(parseInt(docData.weightapx.replace(/\s*KG/i, "")) / 25),
      Courier_Weight: docData.actualWeight
        ? docData.actualWeight
        : docData.postPickupWeight
          ? docData.postPickupWeight
          : docData.weightapx
            ? docData.weightapx.replace(/\s*KG/i, "")
            : "",
      receipt: docData.payment_Receipt_URL,
      EstimatedDate: getEstimatedDate.getEstimatedDate(
        docData.packageConnectedDataTime,
        docData.service,
        docData.destination,
      ),
    };

    const statusTrail = getTrackingStatus(docData.status, docData);

    if (docData.status !== "SHIPMENT CONNECTED") {
      return res.status(200).json({
        shipmentDetails: shipmentDetails,
        trackingDetails: [...statusTrail, ...staticData],
        basicTrackingData: basicTrackingInfoDataFormat([
          ...statusTrail,
          ...staticData,
        ]),
        currentStatus: getRecentEvent([...statusTrail, ...staticData]),
      });
    }

    // If SHIPMENT CONNECTED, get vendor details and return
    const vendorResponse = await getVendorTrackingDetails(requestBody);
    const updatedStructure =
      getUpdatedTrackingStructure.getUpdatedTrackingStructure(
        vendorResponse,
        statusTrail,
        shipmentDetails,
      );

    return res.send(updatedStructure);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTrackingDetails_ATLANTIC = async (req, res) => {
  const { awbNumber } = req.body;

  if (!awbNumber) {
    return res.status(400).json({ error: "awbNumber is required!!" });
  }

  try {
    const snapshot = await db
      .collection("pickup")
      .where("awbNumber", "==", awbNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "No document found with that awbNumber" });
    }

    const docData = snapshot.docs[0].data();

    const requestBody = {
      UserID: "ECSG03",
      Password: "ECSG03@123",
      Type: "A",
      AWBNo: docData.vendorAwbnumber,
    };

    const shipmentDetails = {
      awbNumber: docData.awbNumber,
      Delivery_Mode: docData.service,
      Number_of_Boxes: docData.actualNoOfPackages
        ? docData.actualNoOfPackages
        : docData.postNumberOfPackages
          ? docData.postNumberOfPackages
          : Math.ceil(parseInt(docData.weightapx.replace(/\s*KG/i, "")) / 25),
      Courier_Weight: docData.actualWeight
        ? docData.actualWeight
        : docData.postPickupWeight
          ? docData.postPickupWeight
          : docData.weightapx
            ? docData.weightapx.replace(/\s*KG/i, "")
            : "",
      receipt: docData.payment_Receipt_URL,
      EstimatedDate: getEstimatedDate.getEstimatedDate(
        docData.packageConnectedDataTime,
        docData.service,
        docData.destination,
      ),
    };

    const statusTrail = getTrackingStatus(docData.status, docData);

    if (docData.status !== "SHIPMENT CONNECTED") {
      return res.status(200).json({
        shipmentDetails: shipmentDetails,
        trackingDetails: [...statusTrail, ...staticData],
        currentStatus: getRecentEvent([...statusTrail, ...staticData]),
        basicTrackingData: basicTrackingInfoDataFormat([
          ...statusTrail,
          ...staticData,
        ]),
      });
    }

    const vendorResponse = await getVendorTrackingDetails_ATLANTIC(requestBody);
    const updatedStructure =
      getUpdatedTrackingStructure.getUpdatedTrackingStructure_ATLANTIC(
        vendorResponse,
        statusTrail,
        shipmentDetails,
      );

    return res.send(updatedStructure);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTrackingDetails_UPS = async (req, res) => {
  const { awbNumber } = req.body;

  if (!awbNumber) {
    return res.status(400).json({ error: "awbNumber is required!!" });
  }

  try {
    const snapshot = await db
      .collection("pickup")
      .where("awbNumber", "==", awbNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "No document found with that awbNumber" });
    }

    const docData = snapshot.docs[0].data();

    const requestBody = {
      UserID: "WF200",
      Password: "PETTI@123",
      Type: "A",
      AWBNo: docData.vendorAwbnumber,
    };

    const shipmentDetails = {
      awbNumber: docData.awbNumber,
      consigneephonenumber: docData.consigneephonenumber,
      consignorphonenumber: docData.consignorphonenumber,

      Delivery_Mode: docData.service,
      Number_of_Boxes: docData.actualNoOfPackages
        ? docData.actualNoOfPackages
        : docData.postNumberOfPackages
          ? docData.postNumberOfPackages
          : Math.ceil(parseInt(docData.weightapx.replace(/\s*KG/i, "")) / 25),
      Courier_Weight: docData.actualWeight
        ? docData.actualWeight
        : docData.postPickupWeight
          ? docData.postPickupWeight
          : docData.weightapx
            ? docData.weightapx.replace(/\s*KG/i, "")
            : "",
      receipt: docData.payment_Receipt_URL,
      EstimatedDate: getEstimatedDate.getEstimatedDate(
        docData.packageConnectedDataTime,
        docData.service,
        docData.destination,
      ),
    };

    const statusTrail = getTrackingStatus(docData.status, docData);

    if (docData.status !== "SHIPMENT CONNECTED") {
      return res.status(200).json({
        shipmentDetails: shipmentDetails,
        trackingDetails: [...statusTrail, ...staticData],
        currentStatus: getRecentEvent([...statusTrail, ...staticData]),
        basicTrackingData: basicTrackingInfoDataFormat([
          ...statusTrail,
          ...staticData,
        ]),
      });
    }

    const vendorResponse = await getVendorTrackingDetails_UPS(requestBody);
    const updatedStructure =
      getUpdatedTrackingStructure.getUpdatedTrackingStructure_UPS(
        vendorResponse,
        statusTrail,
        shipmentDetails,
      );

    return res.send(updatedStructure);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTrackingDetails_ICLSelf = async (req, res) => {
  const { awbNumber } = req.body;
  console.log("awbNumber", awbNumber);

  if (!awbNumber) {
    return res.status(400).json({ error: "awbNumber is required!!" });
  }

  try {
    const snapshot = await db
      .collection("pickup")
      .where("awbNumber", "==", awbNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "No document found with that awbNumber" });
    }

    const docData = snapshot.docs[0].data();

    const requestBody = {
      UserID: "PETTI0",
      Password: "Nwl@1234",
      AWBNo: docData.vendorAwbnumber,
    };

    const shipmentDetails = {
      awbNumber: docData.awbNumber,
      consigneephonenumber: docData.consigneephonenumber,
      consignorphonenumber: docData.consignorphonenumber,

      Delivery_Mode: docData.service,
      Number_of_Boxes: docData.actualNoOfPackages
        ? docData.actualNoOfPackages
        : docData.postNumberOfPackages
          ? docData.postNumberOfPackages
          : Math.ceil(parseInt(docData.weightapx.replace(/\s*KG/i, "")) / 25),
      Courier_Weight: docData.actualWeight
        ? docData.actualWeight
        : docData.postPickupWeight
          ? docData.postPickupWeight
          : docData.weightapx
            ? docData.weightapx.replace(/\s*KG/i, "")
            : "",
      receipt: docData.payment_Receipt_URL,
      EstimatedDate: getEstimatedDate.getEstimatedDate(
        docData.packageConnectedDataTime,
        docData.service,
        docData.destination,
      ),
    };

    const statusTrail = getTrackingStatus(docData.status, docData);

    if (docData.status !== "SHIPMENT CONNECTED") {
      return res.status(200).json({
        shipmentDetails: shipmentDetails,
        trackingDetails: [...statusTrail, ...staticData],
        currentStatus: getRecentEvent([...statusTrail, ...staticData]),
        basicTrackingData: basicTrackingInfoDataFormat([
          ...statusTrail,
          ...staticData,
        ]),
      });
    }

    const vendorResponse = await getVendorTrackingDetails_ICLSelf(requestBody);
    const updatedStructure =
      getUpdatedTrackingStructure.getUpdatedTrackingStructure_UPS(
        vendorResponse,
        statusTrail,
        shipmentDetails,
      );

    return res.send(updatedStructure);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTrackingDetailsdhl = async (req, res) => {
  const { awbNumber } = req.body;

  if (!awbNumber) {
    return res.status(400).json({ error: "awbNumber is required!!" });
  }

  try {
    const snapshot = await db
      .collection("pickup")
      .where("awbNumber", "==", awbNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "No document found with that awbNumber" });
    }

    const docData = snapshot.docs[0].data();

    const shipmentDetails = {
      awbNumber: docData.awbNumber,
      consigneephonenumber: docData.consigneephonenumber,
      consignorphonenumber: docData.consignorphonenumber,

      Delivery_Mode: docData.service,
      Number_of_Boxes: docData.actualNoOfPackages
        ? docData.actualNoOfPackages
        : docData.postNumberOfPackages
          ? docData.postNumberOfPackages
          : Math.ceil(parseInt(docData.weightapx.replace(/\s*KG/i, "")) / 25),
      Courier_Weight: docData.actualWeight
        ? docData.actualWeight
        : docData.postPickupWeight
          ? docData.postPickupWeight
          : docData.weightapx
            ? docData.weightapx.replace(/\s*KG/i, "")
            : "",
      receipt: docData.payment_Receipt_URL,
      EstimatedDate: getEstimatedDate.getEstimatedDate(
        docData.packageConnectedDataTime,
        docData.service,
        docData.destination,
      ),
    };

    const statusTrail = getTrackingStatus(docData.status, docData);

    if (docData.status !== "SHIPMENT CONNECTED") {
      return res.status(200).json({
        shipmentDetails: shipmentDetails,
        trackingDetails: [...statusTrail, ...staticData],
        currentStatus: getRecentEvent([...statusTrail, ...staticData]),
        basicTrackingData: basicTrackingInfoDataFormat([
          ...statusTrail,
          ...staticData,
        ]),
      });
    }

    const dhlTrackingData = await getVendorTrackingDetails_DHL(
      docData.vendorAwbnumber,
    );

    if (dhlTrackingData == false) {
      return res.status(200).json({
        shipmentDetails: shipmentDetails,
        trackingDetails: [...statusTrail, ...staticData],
        currentStatus: getRecentEvent([...statusTrail, ...staticData]),
        basicTrackingData: basicTrackingInfoDataFormat([
          ...statusTrail,
          ...staticData,
        ]),
      });
    }

    try {
      res.send({
        shipmentDetails: shipmentDetails,
        trackingDetails: [...statusTrail, ...dhlTrackingData.trackingDetails],
        viewMoreDetails: dhlTrackingData.viewMoreDetails,
        basicTrackingData: basicTrackingInfoDataFormat([
          ...statusTrail,
          ...dhlTrackingData.trackingDetails,
        ]),
        currentStatus: getRecentEvent([
          ...statusTrail,
          ...dhlTrackingData.trackingDetails,
        ]),
      });
    } catch (err) {
      console.error(err);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getTrackingDetailsdhl: getTrackingDetailsdhl,
  getTrackingDetails: getTrackingDetails,
  getTrackingDetails_ATLANTIC: getTrackingDetails_ATLANTIC,
  getTrackingDetails_UPS: getTrackingDetails_UPS,
  getTrackingDetails_ICLSelf: getTrackingDetails_ICLSelf,
};
