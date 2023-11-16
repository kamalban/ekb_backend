import https, { RequestOptions } from 'https';
import http from 'http';
import logger from '../loaders/Logger';
import { json } from 'express';
import  { parseString } from 'xml2js'
import { parse } from 'dotenv';
import { ParserError } from 'redis';
import { loggers } from 'winston';

export class RequestAPI {

  static async API(reqOptions: RequestOptions, reqData: any): Promise<any> {

  return  await RequestAPI.HttpsRequestXML(reqOptions, reqData);

  }
  static HttpRequest(reqOptions: RequestOptions, reqData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        reqOptions.timeout = 10000;
        reqOptions.rejectUnauthorized = false;
        reqOptions.headers = {
          ...reqOptions.headers,
          'Content-type': 'application/json'
        };
        const httpsRequest = http.request(reqOptions, res => {
          res.setEncoding('utf8');

          let data = '';
          res.on('data', chunks => {
            data += chunks;
          });

          res.on('end', () => {
            try {
              const jsonData = JSON.parse(data.toString());
              resolve(jsonData);
            } catch (err) {
              return reject(err);
            }
          });
        });

        httpsRequest.write(JSON.stringify(reqData));
        httpsRequest.on('timeout', () => {
          logger.error('Timed out for request');
          return reject('Time out for request');
        });

        httpsRequest.on('error', error => {
          reject(error);
        });

        httpsRequest.end();
      } catch (error) {
        return reject(error);
      }
    });
  }

  static async HttpsRequest(reqOptions: RequestOptions, reqData: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        reqOptions.timeout = 10000;
        reqOptions.rejectUnauthorized = false;
        reqOptions.headers = {
          ...reqOptions.headers,
          'Content-type': 'application/json'
        };

        // logger.debug('reqOptions: %o', reqOptions);
        logger.silly('hhtps request')
        const httpsRequest = await https.request(reqOptions, res => {
          res.setEncoding('utf8');
          logger.silly('77 '+JSON.stringify(res))
          let data = '';
          res.on('data', chunks => {
            logger.silly('77')
            data += chunks;
          });
          logger.silly('data: '+data)
          res.on('end', () => {
            logger.silly('data len'+data.length)
            if (data.length < 1000) logger.debug('data on response: %o', data);
            else logger.verbose('data on response: %o', data);

            const jsonData =JSON.parse(data.toString());

            resolve(jsonData);
          });
        });
        logger.debug('Data to request h: %s', JSON.stringify(reqData));
        httpsRequest.write(JSON.stringify(reqData));

        httpsRequest.on('timeout', () => {
          logger.error('Timed out for request');
          return reject('Time out for request');
        });

        httpsRequest.on('error', error => {
          logger.info(`error in request ${JSON.stringify(error)}`);
          reject(error);
        });


        httpsRequest.end();

      } catch (error) {
        logger.error('error while hit api ' + error)
        return reject(error);
      }
    });
  }

  static async HttpsRequestXML(reqOptions: RequestOptions, reqData: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        reqOptions.timeout = 10000;
        reqOptions.rejectUnauthorized = false;
        reqOptions.headers = {
          ...reqOptions.headers,
          'Content-type': 'application/x-www-form-urlencoded'
        };

        // logger.debug('reqOptions: %o', reqOptions);
        logger.silly('hhtps request')
        const httpsRequest = await https.request(reqOptions, res => {
          // res.setEncoding('utf8');
          // logger.silly('77 '+JSON.stringify(res))
           let data = '';
          // res.on('data', chunks => {
          //   logger.silly('77')
          //   data += chunks;
          // });
          if (res.statusCode >= 200 && res.statusCode < 400) {
            res.on('data', (dataTemp) => { data += dataTemp.toString(); });
            res.on('end', () => {
              console.log('data', data);
              parseString(data, (err, result) => {
                console.log('FINISHED', err, result);
              });
            });
            resolve('true')
          }
          // parseString(res.toString(),(err, result) => {
          //   logger.silly('136'+result)
          //   // data = result
          // })
          // logger.silly('data: '+res.result);
          // res.on('end', () => {
          //   logger.silly('data len'+data.length)
          //   if (data.length < 1000) logger.debug('data on response: %o', data);
          //   else logger.verbose('data on response: %o', data);

          //   const jsonData =JSON.parse(data.toString());

          //   resolve(jsonData);
          // });
        });
        logger.debug('Data to request h: %s', JSON.stringify(reqData));
        httpsRequest.write(JSON.stringify(reqData));

        httpsRequest.on('timeout', () => {
          logger.error('Timed out for request');
          return reject('Time out for request');
        });

        httpsRequest.on('error', error => {
          logger.info(`error in request ${JSON.stringify(error)}`);
          reject(error);
        });


        httpsRequest.end();

      } catch (error) {
        logger.error('error while hit api ' + error)
        return reject(error);
      }
    });
  }
}
