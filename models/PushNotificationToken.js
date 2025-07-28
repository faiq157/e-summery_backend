const mongoose = require('mongoose');

const PushNotificationTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
});

// Add indexes for common query patterns
PushNotificationTokenSchema.index({ token: 1 }, { unique: true }); // Unique token index
PushNotificationTokenSchema.index({ userId: 1 }); // Query by user ID
PushNotificationTokenSchema.index({ userId: 1, token: 1 }); // Compound index for user + token

const PushNotificationToken = mongoose.model('PushNotificationToken', PushNotificationTokenSchema);

module.exports = PushNotificationToken;
