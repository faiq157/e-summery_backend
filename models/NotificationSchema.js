const mongoose = require('mongoose');

// Define the schema for notifications
const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'User', 
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  link:{
    type:String
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    default: 'sent', // Default status is 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now, // Automatically sets the timestamp when the notification is created
  },
  isRead:{
    type:Boolean
  }
});

// Add indexes for common query patterns
NotificationSchema.index({ userId: 1 }); // Query by user ID
NotificationSchema.index({ userId: 1, isRead: 1 }); // Compound index for user + read status
NotificationSchema.index({ sentAt: -1 }); // Sort by sent date (descending)
NotificationSchema.index({ status: 1 }); // Query by notification status
NotificationSchema.index({ userId: 1, sentAt: -1 }); // Compound index for user + date

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
