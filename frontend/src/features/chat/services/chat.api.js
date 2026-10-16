
import axios from "axios";

const api = axios.create({
  baseURL: "https://perplexity-project-vay7.onrender.com",
  withCredentials: true,
});

// Send a message
export async function sendMessage({ message, chatId }) {
  const response = await api.post("/api/chats/message", {
    message,
    chatId,
  });

  return response.data;
}

// Get all chats
export async function getChats() {
  const response = await api.get("/api/chats");
  return response.data;
}

// Get messages for a particular chat
export async function getMessage(chatId) {
  const response = await api.get(
    `/api/chats/${chatId}/messages`
  );

  return response.data;
}

// Delete a chat
export async function deleteChat({ chatId }) {
  const response = await api.delete(
    `/api/chats/delete/${chatId}`
  );

  return response.data;
}

// Create a new chat
export async function createChat({ title }) {
  const response = await api.post("/api/chats/create", {
    title,
  });

  return response.data;
}
