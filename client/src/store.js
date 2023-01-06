import { readable, writable } from 'svelte/store';

export const apiURL = readable("http://127.0.0.1:7000/api");
export const socketURL = readable("http://127.0.0.1:7000");
// export const apiURL = readable("/api");
// export const socketURL = readable("https://cybchat.com:7000");

export const user = writable([]);
export const selectedFriend = writable([]);
export const selectedUser = writable([]);
export const selectedUser2 = writable([]);

export const friends = writable([]);
export const immutableFriends = writable([]);
export const usersExpUser = writable([]);

export const users = writable([]);
export const usersExpOne = writable([]);

export const isAuthenticated = writable(false);
export const errors = writable({});
export const messages = writable([]);
export const messagesOfAdminPanel = writable([]);
