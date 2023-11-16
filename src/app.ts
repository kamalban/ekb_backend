import { Factory } from './Factory';
import logger from './loaders/Logger';

async function startServer() {
  try {
    logger.info('Init');

    const server = Factory.InitializeServer();

    server.start();
  } catch (error) {
    logger.error('Error occured in app file :'+ error);
  }

}

startServer();