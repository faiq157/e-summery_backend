const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
   role: {
    type: String,
    enum: ["HeadOfDepartment", "Registrar", "DRegistrar", "VC", "Establishment", "OtherRoles"],
    default: "OtherRoles", 
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
},{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);
