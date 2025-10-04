import mongoose from "mongoose";

const languageChatSchema = new mongoose.Schema({
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
    language: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
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

// Indexes for better query performance
languageChatSchema.index({ language: 1, createdAt: -1 });
languageChatSchema.index({ sender: 1 });
languageChatSchema.index({ isDeleted: 1 });
languageChatSchema.index({ language: 1, isDeleted: 1 });

const LanguageChat = mongoose.model("LanguageChat", languageChatSchema);

export default LanguageChat;