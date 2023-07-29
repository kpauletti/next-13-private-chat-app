export interface Message {
    message: string;
    timestamp: number;
    chatId: string;
    username: string
}

interface MessageStore {
    [chatId: string]: Message[];
}

const messageStore: MessageStore = {};

export const addMessage = (chatId: string, message: string, username: string) => {
    if (!messageStore[chatId]) {
        messageStore[chatId] = [];
    }
    removeOldMessages();

    const newMessage = {
        message,
        timestamp: Date.now(),
        chatId,
        username
    };

    messageStore[chatId].push(newMessage);
    return newMessage;
};

export const getMessages = (chatId: string) => {
    if (!messageStore[chatId]) {
        messageStore[chatId] = [];
    }
    removeOldMessages();
    return messageStore[chatId];
}

const removeOldMessages = () => {
    for (const chatId in messageStore) {

        //lets not let this array get too big
        if(messageStore[chatId].length > 100) messageStore[chatId].shift();

        messageStore[chatId] = messageStore[chatId].filter((message) => {
            return message.timestamp > Date.now() - 1000 * 60 * 5;
        });
    }
}