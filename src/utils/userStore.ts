interface User {
    id: string;
    username: string;
    chatId: string
}

interface UserStore {
    [id: string]: User;
}

const userStore: UserStore = {};

export const addUser = (id: string, username: string, chatId: string) => {
    userStore[id] = { id, username, chatId };
}

export const removeUser = (id: string) => {
    delete userStore[id];
};

export const getUser = (id: string) => {
    return userStore[id];
};

export const getUsers = () => {
    return Object.values(userStore);
};

export const getUsersByChatId = (chatId: string) => {
    return Object.values(userStore).filter(user => user.chatId === chatId);
};