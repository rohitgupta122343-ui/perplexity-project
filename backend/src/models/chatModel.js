import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    user:{
        type:String,
        ref:'user',
        required:true
    },
    title:{
        type:String,
        default:'new chat'
    }
},{timestamps:true})


const chatModel = mongoose.model('chat',chatSchema)

export default chatModel