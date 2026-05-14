
import {createSlice} from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name : 'chat',
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null
    },

    reducers:{
        createNewChat : (state,action)=>{
            const {chatId,title} = action.payload
            state.chats[chatId] ={
                id:chatId,
                title,
                messages : [],
                lastUpdated : new Date().toISOString()
            }
        },
        addNewMessage :(state,action)=>{
            const {chatId,content,role} = action.payload
            state.chats[chatId].messages.push({content,role})
        },
        addMessage : (state,action)=>{
            const {chatId,messages} = action.payload
            state.chats[chatId].messages.push(...messages)
        },
        setChats: (state,action)=>{
            state.chats = action.payload
        },
        setCurrentChatId : (state,action)=>{
            state.currentChatId = action.payload
        },
        setIsLoading : (state,action)=>{
            state.isLoading = action.payload
        },
        setError : (state,action)=>{
            state.error = action.payload
        },
        updateStreamingMessage: (state, action) => {
   const { chatId, content } = action.payload

   const lastMessage =
      state.chats[chatId].messages.at(-1)

   if (lastMessage) {
      lastMessage.content = content
   }
}
    }
})

export const {setChats,setCurrentChatId,setIsLoading,setError,createNewChat,addNewMessage,addMessage,updateStreamingMessage} = chatSlice.actions
export default chatSlice.reducer