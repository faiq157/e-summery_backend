const express = require("express");
const router = express.Router();

// Import routes
const registerRoute = require("./Register");
const loginRoute = require("./Login");
const forgotPasswordRoute = require("./ForgotPassword");
const resetPasswordRoute = require("./ResetPassword");
const logoutRoute = require("./Logout");
const editUserRoute = require("./EditUser");
const deleteUserRoute = require("./DeleteUser");
const getUsersRoute = require("./GetUsers");
const getRolesRoute = require("./GetRoles");
const verifyRoute=require('./verify-otp')

// Define routes and their prefixes
router.use("/register", registerRoute);
router.use("/login", loginRoute);
router.use("/forgotpassword", forgotPasswordRoute);
router.use("/reset-password", resetPasswordRoute);
router.use("/logout", logoutRoute);
router.use("/edit", editUserRoute);
router.use("/delete", deleteUserRoute);
router.use("/users", getUsersRoute);
router.use("/roles", getRolesRoute);
router.use('/verify-otp',verifyRoute)

module.exports = router;
