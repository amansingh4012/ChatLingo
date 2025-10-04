import GlobalChat from "../models/globalChatModel.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Get all global chat messages
export const getGlobalChatMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const messages = await GlobalChat.find({ isDeleted: false })
            .populate("sender", "fullName profilePic")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Reverse to show oldest first
        const orderedMessages = messages.reverse();

        res.status(200).json({
            success: true,
            messages: orderedMessages,
            hasMore: messages.length === limit
        });
    } catch (error) {
        console.error("Error in getGlobalChatMessages:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Send a global chat message
export const sendGlobalChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.user._id;

        if (!message || message.trim() === "") {
            return res.status(400).json({ 
                success: false, 
                message: "Message content is required" 
            });
        }

        const newMessage = new GlobalChat({
            sender: senderId,
            message: message.trim()
        });

        await newMessage.save();

        // Populate sender details
        await newMessage.populate("sender", "fullName profilePic");

        // Emit to all connected clients in global chat room
        io.to("global-chat").emit("newGlobalMessage", newMessage);

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error("Error in sendGlobalChatMessage:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Delete a global chat message (only by sender)
export const deleteGlobalChatMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await GlobalChat.findById(messageId);

        if (!message) {
            return res.status(404).json({ 
                success: false, 
                message: "Message not found" 
            });
        }

        // Check if user is the sender of the message
        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "You can only delete your own messages" 
            });
        }

        // Soft delete the message
        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();

        // Emit deletion to all connected clients
        io.to("global-chat").emit("messageDeleted", { messageId });

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteGlobalChatMessage:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};