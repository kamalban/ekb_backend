import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT';

const envFound = dotenv.config();
if (envFound.error) {

    throw new Error(' Couldn\'t found .env file');
}

export default {

    port: parseInt(process.env.PORT, 10) || 8081,
    host: /*process.env.HOST ||*/ 'localhost',

    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },


    api: {
        prefix: '/api',
    },

    jwtSecret: process.env.JWT_SECRET || 'AoTgab%$SKBJB(Baco&euro$!(*^%fcxuartcuYCAvhagA)Y^VYcdw(TVYCtxt@ibs)a%Wbha5$',

    jwtAlgorithm: process.env.JWT_ALGORITHUM || 'HS256',

    DatabaseURL: process.env.DATABASE_URL || 'mongodb://mongo.default.svc.cluster.local:27017/abp',

    feedId: '386058',
    userName: '8699923936',
    password: 'Abp@123456',
    principalEntityId: '1101613730000059646',
    templateId: '1107164211381607118',
    senderId: 'GAMESM',
    channelName: 'ABPNETWORKSAPI_GAMESMASTI',
    async: 0,
    short: 1,
    headers:  {
        'Content-type': 'application/json'
    }

}