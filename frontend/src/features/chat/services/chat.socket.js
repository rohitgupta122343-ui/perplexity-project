

import { io } from "socket.io-client";


export const initSocket = ()=>{

    const socket = io('http://localhost:3000',{
        withCredentials : true
    });

    socket.on('connect',(socket)=>{
        console.log('connect to socket.io server')
    })
}