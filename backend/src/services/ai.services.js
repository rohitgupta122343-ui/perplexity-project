import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from '@langchain/mistralai'
import {HumanMessage,SystemMessage,AIMessage,tool,createAgent} from 'langchain'
import * as z from 'zod'
import { searchInternet } from "./internet.services.js";
import { sendEmail } from "./mail.services.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model : "mistral-small-latest",
    apiKey : process.env.MISTRAL_API_KEY
})
console.log("MISTRAL:", process.env.MISTRAL_API_KEY)
const searchInternetTool = tool(
    searchInternet,{
        name : "searchInternet",
        description : "Use to search latest Information on internet",
        schema: z.object({
   query: z.string().describe("search query look up internet")
})
    }
)

const sendEmailTool = tool(
    sendEmail,{
        name : 'sendMail',
        description : 'sending a email on a internert',
      schema: z.object({
        
            to: z.string().email().describe("Receiver email address"),

            subject: z.string().describe("Email subject"),

            html: z.string().describe("Email body content"),
})
    },
)

const agent = createAgent({
    model:mistralModel,
    tools:[searchInternetTool,sendEmailTool],
    SystemMessage : `You are a professional email writing assistant.

When generating email body:
- Always write in a polite, professional tone
- Always include:
  1. Greeting (Hi / Dear)
  2. Short introduction
  3. Main message clearly
  4. Optional help line
  5. Closing (Best regards)
  6. Signature line like [Your Name]

Format must look like a real human-written email.

Do NOT use slang or casual broken sentences.
Do NOT generate random phrases and used simple english.`
})

export async function genrateRespones(messages, type) {

    const respones = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful assistant.
                Use searchInternet tool for latest info if needed.
            `),

            ...messages.map((msg) => {
                if (msg.role === "user") return new HumanMessage(msg.content);
                if (msg.role === "ai") return new AIMessage(msg.content);
                return null;
            }).filter(Boolean)
        ]
    });

    const last = respones.messages.at(-1);

    return last?.content || last?.text;
}

export async function genrateTitle(message){

    const respones = await mistralModel.invoke([
            new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the
             essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding 
             of the chat's topic.`),
            new HumanMessage(`Generate a title for a chat conversation based on the following first message ${message}`)
    ])

    return respones.text
}