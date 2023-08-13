import React from "react";
import ChatForm from "@/components/ChatForm";

export default function Home() {

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Private Chat</h1>
                    <p className="py-6">Create your own private chat room and invite your friends to join.</p>
                </div>
                <div className="card flex-shrink-0 min-h-[300px] w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body flex justify-between">
                        <ChatForm />
                    </div>
                </div>
            </div>
        </div>

    );
}
