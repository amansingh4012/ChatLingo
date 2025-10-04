import mongoose from "mongoose";

const globalChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true 
});

// Index for better query performance
globalChatSchema.index({ createdAt: -1 });
globalChatSchema.index({ sender: 1 });
globalChatSchema.index({ isDeleted: 1 });

const GlobalChat = mongoose.model("GlobalChat", globalChatSchema);

export default GlobalChat;