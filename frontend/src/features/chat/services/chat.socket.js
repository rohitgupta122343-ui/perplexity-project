import { io } from "socket.io-client";

export const initSocket = () => {
    const socket = io("https://perplexity-project-vay7.onrender.com", {
        withCredentials: true
    });

    socket.on("connect", () => {
        console.log("connected to socket.io server with id: " + socket.id);
    });

    

    return socket;
};