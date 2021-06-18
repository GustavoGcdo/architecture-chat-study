import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenvConfig from './configs/dotenv.config';
import makeAuthRoute from './factories/routes/auth-route.factory';
import makeInfoRoute from './factories/routes/info-route.factory';
import { makeMessageRoute } from './factories/routes/message-route.factory';
import makeUserRoute from './factories/routes/user-route.factory';
import userRepository from './modules/_shared/repositories/user.repository';
dotenvConfig();

export default class App {
  private app: Application;
  private server: http.Server;
  private static ioServer?: Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.createIoServer();
    this.configureMiddleWares();
    this.configureRoutes();
  }

  private configureMiddleWares() {
    this.app.use(express.json());
    this.app.use(cors());
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
    this.app.use(makeInfoRoute().getRouter());
    this.app.use(makeAuthRoute().getRouter());
    this.app.use(makeMessageRoute().getRouter());
    this.app.use(makeUserRoute().getRouter());
  }

  public start() {
    this.server.listen(3333, () => {
      console.log('[app]: listening on port 3333');
    });
  }

  public getApp() {
    return this.app;
  }

  public static getIoServer() {
    return this.ioServer;
  }
}
