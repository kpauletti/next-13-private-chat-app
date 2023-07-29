import type { Message } from "@/utils/messageStore";

export interface ServerToClientEvents {
    join: (opts: { username: string; chatId: string }) => void;
    message: (opts: Message) => void;
    joinRoom: (opts: { chatId: string }, cb: (messages: Message[]) => void) => void;
    leaveRoom: (opts: { chatId: string }) => void;
}

export interface ClientToServerEvents {
    join: (opts: { username: string; chatId: string }) => void;
    joinRoom: (opts: { chatId: string }, cb: (messages: Message[]) => void) => void;
    message: (opts: Omit<Message, 'timestamp'>) => void;
    leaveRoom: (opts: { chatId: string }) => void;
    leave: (opts: { username: string }) => void;
}
