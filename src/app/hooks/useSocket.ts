import React from 'react';
import { io, Socket } from "socket.io-client";
import type { Message } from "@/utils/messageStore";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/events";


type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface UseSocketProps {
    username: string;
    chatId: string;
}

const socketHost = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function useSocket({ username, chatId }: UseSocketProps) {

    const [activeSocket, setActiveSocket] = React.useState<ClientSocket | null>(null)
    const [messages, setMessages] = React.useState<Message[]>([])


    React.useEffect((): any => {

        const socket: ClientSocket = io(socketHost, {
            path: "/api/socket/io",
            addTrailingSlash: false,

        });

        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        socket.on("connect", () => {
            socket.emit("join", { username, chatId });
            //join room will take a cb to set messages
            socket.emit("joinRoom", { chatId }, (messages) => {
                setMessages(messages)
            });
            setActiveSocket(socket)
        });

        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message])
        })

        socket.on("disconnect", () => {
            socket.emit("leaveRoom", { chatId });
            setActiveSocket(null)
        });
    
        if (socket) return () => socket.disconnect();
      }, []);


      return { socket: activeSocket, messages }
}