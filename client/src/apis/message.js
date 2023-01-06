import api from '../utils/api';
import { messages, messagesOfAdminPanel } from '../store';
import isEmpty from '../../../validation/is-empty';

// Save message
export const saveMessage = async (msgData) => {
  const res = await api.post('/messages/saveMessage', msgData);

  if (res.msg === 'success') {
    console.log(res.msg);
    return res;
  } else {
    console.log(res.data);
  }
}

// Get messages
export const getMessages = async receiver => {
  const res = await api.get(`/messages/getMessages/${receiver}`);

  if (res.msg === 'success') {
    messages.set(res.messages);
    // console.log(res.messages)
    return res.msg;
  } else {
    console.log(res.data);
  }
}

// Get messages of Admin panel
export const getMessagesOfAdminPanel = async (user1, user2) => {
  const res = await api.post('/messages/getMessages/adminPanel', { user1: user1, user2: user2 });

  if (res.msg === 'success') {
    messagesOfAdminPanel.set(res.messages);
    // console.log(res.messages)
    return res.msg;
  } else {
    console.log(res.data);
  }
}