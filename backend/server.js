

import app from './src/app.js'
import http from 'http'
import { initSocket } from './src/sockets/server.socket.js'
import { ConnectToDb } from './src/config/database.js'

ConnectToDb()

const httpServer = http.createServer(app)
initSocket(httpServer)


httpServer.listen(3000,()=>{
    console.log('server was running on port 3000');
})