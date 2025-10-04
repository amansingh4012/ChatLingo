import express from "express";
import { 
    getGlobalChatMessages, 
    sendGlobalChatMessage, 
    deleteGlobalChatMessage 
} from "../controllers/globalChatController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get global chat messages
router.get("/messages", protectRoute, getGlobalChatMessages);

// Send a global chat message
router.post("/messages", protectRoute, sendGlobalChatMessage);

// Delete a global chat message
router.delete("/messages/:messageId", protectRoute, deleteGlobalChatMessage);

export default router;