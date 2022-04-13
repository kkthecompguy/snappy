import http from 'http';
import { Server, Socket } from "socket.io";
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { CommonConfigRoutes } from './common/common.routes.config';
import { AuthRoutes } from './routes/auth.routes.config';
import { UsersRoute } from './routes/users.routes.config';
import { MessageRoutes } from './routes/messages.routes.config';

const app: express.Application = express();

dotenv.config();

const routes: Array<CommonConfigRoutes> = [];
const port: string | number = process.env.PORT || 3001
const clientHost: string = process.env.CLIENT_HOST || "http://localhost:3000"

const server: http.Server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientHost,
    credentials: true
  }
});


app.use(cors());
app.use(express.json());


// database connection
async function connection() {
  let mongouri: string = process.env.MONGO_URI || ''
  await mongoose.connect(mongouri)
}


try {
  connection()
  console.log('mongo db connected successfully')
} catch (error) {
  console.log('database connection failed!!')
}


// add routes here
routes.push(new AuthRoutes(app));
routes.push(new UsersRoute(app));
routes.push(new MessageRoutes(app));


// initial route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({'message': `api is running on http://localhost:${port}`});
});


// establish socket connection

export const onlineUsers = new Map();

io.on("connection", (socket: Socket) => {
  console.log(socket.id);
  socket.on("add-user", (userId) => {
    console.log('----add user----', userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log(data)
    console.log(onlineUsers)
    const sendUserSocket = onlineUsers.get(data.to);
    console.log('sendUserSocket', sendUserSocket)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-received", data.message)
    }
  });
})

server.listen(port, () => {
  routes.forEach(route => {
    console.log(`${route.getName()} is registered`)
  });
  console.log(`api is running on http://localhost:${port}`);
});