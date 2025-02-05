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

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
