var admin = require("firebase-admin");

var serviceAccount = require("../etc/secrets/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://push-notification-7b7b4.appspot.com"
});

module.exports = admin;
