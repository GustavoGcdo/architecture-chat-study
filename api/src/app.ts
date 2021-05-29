import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Message } from './models/message';
import userRepository from './repositories/user.repository';

export default class App {
  private app: Application;
  private server: http.Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  public async create() {
    const ioServer = this.createIoServer(this.server);
    this.configureMiddleWares();
    this.configureRoutes(ioServer);
  }

  private configureMiddleWares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private createIoServer(server: http.Server) {
    const ioServer = new Server(server, {
      cors: {
        origin: '*'
      }
    });

    ioServer.on('connection', (socket) => {
      console.log('a user connected');

      socket.on('disconnect', () => {
        userRepository.remove(socket.id);
      });
    });

    return ioServer;
  }

  private configureRoutes(io: Server) {
    const messages: Message[] = [];

    this.app.get('/', (req, res) => {
      return res.json({
        message: 'eae'
      });
    });

    this.app.post('/entrar', (req, res) => {
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

    this.app.post('/message', (req, res) => {
      const { text, username } = req.body;
      const user = userRepository.findByUsername(username);

      if (text && text.trim().length > 0 && user) {
        messages.push({ text, user });
        io.emit('message', { text, user });
      }

      return res.status(204).json();
    });

    this.app.get('/message', (req, res) => {
      return res.status(200).json(messages);
    });
  }

  public start() {
    this.server.listen(3333, () => {
      console.log('[app]: listening on port 3333');
    });
  }
}
