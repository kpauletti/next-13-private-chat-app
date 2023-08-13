"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { generateRandom10DigitNumber } from "@/utils";
import { error } from "console";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const TextInput = ({ error, ...restProps }: TextInputProps) => {
    const className = classNames("input input-bordered w-full max-w-xs", {
        "input-error": error,
    });

    return (
        <div className="form-control">
            <input {...restProps} className={className} />
            {error && (
                <label className="label">
                    <span className="label-text-alt" />
                    <span className="label-text-alt text-error">Field is Required</span>
                </label>
            )}
        </div>
    );
};

interface TextInputValue {
    value: string;
    error?: boolean;
}

export default function ChatForm() {
    const router = useRouter();

    const [chatBasis, setChatBasis] = React.useState<"new-chat" | "join-chat">("new-chat");
    const [username, setUsername] = React.useState<TextInputValue>({ value: "" });
    const [chatId, setChatId] = React.useState<TextInputValue>({ value: "" });


    const toggleChatBasis = () => {
        setChatBasis((prev) => (prev === "new-chat" ? "join-chat" : "new-chat"));
        setUsername({ value: "" });
        setChatId({ value: "" });
    };

    const createChat = () => {
        if (!username.value) {
            setUsername({ value: "", error: true });
            return;
        }

        if(chatBasis === "join-chat" && !chatId.value) {
            setChatId({ value: "", error: true });
            return;
        }

        if (chatBasis === "new-chat") {
            router.push(`/chat/${generateRandom10DigitNumber()}?username=${username.value}`);
            return;
        }

        router.push(`/chat/${chatId.value}?username=${username.value}`);
    };
    return (
        <>
            <div className="tabs tabs-boxed flex mb-2">
                <a onClick={toggleChatBasis} className={`tab flex-1 ${chatBasis === "new-chat" ? "tab-active" : ""}`}>
                    New Chat
                </a>
                <a onClick={toggleChatBasis} className={`tab flex-1 ${chatBasis === "join-chat" ? "tab-active" : ""}`}>
                    Join Chat
                </a>
            </div>

            <div className="flex flex-col flex-grow gap-2">
                <TextInput
                    error={username?.error}
                    value={username.value}
                    onChange={(e) => setUsername({value: e.target.value})}
                    type="text"
                    placeholder="USERNAME"
                />
                {chatBasis === "join-chat" && (
                    <TextInput
                        error={chatId.error}
                        value={chatId.value}
                        onChange={(e) => setChatId({value: e.target.value})}
                        type="text"
                        placeholder="CHAT ID"
                    />
                )}
            </div>

            <div className="form-control">
                <button onClick={createChat} className="btn btn-primary">
                    Start Chatting
                </button>
            </div>
        </>
    );
}
