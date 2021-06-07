import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Login from './modules/auth/usecases/login';
import GetMessages from './modules/message/usecases/getMessages';
import SendMessage from './modules/message/usecases/sendMessage';
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
        return res.status(204).send();
      } catch ({ message }) {
        console.log(message);

        return res.status(400).json({ message });
      }
    });

    this.app.post('/message', (req, res) => {
      try {
        const sendMessage = new SendMessage();
        sendMessage.handle(req.body);
        return res.status(204).json();
      } catch ({ message }) {
        return res.status(400).json({ message });
      }
    });

    this.app.get('/message', (req, res) => {
      try {
        const getMessages = new GetMessages();
        const messages = getMessages.handle();

        return res.status(200).json(messages);
      } catch ({ message }) {
        return res.status(400).json({ message });
      }
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
