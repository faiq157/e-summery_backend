var admin = require("firebase-admin");

var serviceAccount = require("../utils/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;