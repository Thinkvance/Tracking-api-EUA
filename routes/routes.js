import express from "express";

import getTrackingDetails from "../controller/tracking.js";
import getVendorTrackingDetails_ATLANTIC from "../controller/tracking.js";
const router = express.Router();

router
  .route("/explus/getTrackingStatusByAwb")
  .post(getTrackingDetails.getTrackingDetails);
router
  .route("/atlantic/getTrackingStatusByAwb")
  .post(getTrackingDetails.getTrackingDetails_ATLANTIC);
router
  .route("/ups/getTrackingStatusByAwb")
  .post(getTrackingDetails.getTrackingDetails_UPS);

export default router;
