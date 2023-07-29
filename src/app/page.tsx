"use client";
import React from "react";
import AnimatedButton from "@/components/AnimatedButton";
import { generateRandom10DigitNumber } from "@/utils";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = React.useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const createChat = () => {
        void fetch("/api/socket"); //init socket
        const chatId = generateRandom10DigitNumber();
        router.push(`/chat/${chatId}?username=${username || "Anonymous"}`);
    };

    return (
        <div className="h-screen px-20 flex flex-col justify-center items-center gap-10">
            <input
                className="w-full lg:w-1/3 text-center rounded-sm p-3"
                value={username}
                onChange={handleInputChange}
                type="text"
                placeholder="enter username"
            />
            <div className="w-full lg:w-1/3">
                <AnimatedButton onClick={createChat}>CREATE A CHAT</AnimatedButton>
            </div>
        </div>
    );
}
