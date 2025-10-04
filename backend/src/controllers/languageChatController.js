import LanguageChat from "../models/languageChatModel.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Get language-specific chat messages
export const getLanguageChatMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const userLanguage = req.user.learningLanguage;
        
        // Check if user has a learning language set
        if (!userLanguage) {
            return res.status(400).json({ 
                success: false, 
                message: "Please set your learning language in your profile to access language chat rooms" 
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Only fetch messages for the user's learning language
        const messages = await LanguageChat.find({ 
            language: userLanguage.toLowerCase(),
            isDeleted: false 
        })
            .populate("sender", "fullName profilePic learningLanguage")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Reverse to show oldest first
        const orderedMessages = messages.reverse();

        res.status(200).json({
            success: true,
            messages: orderedMessages,
            language: userLanguage,
            hasMore: messages.length === limit
        });
    } catch (error) {
        console.error("Error in getLanguageChatMessages:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Send a language-specific chat message
export const sendLanguageChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.user._id;
        const userLanguage = req.user.learningLanguage;

        // Check if user has a learning language set
        if (!userLanguage) {
            return res.status(400).json({ 
                success: false, 
                message: "Please set your learning language in your profile to send messages" 
            });
        }

        if (!message || message.trim() === "") {
            return res.status(400).json({ 
                success: false, 
                message: "Message content is required" 
            });
        }

        const newMessage = new LanguageChat({
            sender: senderId,
            message: message.trim(),
            language: userLanguage.toLowerCase()
        });

        await newMessage.save();

        // Populate sender details
        await newMessage.populate("sender", "fullName profilePic learningLanguage");

        // Create language-specific room name (e.g., "spanish-chat", "french-chat")
        const languageRoom = `${userLanguage.toLowerCase()}-chat`;
        
        // Emit to all connected clients in the specific language room
        io.to(languageRoom).emit("newLanguageMessage", newMessage);

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error("Error in sendLanguageChatMessage:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Delete a language-specific chat message (only by sender)
export const deleteLanguageChatMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;
        const userLanguage = req.user.learningLanguage;

        if (!userLanguage) {
            return res.status(400).json({ 
                success: false, 
                message: "Please set your learning language in your profile" 
            });
        }

        const message = await LanguageChat.findById(messageId);

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

        // Check if message belongs to the user's language room
        if (message.language !== userLanguage.toLowerCase()) {
            return res.status(403).json({ 
                success: false, 
                message: "You can only delete messages from your language room" 
            });
        }

        // Soft delete the message
        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();

        // Create language-specific room name
        const languageRoom = `${userLanguage.toLowerCase()}-chat`;
        
        // Emit deletion to all connected clients in the language room
        io.to(languageRoom).emit("languageMessageDeleted", { messageId });

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteLanguageChatMessage:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};