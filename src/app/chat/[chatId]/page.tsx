"use client"
import React from "react";
import AnimatedButton from "@/components/AnimatedButton";
import useSocket from "@/app/hooks/useSocket";

interface ChatPageProps {
    params: {
        chatId: string;
    },
    searchParams?: {
        username?: string;
    }
}


export default function ChatPage(props: ChatPageProps) {

    const { chatId } = props.params;

    const [inputValue, setInputValue] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)
    const messageEndRef = React.useRef<HTMLDivElement>(null)

    const username = props.searchParams?.username || "Anonymous";

    const { socket, messages } = useSocket({ username, chatId });

    const handleSendMessage = async () => {
        if(socket?.connected && inputValue){
            socket?.emit("message", { username, chatId, message: inputValue })
            setInputValue("")
            inputRef.current?.focus()
        }
    }

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