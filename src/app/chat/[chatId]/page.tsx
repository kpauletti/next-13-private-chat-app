"use client"
import React from "react";
import { io, Socket } from "socket.io-client";
import AnimatedButton from "@/components/AnimatedButton";
import type { Message } from "@/utils/messageStore";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/events";

interface ChatPageProps {
    params: {
        chatId: string;
    },
    searchParams?: {
        username?: string;
    }
}

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const socketUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function ChatPage(props: ChatPageProps) {

    const { chatId } = props.params;

    const [inputValue, setInputValue] = React.useState("")
    const [messages, setMessages] = React.useState<Message[]>([])
    const [activeSocket, setActiveSocket] = React.useState<ClientSocket | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const messageEndRef = React.useRef<HTMLDivElement>(null)

    const username = props.searchParams?.username || "Anonymous";

    const handleSendMessage = async () => {
        if(activeSocket?.connected && inputValue){
            activeSocket?.emit("message", { username, chatId, message: inputValue })
            setInputValue("")
            inputRef.current?.focus()
        }
    }

    React.useEffect((): any => {

        const socket: ClientSocket = io(socketUrl, {
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

    React.useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    return (
        <div className="h-screen p-8">
            <div className="h-2/3 bg-slate-300 rounded-sm mb-5 overflow-scroll break-words">
                {messages.map(({ username, message }, index) => (
                    <div key={index} className="pl-3 py-1">
                        <span className="font-bold">{username}: </span>
                        <span>{message}</span>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <div className="flex flex-col md:flex-row gap-5">
                <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} 
                    type="text" 
                    className="flex-grow bg-slate-300 outline-none p-1"
                />
                <div>
                    <AnimatedButton onClick={handleSendMessage}>
                        Send
                    </AnimatedButton>
                </div>
            </div>
        </div>
    )
}