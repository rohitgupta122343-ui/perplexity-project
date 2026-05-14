
import axios from 'axios'

const api = axios.create({
    baseURL : 'https://perplexity-project-vay7.onrender.com',
    withCredentials : true
})

export async function sendMessage({message,chatId}) {
    
    const res = await api.post('/api/chats/message',{ message,chat: chatId},{
        withCredentials : true
    })
    return res.data
}

export async function getChats(){

    const res = await api.get('/api/chats')
    return res.data
}

export async function getMessage(chatId){

    const res = await api.get(`/api/chats/${chatId}/messages`)
    return res.data
}

export async function deleteChat({chatId}){

    const res = await api.delete(`/api/chats/delete/${chatId}`)
    return res.data
}

export async function createChat({title}){

    const res = await api.post('/api/chats/create',{title})
    console.log(res.data);
    return res.data
}