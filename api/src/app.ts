import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Message } from './models/message';
import Login from './modules/auth/usecases/login';
import userRepository from './repositories/user.repository';

export default class App {
  private app?: Application;
  private server?: http.Server;
  private static ioServer?: Server;

  public create() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.createIoServer();
    this.configureMiddleWares();
    this.configureRoutes();
  }

  private configureMiddleWares() {
    if (this.app) {
      this.app.use(express.json());
      this.app.use(cors());
    } else {
      throw new Error('The app was not created');
    }
  }

  private createIoServer() {
    App.ioServer = new Server(this.server, {
      cors: {
        origin: '*'
      }
    });

    App.ioServer.on('connection', (socket) => {
      console.log('a user connected');

      socket.on('disconnect', () => {
        userRepository.remove(socket.id);
      });
    });
  }

  private configureRoutes() {
    const messages: Message[] = [];

    if (!this.app) {
      throw new Error('The app or io was not created');
    }

    this.app.get('/', (req, res) => {
      return res.json({
        message: 'eae'
      });
    });

    this.app.post('/entrar', (req, res) => {
      try {
        const login = new Login();
        login.handle(req.body);
      } catch ({ message }) {
        console.log(message);

        return res.status(400).json({ message });
      }
    });

    this.app.post('/message', (req, res) => {
      if (!App.ioServer) {
        throw new Error('The io server was not created');
      }

      const { text, username } = req.body;
      const user = userRepository.findByUsername(username);

      if (text && text.trim().length > 0 && user) {
        messages.push({ text, user });
        App.ioServer.emit('message', { text, user });
      }

      return res.status(204).json();
    });

    this.app.get('/message', (req, res) => {
      return res.status(200).json(messages);
    });
  }

  public start() {
    if (this.server) {
      this.server.listen(3333, () => {
        console.log('[app]: listening on port 3333');
      });
    } else {
      throw new Error('The server was not created');
    }
  }

  public static getIoServer() {
    return this.ioServer;
  }
}
