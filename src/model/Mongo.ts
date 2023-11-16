require('dotenv').config();
import { BaseMongo } from "./BaseMongo";
import mongoose from 'mongoose';
import logger from "../loaders/Logger";
import config from "../config";

const User = require('./User')
const GameConfig = require('./GameConfig')
const AverageData = require('./AverageData')

import { FantasyPolitics } from '../controller/FantasyPolitics';

export class Mongodb extends BaseMongo {
    static gameConfig: any = {}
    init(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            logger.info('Mongodb init.');
            try {
                const mongoDB = config.DatabaseURL;
                // tslint:disable-next-line:no-console
                // console.log('url : ',mongoDB);
                logger.info("URI : " + mongoDB)
                await mongoose.connect(mongoDB);
                const db = mongoose.connection;
                // Bind connection to error event (to get notification of connection errors)

                this.setDefaultConfig()
                db.on('error',
                    // tslint:disable-next-line:no-console
                    console.error.bind(console, 'MongoDB connection error:'));
                return resolve();
            } catch (err) {
                logger.error('Initialize mongodb failed. ' + err)
                return reject(err);
            }
        });
        // this.stateData("UP")
    }

    async setDefaultConfig() {
        try {
            logger.info('Setting game config.');
            Mongodb.gameConfig = await this.getConfig();
        } catch (err) {
            logger.error('Game config not set.')
        }
    }
    getUser(key: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ mobileNumber: key });
                if (user !== null) return resolve(user)
                return reject(null)
            } catch (err) {
                logger.error('Error while fetching user data. ' + err)
            }
        })
    }

    setUser(key: number, otp: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = new User({
                    "mobileNumber": key,
                    "email": "",
                    "otp": otp,
                    "banned": false
                });
                user.save()
                return resolve(user)
            } catch (err) {
                logger.error('Error while saving user data. ' + err)
            }
        })
    }

    setCutOffDate(date: Date, type: string, state: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (type === 'create') {
                    const gconfig = await GameConfig.findOne({})
                    gconfig.cutOffDate[state] = date;
                    await gconfig.save()
                    Mongodb.gameConfig = gconfig;
                    return resolve(gconfig)
                }
                if (type === "update") {
                    const gconfig = await GameConfig.findOne({})
                    gconfig.cutOffDate[state] = date;
                    await gconfig.save();
                    Mongodb.gameConfig = gconfig;
                    return resolve(gconfig)
                }

            } catch (err) {
                logger.error(err)
                return reject(err)
            }
        })
    }

    setConfig(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Config init...')
                const gconfig = new GameConfig({
                    "cutOffDate": {
                        'UP': '2023-12-21T04:51:05.000+00:00',
                        'Goa': '2023-12-21T04:51:05.000+00:00',
                        'Uttarakhand': '2023-12-21T04:51:05.000+00:00',
                        'Punjab': '2023-12-21T04:51:05.000+00:00'
                    },
                    "state": ["UP", "Punjab", "Uttarakhand", "Goa"],
                    "partyList": [
                        {
                            "UP": {
                                "Awadh": ["BJP+", "SP+", "BSP", "INC", "Others"],
                                "Bundelkhand": ["BJP+", "SP+", "BSP", "INC", "Others"],
                                "Purwanchal": ["BJP+", "SP+", "BSP", "INC", "Others"],
                                "West UP": ["BJP+", "SP+", "BSP", "INC", "Others"]
                            },
                            "totalSeats": [{ "Awadh": 118, "Bundelkhand": 19, "Purwanchal": 130, "West UP": 136 }]
                        },
                        {
                            "Goa": ["INC+", "BJP", "AAP", "MGP+", "Others"],
                            "totalSeats": 40
                        },
                        {
                            "Uttarakhand": ["INC", "BJP", "AAP", "Others"],
                            "totalSeats": 70
                        },
                        {
                            "Punjab": ["INC", "SAD+", "AAP", "BJP+", "Others"],
                            "totalSeats": 117
                        }

                    ]
                });
                await gconfig.save();
                return resolve(true)
            } catch (err) {
                logger.error('m : ' + err);
                return reject(err)
            }
        })
    }

    getConfig(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const gconfig = await GameConfig.findOne({})
                logger.silly(gconfig)
                if (gconfig !== null) return resolve(gconfig)
                // return reject(gconfig)
                if (gconfig === null) {
                    return reject(null)
                }
            } catch (err) {
                logger.error('m : ' + err);
                return reject(err)
            }
        })
    }

    setKnowMoreField(key: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await User.updateOne({ "mobileNumber": key }, { $set: { click: true } }, {})
                return resolve(true)
            } catch (err) {
                return reject(null)
            }
        })
    }

    setTmpData(key: number, UP: any, Delhi: any, Punjab: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const user = new User({
                    mobileNumber: key,
                    UP,
                    Delhi,
                    Punjab
                })
                await user.save()
                return resolve(1)
            } catch (err) {
                logger.error(err)
                return reject(err)
            }
        })
    }

    getLeaderBoardData(flag: boolean, key: string, mobileNumber: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const rank = "rank_" + key;
            const score = "score_" + key;
            let data;
            if (flag) {
                try {
                    data = await User.find(
                        {},
                        {
                            "_id": 0,
                            "mobileNumber": 1,
                            [rank]: 1,
                            [score]: 1
                        })
                        .limit(50)
                        .sort({
                            [rank]: 1
                        })
                } catch (err) {
                    logger.error('Error leaderboard : ' + err);
                    return reject(err);
                }
            } else {
                try {
                    data = await User.find(
                        {
                            mobileNumber
                        },
                        {
                            "_id": 0,
                            "mobileNumber": 1,
                            "rank_UP": 1,
                            "rank_UP_Awadh": 1,
                            "rank_UP_Purwanchal": 1,
                            "rank_UP_WestUP": 1,
                            "rank_UP_Bundelkhand": 1,
                            "rank_Goa": 1,
                            "rank_Punjab": 1,
                            "rank_Uttarakhand": 1,
                            "rank_OverAll":1,
                            "score_OverAll": 1,
                            "score_UP": 1,
                            "score_UP_Awadh": 1,
                            "score_UP_Purwanchal": 1,
                            "score_UP_WestUP": 1,
                            "score_UP_Bundelkhand": 1,
                            "score_Goa": 1,
                            "score_Punjab": 1,
                            "score_Uttarakhand": 1
                        });
                } catch (err) {
                    logger.error('Error users leaderboard : ' + err)
                    return reject(err)
                }
            }
            if (data !== null) return resolve(data)
            return reject(null)
        })
    }

}