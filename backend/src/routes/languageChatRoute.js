import express from "express";
import { 
    getLanguageChatMessages, 
    sendLanguageChatMessage, 
    deleteLanguageChatMessage 
} from "../controllers/languageChatController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get language-specific chat messages
router.get("/messages", protectRoute, getLanguageChatMessages);

// Send a language-specific chat message
router.post("/messages", protectRoute, sendLanguageChatMessage);

// Delete a language-specific chat message
router.delete("/messages/:messageId", protectRoute, deleteLanguageChatMessage);

export default router;