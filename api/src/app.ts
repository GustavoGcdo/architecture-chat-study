import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import makeAuthRoute from './factories/routes/auth-route.factory';
import makeMessageRoute from './factories/routes/message-route.factory';
import Login from './modules/auth/usecases/login';
import GetMessages from './modules/message/usecases/getMessages';
import SendMessage from './modules/message/usecases/sendMessage';
import userRepository from './modules/_shared/repositories/user.repository';

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

    this.app.use(makeAuthRoute().getRouter());
    this.app.use(makeMessageRoute().getRouter());
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
