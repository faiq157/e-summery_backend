// models/Message.js

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String }, 
    fileUrl: { type: String }, 
    fileType: { type: String }, 
    fileComment: { type: String }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
