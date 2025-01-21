const mongoose = require('mongoose');

const PushNotificationTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
});

const PushNotificationToken = mongoose.model('PushNotificationToken', PushNotificationTokenSchema);

module.exports = PushNotificationToken;
