import { NextApiHandlerExtended } from "@/types/next";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/events";
import * as userStore from '@/utils/userStore';
import * as messageStore from '@/utils/messageStore';

export const config = {
    api: {
      bodyParser: false,
    }
  }

const io: NextApiHandlerExtended = async (req, res) => {

    if (!res.socket.server.io) {

        // adapt Next's net Server to http Server
        const httpServer: NetServer = res.socket.server as any;
        //https://socket.io/docs/v4/server-options/#addtrailingslash
        //@ts-ignore
        const io = new ServerIO<ServerToClientEvents, ClientToServerEvents>(httpServer, { path: "/api/socket/io", addTrailingSlash: false})

        io.on("connection", (socket) => {
            socket.onAny((event, ...args) => {
                console.log(event, args);
            });

            socket.on("join", ({ username, chatId }) => {
                userStore.addUser(socket.id, username, chatId)
                // socket.broadcast.emit("join", { username, id: socket.id })
            })

            socket.on("message", ({ username, chatId, message }) => {
                const newMessage = messageStore.addMessage(chatId, message, username)
                io.to(chatId).emit("message", newMessage);
            });

            socket.on("disconnect", () => {
                const { username } = userStore.getUser(socket.id);
                socket.broadcast.emit("leave", { username })
                userStore.removeUser(socket.id)
            });

            socket.on("joinRoom", ({ chatId }, cb) => {
                socket.join(chatId)
                const messages = messageStore.getMessages(chatId)
                cb(messages)
            })

            socket.on("leaveRoom", ({ chatId }) => {
                socket.leave(chatId)
            })
        });
        // append SocketIO server to Next.js socket server response
        res.socket.server.io = io;
    }
    res.end();
};

export default io;
