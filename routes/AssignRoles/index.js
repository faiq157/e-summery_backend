const express = require("express");
const router = express.Router();

// Import routes
const AssignRoleRoute = require("./AssignRoleUser");
const GetAssignedRoleRoute = require("./GetAssignedRole");
const GetRoles = require("./GetRoles");

router.use("/assign-role", AssignRoleRoute);
router.use("/assigned-users", GetAssignedRoleRoute);
router.use("/get-role", GetRoles);
router.use("/approval-access", require("./ApprovalAccessRole"));
router.use("/get-approval-access", require("./getApprocalAccess"));


module.exports = router;
