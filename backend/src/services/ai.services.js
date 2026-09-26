import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
    tool,
    createAgent
} from "langchain";

import * as z from "zod";

import { searchInternet } from "./internet.services.js";
import { sendEmail } from "./mail.services.js";


// ========================================
// GEMINI MODEL
// ========================================

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
});


// ========================================
// SEARCH TOOL
// ========================================

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",

        description:
            "Use this tool to search the latest information on the internet.",

        schema: z.object({
            query: z.string().describe("Search query to look up on the internet")
        })
    }
);


// ========================================
// EMAIL TOOL
// ========================================

const sendEmailTool = tool(
    sendEmail,
    {
        name: "sendMail",

        description:
            "Use this tool to send an email.",

        schema: z.object({

            to: z.string()
                .email()
                .describe("Receiver email address"),

            subject: z.string()
                .describe("Email subject"),

            html: z.string()
                .describe("Email body content")
        })
    }
);


// ========================================
// GEMINI AGENT
// ========================================

const agent = createAgent({

    model: geminiModel,

    tools: [
        searchInternetTool,
        sendEmailTool
    ],

    SystemMessage: `
You are a helpful AI assistant.

When generating an email:

- Always write in a polite and professional tone.
- Include a greeting.
- Include a short introduction.
- Clearly explain the main message.
- Include a helpful closing line when appropriate.
- End with "Best regards".
- Include a signature such as "[Your Name]".

Write natural, simple English.

Do not use slang.
Do not use broken sentences.
Do not generate random phrases.

Use the searchInternet tool when the user asks for current or latest information.
`
});


// ========================================
// GENERATE AI RESPONSE
// ========================================

export async function genrateRespones(messages) {

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
You are a helpful AI assistant.

Use the searchInternet tool when the user needs
latest or current information.

Always return a clear text response.
`),

            ...messages
                .map((msg) => {
                    if (msg.role === "user") {
                        return new HumanMessage(msg.content);
                    }

                    if (msg.role === "ai") {
                        return new AIMessage(msg.content);
                    }

                    return null;
                })
                .filter(Boolean)
        ]
    });

    const lastMessage = response.messages.at(-1);
    const content = lastMessage?.content;

    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part?.text) return part.text;
                return "";
            })
            .join("")
            .trim();
    }

    if (typeof content === "string") {
        return content;
    }

    if (lastMessage?.text) {
        return String(lastMessage.text);
    }

    return "Sorry, I could not generate a response.";
}


// ========================================
// GENERATE CHAT TITLE
// ========================================

export async function genrateTitle(message) {

    const response = await geminiModel.invoke([

        new SystemMessage(`
You generate concise and descriptive titles
for chat conversations.

Generate a title of only 2-4 words.

The title should:
- Clearly describe the user's topic.
- Be short.
- Be relevant.
- Be natural.

Return ONLY the title.
Do not add quotes.
Do not add explanations.
`),

        new HumanMessage(
            `Create a title for this message:

${message}`
        )
    ]);


    return response.text?.trim() || "New Chat";
}