
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {
    HumanMessage,
    SystemMessage,
    AIMessage,
    tool,
    createAgent,
} from "langchain";

import * as z from "zod";

import { searchInternet } from "./internet.services.js";
import { sendEmail } from "./mail.services.js";

// ========================================
// MISTRAL PRIMARY MODEL
// ========================================

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    maxRetries: 0,
});

// ========================================
// GEMINI FALLBACK MODEL
// ========================================

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// SYSTEM PROMPT
// ========================================

const systemPrompt = `
You are Perplexity AI, a helpful and reliable AI assistant.

- Give clear, accurate and useful answers.
- Use simple English when appropriate.
- Use searchInternet for current information.
- Do not invent facts or search results.
- When drafting emails, use a professional tone.
- Never send an email without explicit user confirmation.
`;

// ========================================
// SEARCH TOOL
// ========================================

const searchInternetTool = tool(searchInternet, {
    name: "searchInternet",
    description:
        "Search the internet for current or latest information.",
    schema: z.object({
        query: z.string().describe("Search query"),
    }),
});

// ========================================
// EMAIL TOOL
// ========================================

const sendEmailTool = tool(sendEmail, {
    name: "sendMail",
    description:
        "Send an email only after the user explicitly confirms sending it.",
    schema: z.object({
        to: z.string().email().describe("Recipient email address"),
        subject: z.string().describe("Email subject"),
        html: z.string().describe("HTML email body"),
    }),
});

// ========================================
// AGENTS
// ========================================

const tools = [
    searchInternetTool,
    sendEmailTool,
];

const mistralAgent = createAgent({
    model: mistralModel,
    tools,
    systemPrompt,
});

const geminiAgent = createAgent({
    model: geminiModel,
    tools,
    systemPrompt,
});

// ========================================
// FORMAT CHAT HISTORY
// ========================================

function formatMessages(messages) {
    if (!Array.isArray(messages)) {
        throw new Error("Messages must be an array.");
    }

    return messages
        .map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            }

            if (msg.role === "ai") {
                return new AIMessage(msg.content);
            }

            return null;
        })
        .filter(Boolean);
}

// ========================================
// EXTRACT AI RESPONSE
// ========================================

function extractText(response) {
    const lastMessage = response.messages?.at(-1);
    const content = lastMessage?.content;

    if (typeof content === "string") {
        return content.trim();
    }

    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") {
                    return part;
                }

                if (part && typeof part.text === "string") {
                    return part.text;
                }

                return "";
            })
            .join("")
            .trim();
    }

    return "";
}

// ========================================
// ERROR CHECK
// ========================================

function isRateLimitError(error) {
    return (
        error?.status === 429 ||
        error?.statusCode === 429 ||
        error?.response?.status === 429 ||
        /rate.?limit|too many requests|quota exceeded/i.test(
            error?.message || ""
        )
    );
}

// ========================================
// GENERATE AI RESPONSE
// ========================================

export async function genrateRespones(messages) {
    const formattedMessages = formatMessages(messages);

    try {
        const response = await mistralAgent.invoke({
            messages: formattedMessages,
        });

        const answer = extractText(response);

        if (answer) {
            return answer;
        }

        throw new Error("Mistral returned an empty response.");
    } catch (error) {
        console.error("Mistral request failed:", {
            status: error?.status ?? error?.statusCode,
            message: error?.message,
        });

        // Fall back only for rate limits.
        if (!isRateLimitError(error)) {
            throw error;
        }

        console.warn("Mistral rate limit detected. Trying Gemini...");

        try {
            const response = await geminiAgent.invoke({
                messages: formattedMessages,
            });

            const answer = extractText(response);

            if (!answer) {
                throw new Error("Gemini returned an empty response.");
            }

            return answer;
        } catch (fallbackError) {
            console.error("Gemini fallback failed:", {
                status:
                    fallbackError?.status ??
                    fallbackError?.statusCode,
                message: fallbackError?.message,
            });

            throw new Error(
                "Both AI providers failed. Check API keys, quotas and provider limits."
            );
        }
    }
}

// ========================================
// GENERATE CHAT TITLE
// ========================================

export async function genrateTitle(message) {
    const prompt = [
        new SystemMessage(`
Generate a concise chat title using 2-4 words.
Return only the title without quotes or explanations.
`),
        new HumanMessage(
            `Create a title for this message:\n${message}`
        ),
    ];

    try {
        const response = await mistralModel.invoke(prompt);

        const title =
            typeof response.content === "string"
                ? response.content.trim()
                : "";

        return title || "New Chat";
    } catch (error) {
        console.error("Mistral title generation failed:", {
            status: error?.status ?? error?.statusCode,
            message: error?.message,
        });

        // Title generation is optional; chat creation can continue.
        return "New Chat";
    }
}
