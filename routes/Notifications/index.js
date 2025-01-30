const express = require("express");
const router = express.Router();

const sendNotificationRoute = require("./sendNotification");
const getNotificationsRoute = require("./GetNotifications");
const deleteNotificationsRoute = require("./DeleteNotifications");

router.use("/send-notification", sendNotificationRoute);
router.use("/get-notifications", getNotificationsRoute);
router.use("/delete-notifications", deleteNotificationsRoute);

module.exports = router;
