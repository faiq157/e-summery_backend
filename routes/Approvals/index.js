const express = require("express");
const router = express.Router();

// Import individual approval routes
const CreateRoute = require("./CreateApproval");
const DeleteRoute = require("./DeleteApprovals");
const GetApprovalIdsRoute = require("./GetApprovalIDs");
const GetApprovalRoute = require("./GetApprovals");
const GetApprovalUser = require("./GetApprovalUser");
const SendApproval = require("./SendApproval");
const SendApprovalOther = require("./SendApprovalOthers");
const UpdateApproval = require("./UpdateApproval");

router.use("/approval", CreateRoute);
router.use("/approval", DeleteRoute);
router.use("/approvals", GetApprovalIdsRoute);
router.use("/approvals", GetApprovalRoute);
router.use("/approvals/user", GetApprovalUser);
router.use("/approval/send", SendApproval);
router.use("/approval/send-other", SendApprovalOther);
router.use("/approval", UpdateApproval);



module.exports = router;
