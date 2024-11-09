const roleHierarchy = require("../config/roleHierarchy");
const Message = require("../models/Message"); // Import the Message model
const users = {}; // Store connected users by their user ID

const messageSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Event to handle user login and associate their socket with their user ID
    socket.on("login", (userId) => {
      users[userId] = socket.id; // Store the user's socket ID by their user ID
      console.log(`User ${userId} logged in with socket ID: ${socket.id}`);
    });

    // Event to handle private messaging between users
   socket.on("private message", async ({ senderId, recipientId, content, fileUrl, fileType, fileComment }) => {
            console.log(`Message from ${senderId} to ${recipientId}: ${content}, file: ${fileUrl}, comment: ${fileComment}`);

            try {
                const sender = await User.findById(senderId);
                const recipient = await User.findById(recipientId);

                if (!sender || !recipient) {
                    console.log("Sender or recipient not found.");
                    return;
                }

                const senderRole = sender.role;
                const recipientRole = recipient.role;

                // Check if the sender can message the recipient based on role hierarchy
                if (!roleHierarchy[senderRole]?.includes(recipientRole)) {
                    console.log(`User with role ${senderRole} cannot message ${recipientRole}.`);
                    return;
                }

                // Create and save the new message (with optional file)
                const newMessage = new Message({
                    senderId,
                    recipientId,
                    content,
                    fileUrl,     // Optional file URL
                    fileType,    // Optional file type (e.g., "image", "document")
                    fileComment, // Optional comment on the file
                });
                await newMessage.save();

                // Send the message to the recipient if connected
                const recipientSocketId = users[recipientId];
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit("private message", {
                        content: newMessage.content,
                        fileUrl: newMessage.fileUrl,
                        fileType: newMessage.fileType,
                        fileComment: newMessage.fileComment,
                        senderId: newMessage.senderId,
                    });
                } else {
                    console.log(`Recipient ${recipientId} is not connected.`);
                }
            } catch (error) {
                console.error("Error sending private message:", error);
            }
        });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      // Remove the disconnected user from the users object
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} has been removed`);
          break;
        }
      }
    });
  });
};

module.exports = messageSocketHandler;
