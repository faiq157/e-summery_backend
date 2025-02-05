const express = require("express");
const router = express.Router();

const sendNotificationRoute = require("./sendNotification");
const getNotificationsRoute = require("./GetNotifications");
const deleteNotificationsRoute = require("./DeleteNotifications");
const updatedNotificationRoute = require("./UpdateNotifications")

router.use("/send-notification", sendNotificationRoute);
router.use("/get-notifications", getNotificationsRoute);
router.use("/delete-notifications", deleteNotificationsRoute);
router.use("/update-notifications",updatedNotificationRoute)

module.exports = router;
