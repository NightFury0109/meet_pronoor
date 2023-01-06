const Message = require('../models/message');

const isEmpty = require('../validation/is-empty');

// Save message
exports.createMessage = async (req, res) => {
  try {
    if (isEmpty(req.file)) {
      const newMsg = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        message: req.body.message,
        sender_time: req.body.sender_time,
        live_time: req.body.live_time
      }

      const message = await Message.create(newMsg);

      res.json({ msg: 'success', newMsg: message });
    } else {
      const newMsg = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        sender_time: req.body.sender_time,
        message: '',
        filepath: req.file.path.slice(14),
        filename: req.file.originalname,
        message_type: 'file',
        live_time: req.body.live_time
      }

      const message = await Message.create(newMsg);

      res.json({ msg: 'success', newMsg: message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}


// Get message
exports.getMessages = async (req, res) => {
  try {
    let messages = [];

    let senderMessages = await Message.findAll({
      where: {
        sender: req.user.nickname,
        receiver: req.params.receiver,
        show_status: 'user'
      }
    });

    let receiveMessages = await Message.findAll({
      where: {
        receiver: req.user.nickname,
        sender: req.params.receiver,
        show_status: 'user'
      }
    });

    if (!isEmpty(senderMessages) && !isEmpty(receiveMessages)) {
      messages = senderMessages.concat(receiveMessages);
    } else if (isEmpty(senderMessages) && !isEmpty(receiveMessages)) {
      messages = receiveMessages;
    } else if (!isEmpty(senderMessages) && isEmpty(receiveMessages)) {
      messages = senderMessages;
    }

    messages.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });

    res.json({ messages: messages, msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

// Get messages of admin panel
exports.getMessagesOfAdminPanel = async (req, res) => {
  try {
    let messages = [];

    let senderMessages = await Message.findAll({
      where: {
        sender: req.body.user1,
        receiver: req.body.user2
      }
    });

    let receiveMessages = await Message.findAll({
      where: {
        receiver: req.body.user1,
        sender: req.body.user2
      }
    });

    if (!isEmpty(senderMessages) && !isEmpty(receiveMessages)) {
      messages = senderMessages.concat(receiveMessages);
    } else if (isEmpty(senderMessages) && !isEmpty(receiveMessages)) {
      messages = receiveMessages;
    } else if (!isEmpty(senderMessages) && isEmpty(receiveMessages)) {
      messages = senderMessages;
    }

    messages.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });

    res.json({ messages: messages, msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}