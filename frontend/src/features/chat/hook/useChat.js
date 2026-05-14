import { initSocket } from "../services/chat.socket";
import { sendMessage, getChats, deleteChat, getMessage,createChat } from "../services/chat.api";
import { setChats,setError,setCurrentChatId,setIsLoading, createNewChat,addNewMessage,addMessage } from "../chat.slice.js";
import { useDispatch } from "react-redux";


export const useChat = () => {

  const dispatch = useDispatch()

  async function handleSendMessage({ message, chatId }) {
    

      dispatch(setIsLoading(true))

      const data = await sendMessage({ message, chatId })
      const { chat, aiMessage } = data


      if(!chatId){

        dispatch(createNewChat({
          chatId : chat._id,
          title : chat.title
        }))
      }

      dispatch(addNewMessage({
        chatId: chatId || chat._id,
        content: message,
        role: "user"
      }))

      dispatch(addNewMessage({
        chatId: chatId || chat._id,
        content: aiMessage.content,
        role: aiMessage.role
      }))

      dispatch(setCurrentChatId(chat._id))

    }

  async function handleGetChats() { 
    dispatch(setIsLoading(true))

   
      const data = await getChats()
      const { chats } = data

    

      dispatch(setChats(chats.reduce((acc,chat)=>{
        acc[chat._id] = {
          id : chat._id,
          title : chat.title,
          messages : [],
          lastUpdated : chat.updatedAt
        }
        return acc
      },{})))


    dispatch(setIsLoading(false))
  }
async function handleOpenChat(chatId, chats) {
  dispatch(setCurrentChatId(chatId))

  if (!chats[chatId]?.messages?.length) {
    try {
      const data = await getMessage(chatId)

      const formattedMessages = data.message.map(msg => ({
        content: msg.content,
        role: msg.role
      }))

      dispatch(addMessage({
        chatId,
        messages: formattedMessages
      }))
    } catch (err) {
      console.log("Failed to load messages:", err)
    }
  }
}

async function handleCreateChat({ title }) {

  dispatch(setIsLoading(true))

  const newChat = await createChat({ title })
  const { chat } = newChat

  dispatch(createNewChat({
    chatId: chat._id,
    title: chat.title
  }))

  dispatch(setCurrentChatId(chat._id))

  dispatch(setIsLoading(false))
}


  return {
    initSocket,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleCreateChat
  }
}