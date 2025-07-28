const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
   role: {
    type: String,
    required:true,
  },
  department: { type: String , required: true},
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // otp: { type: String }, 
  // otpExpiry: { type: Date },
},{ timestamps: true });

// Add indexes for common query patterns
UserSchema.index({ email: 1 }, { unique: true }); // Email is unique and frequently queried
UserSchema.index({ role: 1 }); // Query by role
UserSchema.index({ department: 1 }); // Query by department
UserSchema.index({ role: 1, department: 1 }); // Compound index for role + department queries
UserSchema.index({ resetPasswordToken: 1 }); // For password reset functionality

module.exports = mongoose.model("User", UserSchema);
