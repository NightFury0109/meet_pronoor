const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const sequelize = require('./utils/database');

const usersRoute = require('./routes/users');
const messageRoute = require('./routes/messages');

const Message = require('./models/message');
const User = require('./models/user');

const app = express();

// const privateKey = fs.readFileSync('ssl/privkey.pem', 'utf8');
// const ca =fs.readFileSync('ssl/fullchain.pem','utf8');
// const certificate = fs.readFileSync('ssl/cert.pem', 'utf8');

// const credentials = {key: privateKey, cert: certificate, ca: ca};

// const server = https.createServer(credentials, app);
const server = http.createServer(app);

const io = require('socket.io')(server);

const avatarStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'client/public/avatars');
  },
  filename: (req, file, callback) => {
    crypto.randomBytes(20, (err, buffer) => {
      const name = Date.now() + buffer.toString('hex') + '.' + file.originalname.split('.').reverse()[0];
      callback(null, name);
    });
  }
});

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'client/public/files');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const avatarFilter = (req, file, callback) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (fileTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/users', multer({ storage: avatarStorage, fileFilter: avatarFilter }).single('avatar'));
app.use('/api/messages', multer({ storage: fileStorage }).single('file'));

app.use('/client/public/avatars', express.static(path.join(__dirname, 'client/public/avatars')));
app.use('/client/public/files', express.static(path.join(__dirname, 'client/public/files')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/users', usersRoute);
app.use('/api/messages', messageRoute);

io.on('connection', socket => {
  console.log('Client Connected!');
  socket.on('createMessage', data => {
    setTimeout(() => {
      // if (data.message_type === 'file') {
      //   deleteFile(path.join(__dirname, 'client/public/', data.filepath));
      // }

      Message.update({
        show_status: 'admin'
      }, {
        where: {
          id: data.id
        }
      });

      io.emit('hideMessage', data);
    }, data.live_time);
    io.emit('createMessage', data);
  });

  socket.on('updateTime', data => {
    const message = Message.update({
      receiver_time: data.receiver_time
    }, {
      where: {
        sender: data.sender,
        receiver: data.receiver,
        sender_time: data.sender_time,
      }
    });

    io.emit('create_message');
  });
});


const port = parseInt(process.env.PORT, 10) || 7000;

sequelize.sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (user) {
      if (user.email !== 'admin@pronoor.com') {
        user.update({
          email: 'admin@pronoor.com'
        });
      }

      return user;
    }

    const admin = {
      nickname: 'Administrator',
      email: 'admin@pronoor.com',
      password: '123456',
      avatar: 'avatars/default.png',
      role: 'admin'
    };

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(admin.password, salt, (err, hash) => {
        if (err) throw err;
        admin.password = hash;

        return User.create(admin);
      });
    });
  })
  .then(() => {
    console.log('PostgresDB Connected!');
    server.listen(port, () => console.log(`Server is running on port: ${port}`));
  })
  .catch(err => console.log(`DB Connection Error: ${err}`));
