const express = require("express");
const router = express.Router();

// Import individual approval routes
const CreateRoute = require("./CreateApproval");
const DeleteRoute = require("./DeleteApprovals");
const GetApprovalIdsRoute = require("./GetApprovalIDs");
const GetApprovalRoute = require("./GetApprovals");

const SendApproval = require("./SendApproval");
const SendApprovalOther = require("./SendApprovalOthers");
const UpdateApprovalStatus = require("./UpdateApprovalStatus");
const UpdateApprovals = require("./UpdateApproval");
const CommentsApproval = require("./CommentsApproval");
const GetApprovalComments = require("./GetapprovalComments");

router.use("/approval", CreateRoute);
router.use("/approval", DeleteRoute);
router.use("/approvals", GetApprovalIdsRoute);
router.use("/approvals/user", GetApprovalRoute);
router.use("/approval/send", SendApproval);
router.use("/approval/send-other", SendApprovalOther);
router.use("/approval", UpdateApprovalStatus);
router.use("/approval", UpdateApprovals);
router.use("/approval", CommentsApproval);
router.use("/approval", GetApprovalComments);




module.exports = router;
