import {
    genrateRespones,
    genrateTitle
} from "../services/ai.services.js";

import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";


export async function sendMessage(req, res) {

    try {

        const { message, chat: chatId } = req.body;

        console.log("MESSAGE REQUEST:", req.body);

        let title = null;
        let chat = null;


        // --------------------------------
        // CREATE NEW CHAT
        // --------------------------------
        if (!chatId) {

            title = await genrateTitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title
            });
        }


        // Existing chat OR newly created chat
        const currentChatId = chatId || chat._id;


        // --------------------------------
        // SAVE USER MESSAGE
        // --------------------------------
        const userMessage = await messageModel.create({
            chat: currentChatId,
            content: message,
            role: "user"
        });


        // --------------------------------
        // GET CHAT HISTORY
        // --------------------------------
        const messages = await messageModel.find({
            chat: currentChatId
        }).sort({ createdAt: 1 });


        // --------------------------------
        // GENERATE AI RESPONSE
        // --------------------------------
        const result = await genrateRespones(messages);


        // --------------------------------
        // SAVE AI MESSAGE
        // --------------------------------
        const aiMessage = await messageModel.create({
            chat: currentChatId,
            content: result,
            role: "ai"
        });


        // --------------------------------
        // SEND RESPONSE
        // --------------------------------
        return res.status(200).json({
            success: true,
            chat,
            title,
            userMessage,
            aiMessage
        });


    } catch (error) {

        console.error("SEND MESSAGE ERROR:", error);


        // Mistral / AI rate limit
        if (
            error?.status === 429 ||
            error?.statusCode === 429 ||
            error?.response?.status === 429
        ) {

            return res.status(429).json({
                success: false,
                message: "AI service rate limit exceeded. Please try again later."
            });
        }


        // Authentication error
        if (
            error?.status === 401 ||
            error?.statusCode === 401 ||
            error?.response?.status === 401
        ) {

            return res.status(401).json({
                success: false,
                message: "Invalid AI API key."
            });
        }


        // Other errors
        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
            error: error?.message || "Unknown error"
        });
    }
}



// ========================================
// GET ALL CHATS
// ========================================

export async function getChats(req, res) {

    try {

        const user = req.user;

        const chats = await chatModel.find({
            user: user.id
        }).sort({ createdAt: -1 });


        return res.status(200).json({
            success: true,
            message: "Chats retrieved successfully",
            chats
        });

    } catch (error) {

        console.error("GET CHATS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve chats",
            error: error?.message || "Unknown error"
        });
    }
}



// ========================================
// GET MESSAGES
// ========================================

export async function getMessage(req, res) {

    try {

        const { chatId } = req.params;


        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        });


        if (!chat) {

            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }


        const messages = await messageModel.find({
            chat: chatId
        }).sort({ createdAt: 1 });


        return res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            messages
        });

    } catch (error) {

        console.error("GET MESSAGE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve messages",
            error: error?.message || "Unknown error"
        });
    }
}



// ========================================
// DELETE CHAT
// ========================================

export async function deleteChat(req, res) {

    try {

        const { chatId } = req.params;


        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id
        });


        if (!chat) {

            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }


        await messageModel.deleteMany({
            chat: chatId
        });


        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (error) {

        console.error("DELETE CHAT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete chat",
            error: error?.message || "Unknown error"
        });
    }
}



// ========================================
// CREATE CHAT
// ========================================

export async function createChat(req, res) {

    try {

        const { title } = req.body;


        const chat = await chatModel.create({
            user: req.user.id,
            title
        });


        return res.status(201).json({
            success: true,
            message: "Chat created successfully",
            chat
        });

    } catch (error) {

        console.error("CREATE CHAT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create chat",
            error: error?.message || "Unknown error"
        });
    }
}