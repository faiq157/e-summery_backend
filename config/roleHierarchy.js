// config/roleHierarchy.js
const roleHierarchy = {
  HeadOfDepartment: ["PA","Registrar"], // HeadOfDepartment can message Registrar
  Registrar: ["HeadOfDepartment", "DRegistrar", "VC", "Establishment", "OtherRoles"], // Registrar can message everyone
  DRegistrar: ["Registrar", "VC"], // DRegistrar can message Registrar and VC
  VC: ["HeadOfDepartment", "Registrar", "DRegistrar", "Establishment", "OtherRoles"], // VC can message everyone
  Establishment: ["DRegistrar"], // Establishment can message VC and OtherRoles
  OtherRoles: ["Establishment"], // OtherRoles can only message Establishment
};

module.exports = roleHierarchy;
