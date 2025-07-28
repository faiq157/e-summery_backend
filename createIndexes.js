const mongoose = require('mongoose');
require('dotenv').config();

// Import all models to ensure indexes are created
const User = require('./models/User');
const Notesheet = require('./models/NotesheetSchema');
const Approval = require('./models/ApprovalSchema');
const Role = require('./models/RoleSchema');
const ApprovalRole = require('./models/ApprovalRoleSchema');
const Notification = require('./models/NotificationSchema');
const PushNotificationToken = require('./models/PushNotificationToken');

async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-summery');
    console.log('Connected to MongoDB');

    // Create indexes for all collections
    console.log('Creating indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ department: 1 });
    await User.collection.createIndex({ role: 1, department: 1 });
    await User.collection.createIndex({ resetPasswordToken: 1 });
    console.log('✅ User indexes created');

    // Notesheet indexes
    await Notesheet.collection.createIndex({ trackingId: 1 }, { unique: true });
    await Notesheet.collection.createIndex({ "workflow.role": 1, "workflow.status": 1 });
    await Notesheet.collection.createIndex({ "timestamps.createdAt": -1 });
    await Notesheet.collection.createIndex({ currentHandler: 1 });
    await Notesheet.collection.createIndex({ email: 1 });
    await Notesheet.collection.createIndex({ subject: "text", userName: "text" });
    await Notesheet.collection.createIndex({ "workflow.role": 1, "timestamps.createdAt": -1 });
    await Notesheet.collection.createIndex({ "history.role": 1, "history.timeliness": 1 });
    console.log('✅ Notesheet indexes created');

    // Approval indexes
    await Approval.collection.createIndex({ userId: 1 });
    await Approval.collection.createIndex({ sentTo: 1 });
    await Approval.collection.createIndex({ status: 1 });
    await Approval.collection.createIndex({ createdAt: -1 });
    await Approval.collection.createIndex({ userId: 1, status: 1 });
    await Approval.collection.createIndex({ sentTo: 1, status: 1 });
    await Approval.collection.createIndex({ selectedRole: 1 });
    await Approval.collection.createIndex({ sended: 1 });
    console.log('✅ Approval indexes created');

    // Role indexes
    await Role.collection.createIndex({ role: 1 });
    await Role.collection.createIndex({ "selectedRole.email": 1 });
    await Role.collection.createIndex({ "selectedRole.id": 1 });
    console.log('✅ Role indexes created');

    // ApprovalRole indexes
    await ApprovalRole.collection.createIndex({ approvalAccess: 1 });
    await ApprovalRole.collection.createIndex({ createdAt: -1 });
    console.log('✅ ApprovalRole indexes created');

    // Notification indexes
    await Notification.collection.createIndex({ userId: 1 });
    await Notification.collection.createIndex({ userId: 1, isRead: 1 });
    await Notification.collection.createIndex({ sentAt: -1 });
    await Notification.collection.createIndex({ status: 1 });
    await Notification.collection.createIndex({ userId: 1, sentAt: -1 });
    console.log('✅ Notification indexes created');

    // PushNotificationToken indexes
    await PushNotificationToken.collection.createIndex({ token: 1 }, { unique: true });
    await PushNotificationToken.collection.createIndex({ userId: 1 });
    await PushNotificationToken.collection.createIndex({ userId: 1, token: 1 });
    console.log('✅ PushNotificationToken indexes created');

    console.log('🎉 All indexes created successfully!');
    
    // List all indexes for verification
    console.log('\n📋 Index Summary:');
    const collections = ['users', 'notesheets', 'approvals', 'roles', 'approvalroles', 'notifications', 'pushnotificationtokens'];
    
    for (const collectionName of collections) {
      const indexes = await mongoose.connection.db.collection(collectionName).indexes();
      console.log(`\n${collectionName.toUpperCase()} collection indexes:`);
      indexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
createIndexes(); 