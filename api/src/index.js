const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let users = [];
let messages = [];

app.get('/', (req, res) => {
  return res.json({
    message: 'eae',
  });
});

app.post('/entrar', (req, res) => {
  const { name, socketId } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json('usuario invalido');
  }

  users.push({ name, socketId });
  io.emit('enter-chat', { name, socketId });

  return res.status(200).json({
    message: 'sucesso',
  });
});

app.post('/message', (req, res) => {
  const { text, username } = req.body;
  const user = users.find((user) => user.name == username);
  
  if (text && text.trim().length > 0 && user) {
    messages.push({ text, user });
    io.emit('message', { text, user });
  }

  return res.status(204).json();
});

app.get('/message', (req, res) => {
  return res.status(200).json(messages);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
