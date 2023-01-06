import { navigate } from 'svelte-navigator';
import jwtDecode from 'jwt-decode';

import api from '../utils/api';
import { user, isAuthenticated, errors, friends, users, usersExpOne, usersExpUser, immutableFriends } from '../store';

// Load User
export const loadUser = async () => {
  const res = await api.get('/users/auth');

  if (res.msg === 'success') {
    user.set(res.user);
    isAuthenticated.set(true);
  } else {
    console.log(res.data);
  }
};

// Register User
export const register = async newUser => {
  const res = await api.post('/users/signup', newUser);

  if (res.msg === 'success') {
    errors.set({});
    navigate('/', { replace: true });
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
};

// Login User
export const login = async userData => {
  const res = await api.post('/users/signin', userData);
  if (res.msg === 'success') {
    localStorage.setItem('token', res.token);
    isAuthenticated.set(true);
    loadUser();
    errors.set({});
    navigate('/', { replace: true });
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
};

// Logout User
export const logout = async () => {
  const decode = jwtDecode(localStorage.token);
  const res = await api.put('/users/logout', { userId: decode.user.id });

  if (res.msg === 'success') {
    localStorage.removeItem('token');
    user.set([]);
    isAuthenticated.set(false);
    errors.set({});
    navigate('/auth/login', { replace: true });
  } else {
    console.log(res.data);
  }
}

// Update User
export const updateUserData = async userData => {
  const res = await api.put('/users/update/user', userData);
  if (res.msg === 'success') {
    loadUser();
    errors.set({});
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
}

// Change password
export const changePassword = async pwData => {
  const res = await api.put('/users/changePw', pwData);

  if (res.msg === 'success') {
    console.log(res.msg);
    errors.set({});
    return res.msg;
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
}

// Get users
export const getUsers = async () => {
  const res = await api.get('/users/getUsers');

  if (res.msg === 'success') {
    console.log(res.msg);
    users.set(res.users);
  } else {
    console.log(res.data);
  }
}

// Get users except one
export const getUsersExpOne = async (nickname) => {
  const res = await api.get(`/users/getUsersExpOne/${nickname}`);

  if (res.msg === 'success') {
    console.log(res.msg);
    usersExpOne.set(res.friends);
  } else {
    console.log(res.data);
  }
}

// Get friends
export const getFriends = async () => {
  const res = await api.get('/users/getFriends');

  if (res.msg === 'success') {
    console.log(res.msg);
    friends.set(res.friends);
    immutableFriends.set(res.friends);
  } else {
    console.log(res.data);
  }
}

// Get users except for user
export const getUsersExpUser = async () => {
  const res = await api.get('/users/getUsersExpUser');

  if (res.msg === 'success') {
    console.log(res.msg);
    usersExpUser.set(res.users);
  } else {
    console.log(res.data);
  }
}

// Add friend
export const addFriend = async friendData => {
  const res = await api.post('/users/addFriend', friendData);

  if (res.msg === 'success') {
    console.log(res.msg);
    return res.msg;
  } else {
    console.log(res.data);
  }
}

// Remove friend
export const removeFriend = async friend => {
  const res = await api.delete(`/users/removeFriend/${friend}`);

  if (res.msg === 'success') {
    return res.msg;
  } else {
    console.log(res.data);
  }
}

// Delete user
export const deleteUser = async userNickname => {
  const res = await api.delete(`/users/deleteUser/${userNickname}`);

  if (res.msg === 'success') {
    console.log(res.msg);
    return res.msg;
  } else {
    console.log(res.data);
  }
}

// Change role
export const changeRole = async (nickname, role) => {
  const res = await api.put('/users/changeRole', {
    nickname: nickname,
    role: role
  });

  if (res.msg === 'success') {
    console.log(res.msg);
    return res.msg;
  } else {
    console.log(res.data);
  }
}

// Set user's state
export const setState = async (nickname, state) => {
  const res = await api.put('/users/setState', {
    nickname: nickname,
    state: state
  });

  if (res.msg === 'success') {
    console.log(res.msg);
    return res.msg;
  } else {
    console.log(res.data);
  }
}

// Send the reset password request
export const sendResetPwReq = async email => {
  const res = await api.post('/users/sendReqResetPw', { email: email });

  if (res.msg === 'success') {
    console.log(res.msg);
    return res.msg;
  } else {
    console.log(res.data);
    return res.data;
  }
}

// Reset password
export const resetPassword = async data => {
  const res = await api.put('/users/resetPassword', data);

  if (res.msg === 'success') {
    console.log(res.msg);
    errors.set({});
    navigate('/auth/login', { replace: true });
  } else {
    console.log(res.data);
    errors.set(res.data);
  }
}