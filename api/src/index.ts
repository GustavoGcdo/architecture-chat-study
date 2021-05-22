import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Message } from './models/message';
import userRepository from './repositories/user.repository';

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const messages: Message[] = [];

app.get('/', (req, res) => {
  return res.json({
    message: 'eae'
  });
});

app.post('/entrar', (req, res) => {
  const { name, socketId } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json('usuario invalido');
  }

  userRepository.add({ name, socketId });
  io.emit('enter-chat', { name, socketId });

  return res.status(200).json({
    message: 'sucesso'
  });
});

app.post('/message', (req, res) => {
  const { text, username } = req.body;
  const user = userRepository.findByUsername(username);

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
    userRepository.remove(socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
