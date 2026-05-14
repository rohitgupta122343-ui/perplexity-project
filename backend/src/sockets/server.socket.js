
import {Server, Socket} from 'socket.io'

let io;

export function initSocket(httpServer){

    io = new Server(httpServer,{
        cors:{
            origin : 'http://localhost:5173',
            credentials : true
        }
    })

    console.log("socket io server is running..")

    io.on('connection',(socket)=>{
        console.log('user was connected '+socket.id);
        
    })
}


export function getIo(){

    if(!io){
        throw new Error('socket io not provided')
    }

    return io
}