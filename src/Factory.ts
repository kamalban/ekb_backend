import Logger from './loaders/Logger';
Logger.info('f -1')
import { Server } from './loaders/Server';
Logger.info('f 0')
import express from 'express';
Logger.info('f 1')
import { Mongodb } from './model/Mongo';

Logger.info('f 1')

export class Factory {
  static InitializeServer(): Server {
    try {
      Logger.info('index.InitializeServer');
      const app = express();
      const mongodb = new Mongodb();
      return Server.getInstance(
        app,
        mongodb
      );
    } catch (error) {
      Logger.error('Error occured in factory while initializing server '+error);
    }
}
}