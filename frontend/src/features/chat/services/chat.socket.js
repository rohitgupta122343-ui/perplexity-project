

import { io } from "socket.io-client";


export const initSocket = ()=>{

    const socket = io('perplexity-project-production.up.railway.app',{
        withCredentials : true
    });

    socket.on('connect',(socket)=>{
        console.log('connect to socket.io server')
    })
}