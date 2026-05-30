

import { io } from "socket.io-client";


export const initSocket = ()=>{

    const socket = io('https://perplexity-project-vay7.onrender.com',{
        withCredentials : true
    });

    socket.on('connect',(socket)=>{
        console.log('connect to socket.io server')
    })
}