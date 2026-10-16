
import { useDispatch } from "react-redux";

import { initSocket } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  deleteChat,
  getMessage,
  createChat,
} from "../services/chat.api";

import {
  setChats,
  setError,
  setCurrentChatId,
  setIsLoading,
  createNewChat,
  addNewMessage,
  addMessage,
} from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();

  // Send a message and receive the AI response
  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setIsLoading(true));
      dispatch(setError(null));

      let currentChatId = chatId;

      // Create a chat if no chat is selected
      if (!currentChatId) {
        const newChatData = await createChat({
          title: message,
        });

        const chat = newChatData?.chat;

        if (!chat?._id) {
          throw new Error("Failed to create chat");
        }

        currentChatId = chat._id;

        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          })
        );

        dispatch(setCurrentChatId(currentChatId));
      }

      // Display the user's message
      dispatch(
        addNewMessage({
          chatId: currentChatId,
          content: message,
          role: "user",
        })
      );

      // Send message to backend
      const data = await sendMessage({
        message,
        chatId: currentChatId,
      });

      console.log("Message API response:", data);

      // Validate AI response
      if (!data?.success || !data?.aiMessage?.content) {
        throw new Error(
          data?.message || "AI response was not received"
        );
      }

      // Display AI response
      dispatch(
        addNewMessage({
          chatId: currentChatId,
          content: data.aiMessage.content,
          role: data.aiMessage.role || "ai",
        })
      );
    } catch (err) {
      console.error(
        "Failed to send message:",
        err.response?.data || err
      );

      dispatch(
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to send message"
        )
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  // Load all chats
  async function handleGetChats() {
    try {
      dispatch(setIsLoading(true));
      dispatch(setError(null));

      const data = await getChats();
      const chats = data?.chats;

      if (!Array.isArray(chats)) {
        throw new Error("Invalid chats response");
      }

      const formattedChats = chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        };

        return acc;
      }, {});

      dispatch(setChats(formattedChats));
    } catch (err) {
      console.error(
        "Failed to load chats:",
        err.response?.data || err
      );

      dispatch(
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load chats"
        )
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  // Open an existing chat and load its messages
  async function handleOpenChat(chatId, chats) {
    dispatch(setCurrentChatId(chatId));

    if (chats[chatId]?.messages?.length) {
      return;
    }

    try {
      const data = await getMessage(chatId);

      console.log("Chat messages response:", data);

      // Backend returns messages in the "messages" array
      const messages = data?.messages;

      if (!Array.isArray(messages)) {
        throw new Error("Invalid messages response");
      }

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessage({
          chatId,
          messages: formattedMessages,
        })
      );
    } catch (err) {
      console.error(
        "Failed to load messages:",
        err.response?.data || err
      );

      dispatch(
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load messages"
        )
      );
    }
  }

  // Create a chat manually
  async function handleCreateChat({ title }) {
    try {
      dispatch(setIsLoading(true));
      dispatch(setError(null));

      const newChat = await createChat({ title });
      const chat = newChat?.chat;

      if (!chat?._id) {
        throw new Error("Failed to create chat");
      }

      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        })
      );

      dispatch(setCurrentChatId(chat._id));
    } catch (err) {
      console.error("Failed to create chat:", err);

      dispatch(
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to create chat"
        )
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  // Delete a chat
  async function handleDeleteChat({ chatId }) {
    try {
      dispatch(setIsLoading(true));
      await deleteChat({ chatId });

      // Reload the sidebar after deletion
      await handleGetChats();
    } catch (err) {
      console.error("Failed to delete chat:", err);

      dispatch(
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete chat"
        )
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  return {
    initSocket,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleCreateChat,
    handleDeleteChat,
  };
};
