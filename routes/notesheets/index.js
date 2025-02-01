const express = require("express");
const router = express.Router();
const createRoute = require("./CreateNotesheet");
const completeRoute = require("./CompleteNotesheet");
const sendRoute = require("./SendNotesheet");
const addCommentRoute = require("./AddCommentNotesheet");
const getRoute = require("./GetNotesheet");
const commentsRoute = require("./GetCommentsNotesheet");
const editRoute = require("./EditeNotesheet");
const deleteRoute = require("./DeleteNotesheet");
const statusCountRoute = require("./DashboardCount");
const sendTrackingIdRoute = require("./SendTrackingId");

router.use("/create", createRoute);
router.use("/complete", completeRoute);
router.use("/send", sendRoute);
router.use("/add-comment", addCommentRoute);
router.use("/notesheets", getRoute);
router.use("/comments", commentsRoute);
router.use("/edit", editRoute);
router.use("/delete", deleteRoute);
router.use("/statuscount",statusCountRoute);
router.use("/send-tracking-id", sendTrackingIdRoute);


module.exports = router;
