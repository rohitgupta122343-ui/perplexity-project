
import { genrateRespones,genrateTitle } from "../services/ai.services.js";
import chatModel from '../models/chatModel.js'
import messageModel from '../models/messageModel.js'

export async function sendMessage(req,res) {
    
    const {message, chat:chatId} = req.body;


    let title = null 
    let chat = null
    
    if(!chatId){

         title = await genrateTitle(message)
         chat = await chatModel.create({
            user : req.user.id,
            title,
        })
    }

    
    const userMessage = await messageModel.create({
        chat :chatId || chat._id,
        content : message,
        role : "user"
    })
    
    const messages = await messageModel.find({chat:chatId || chat._id})
    const result = await genrateRespones(messages)

     const aiMessage = await messageModel.create({
        chat :chatId || chat._id,
        content : result,
        role : "ai"
    })



    res.json({
       
        chat,
        title,
        userMessage,
        aiMessage
    })
    
}

export async function getChats(req,res){

    const user = req.user;

    const chats = await chatModel.find({user:user.id})

    res.status(200).json({
        message : "chat retrived sucessfully",
        chats
    })
}

export async function getMessage(req,res){

    const {chatId} = req.params

    const chat = await chatModel.findOne({
        _id : chatId,
        user : req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message : "chat not found"
        })
    }

    const message = await messageModel.find({
        chat : chatId
    })

    res.status(200).json({
        message : "Message retrived sucessfully",
        message
    })
}


export async function deleteChat(req,res) {
    
    const {chatId} = req.params

    const chat = await chatModel.findByIdAndDelete({
    _id : chatId,
    user : req.user.id
    })


    await messageModel.deleteMany({
        chat : chatId
    })

    if(!chat){
        return res.status(404).json({
            message : "chat not found"
        })
    }

    res.status(200).json({
        message : "chat deleted sucessfully"
    })
}

export async function createChat(req,res) {

    const {title} = req.body

    const chat = await chatModel.create({
        user : req.user.id,
        title
    })

    res.status(201).json({
        message : "chat created sucessfully",
        chat
    })
}

