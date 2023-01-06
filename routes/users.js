const express = require('express');

const router = express.Router();

const isAuth = require('../middlewares/isAuth');
const usersController = require('../controllers/users');

router.get('/auth', isAuth, usersController.loadUser);

router.post('/signup', usersController.signup);

router.post('/signin', usersController.signin);

router.put('/update/user', isAuth, usersController.updateUserData);

router.put('/changePw', isAuth, usersController.changePassword);

router.get('/getUsers', isAuth, usersController.getUsers);

router.get('/getUsersExpOne/:nickname', isAuth, usersController.getUsersExpOne);

router.get('/getFriends', isAuth, usersController.getFriends);

router.get('/getUsersExpUser', isAuth, usersController.getUsersExpUser);

router.post('/addFriend', isAuth, usersController.addFriend);

router.delete('/removeFriend/:friend', isAuth, usersController.removeFriend);

router.put('/logout', usersController.logoutUser);

router.delete('/deleteUser/:nickname', isAuth, usersController.deleteUser);

router.put('/changeRole', isAuth, usersController.changeRole);

router.put('/setState', isAuth, usersController.setState);

router.post('/sendReqResetPw', usersController.sendReqResetPw);

router.put('/resetPassword', usersController.resetPassword);

module.exports = router;