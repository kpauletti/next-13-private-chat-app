"use client";
import React from "react";
import useSocket from "@/app/hooks/useSocket";
import Dayjs from 'dayjs';

interface ChatPageProps {
    params: {
        chatId: string;
    };
    searchParams?: {
        username?: string;
    };
}

export default function ChatPage(props: ChatPageProps) {
    const { chatId } = props.params;

    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const messageEndRef = React.useRef<HTMLDivElement>(null);

    const username = props.searchParams?.username || "Anonymous";

    const { socket, messages } = useSocket({ username, chatId });

    const handleSendMessage = async () => {
        if (socket?.connected && inputValue) {
            socket?.emit("message", { username, chatId, message: inputValue });
            setInputValue("");
            inputRef.current?.focus();
        }
    };

    React.useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-screen p-8">
            <div className="h-2/3 bg-base-content rounded mb-5 overflow-scroll break-words">
                {messages.map(({ username: _username, message, timestamp }, index) => (
                    <div key={index} className={`chat ${_username === username ? 'chat-end' : 'chat-start'}`}>
                        <div className="chat-header text-primary">
                            {_username}
                            <time className="text-xs opacity-50"> {Dayjs(timestamp).format('h:mm a')}</time>
                        </div>
                        <div className={`chat-bubble ${_username === username ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>{message}</div>
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
                    className="input input-bordered w-full bg-base-content text-primary"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />
                <button className="btn btn-outline btn-primary">SEND</button>
            </div>
        </div>
    );
}
