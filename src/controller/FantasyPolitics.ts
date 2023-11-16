import { Request, Response } from 'express';
import { Server } from '../loaders/Server';
import logger from '../loaders/Logger';
import jwt, { decode } from 'jsonwebtoken';
import configs from '../config';

import { BadRequestResponse, DuplicateResponse, NotFoundResponse, SuccessMsgResponse, SuccessResponse } from '../core/APIresponse';
import { TokenExpiredError, BadTokenError } from '../core/APIerror';

import { Mongodb } from '../model/Mongo';

export class FantasyPolitics {

    static AverageDataMap = new Map();

    public static async check(req: Request, res: Response) {
        logger.silly('check route...')
        const state = req.body.state;
        const data = this.AverageDataMap.get(state)
        logger.silly(JSON.stringify(req.headers.authorization))
        res.send(data)
    }

    public static async resetGlobalConfigVaribale(req: Request, res: Response) {
        logger.info('Resetting Global Config');
        try {
            await Server.instance.mongodb.setDefaultConfig()
        } catch (err) {
            logger.error('Error while setting global config. ' + err)
            return new BadRequestResponse(err).send(res)
        }
        return new SuccessMsgResponse('ok').send(res)
    }

    public static async updateUserData(req: Request, res: Response) {
        logger.silly('updating...')
        let mobileNumber = req.body.mobileNumber || null;
        const state = req.body.state;
        const data = req.body.data;
        const flag = req.body.flag || false;
        const Config = Mongodb.gameConfig;
        logger.info(req.body.mobileNumber)
        logger.silly('s : ' + state)
        // logger.silly(JSON.stringify(data))
        logger.silly('32 : ' + Config.cutOffDate[state])
        if (mobileNumber === null || mobileNumber === '1234567890') {
            mobileNumber = this.getMobileNumber(req)
            if (mobileNumber === null) {
                logger.error('Mobile number not found')
                return new BadRequestResponse('Mobile number not found').send(res)
            }
        }
        try {
            const date = new Date();
            logger.silly('checking date condition.')
            logger.silly('date : ' + new Date(Config.cutOffDate[state]) + ' s: name : ' + state)
            if (date >= new Date(Config.cutOffDate[state])) {
                logger.info('You cant update your team now.');
                return new BadRequestResponse('Time Out').send(res)
            }
        } catch (err) {
            return new BadRequestResponse('').send(res);
        }
        let user;

        try {
            user = await Server.instance.mongodb.getUser(mobileNumber);
            logger.silly(user)
            logger.silly(user.Uttarakhand)
            if (user[state] && user[state].length !== 0 && !flag) {
                return new DuplicateResponse('You want to overwrite your team data?').send(res)
            }
        } catch (err) {
            logger.error('48 : ' + err);

            return new NotFoundResponse(err).send(res)
        }
        logger.silly('old data : ' + JSON.stringify(user[state]))
        if (user[state] && user[state].length === 0) {
            user[state] = data
        } else {
            user[state] = 0
            user[state] = data
        }
        logger.silly(JSON.stringify(user[state]))
        await user.save();
        return new SuccessMsgResponse('Team updated').send(res)
    }

    public static async getLeaderBoard(req: Request, res: Response) {
        logger.info("Getting leader board data")
        const mobileNumber = req.body.mobileNumber;
        // const key = [
        //     "UP",
        //     "OverAll",
        //     "Goa",
        //     "Punjab",
        //     "Uttarakhand"
        // ];
        const data = {
            "user": ""
        };
        try {
            logger.silly(mobileNumber)
            // for (const stateRank of key) {
            //     let mongoData;
            //     mongoData = await Server.instance.mongodb.getLeaderBoardData(true, stateRank,0);
            //     const temp:any = []
            //     for(const  i of mongoData) {
            //         const num = String(i.mobileNumber);
            //         const rank = "rank_"+stateRank;
            //         const score = "score_"+stateRank;
            //         // i.mobileNumber = num[0]+num[1]+"*******"+num[9];
            //         temp.push({mobileNumber: num[0]+num[1]+"*******"+num[9], [rank]: i[rank], [score]:i[score] })
            //         logger.silly(i);
            //     }
            //     data[stateRank] = temp
            // }
            if (mobileNumber !== 0) {
                data.user = await Server.instance.mongodb.getLeaderBoardData(false,"",mobileNumber)
            }
        } catch (err) {
            logger.error('Error leaderboard : ' + err);
            return new BadRequestResponse(err).send(res)
        }
        return new SuccessMsgResponse(JSON.stringify(data)).send(res)
    }
    public static async updateKnowMoreField(req: Request, res: Response) {
        logger.info('saving user click on know more.')
        let flag;
        const num = req.body.mobileNumber;
        try {
            flag = await Server.instance.mongodb.setKnowMoreField(num)
            logger.info('flag : ' + flag)
            return new SuccessMsgResponse('update successfull').send(res)
        } catch (err) {
            logger.error('Error while updating knowmore field. ' + err);
            return new BadRequestResponse('Error while updating knwomore field. ' + err).send(res)
        }
    }

    public static async saveFormData(req: Request, res: Response) {
        logger.info('form data saving....')
        const num = req.body.mobileNumber;
        const form = req.body.form;
        let user;
        try {
            user = await Server.instance.mongodb.getUser(num);
            user.name = form.name;
            user.email = form.email;
            // user.pincode = form.pincode;
            try {
                user.save();
                return new SuccessMsgResponse('form saved successfully').send(res)
            } catch (err) {
                logger.error('Error while saving form data. ' + err);
                return new BadRequestResponse('Error while saving form data. ' + err).send(res)
            }
        } catch (err) {
            logger.error('Error while fetching user : ' + err)
            return new BadRequestResponse('Error while fetching user. ' + err).send(res)
        }
    }
    public static async tmpUsersaved(req: Request, res: Response) {

        const mobileNumber = req.body.mobileNumber;
        try {
            const user = await Server.instance.mongodb.setUser(mobileNumber, '1234');
            res.send('Ok ' + user);
        } catch (err) {
            logger.error(err)
            res.send(err)
        }

    }

    public static async setCutOffDate(req: Request, res: Response) {
        const cutoffdate = req.body.date;
        const date = new Date(cutoffdate);
        const type = req.body.type;
        const state = req.body.state;

        try {
            logger.silly(cutoffdate)
            await Server.instance.mongodb.setCutOffDate(date, type, state)
            return new SuccessResponse('Cutoff date set', 'Cutoff date set.').send(res);
        } catch (err) {
            logger.error(err)
            return new BadRequestResponse(err).send(res)
        }
    }

    public static async addNewState(req: Request, res: Response) {
        logger.info('adding new state')
        const newState = req.body.state;
        let config;
        try {
            config = await Server.instance.mongodb.getConfig();
            if (!config.state || config.state.length === 0) {
                const state = [newState]
                config.state = state
            } else {
                for (const s of config.state) {
                    logger.silly(s)
                    if (s === newState) {
                        logger.error('State already in the list.')
                        return new BadRequestResponse('State already in the list.').send(res)
                    }
                }
                config.state.push(newState);
            }
            await config.save();
            Mongodb.gameConfig = config;
        } catch (err) {
            logger.silly('adding new state error : ' + config)
            logger.error('Error while adding new state. ' + err)
            if (err === null) {

                this.addNewState(req, res)
            } else {
                return res.send(err)
            }

        }
        res.send('ok')
    }

    public static async stateList(req: Request, res: Response) {
        logger.info('Getting state list.')
        let config;
        try {
            config = Mongodb.gameConfig;
            logger.silly('1')
            if (!config && !config.state || config.state.length === 0) {
                return new BadRequestResponse('No state found.')
            } else {
                logger.silly('2')
                const data: any = { "state": config.state, "userData": '', "cutOffDate": config.cutOffDate }
                // logger.silly(this.getMobileNumber(req))
                const mobileNumber: number = this.getMobileNumber(req);
                logger.silly('155 : ' + mobileNumber)
                let userData;
                if (mobileNumber) {
                    try {
                        userData = await Server.instance.mongodb.getUser(mobileNumber)
                        const uData: any = userData;
                        uData.otp = 'na'
                        logger.silly('162 : ' + JSON.stringify(uData))
                        data.userData = uData;
                    } catch (err) {
                        logger.error(err)
                    }
                }
                return new SuccessMsgResponse(JSON.stringify(data)).send(res)
            }
        } catch (err) {
            logger.silly('174 : ' + JSON.stringify(config))
            logger.error(err)
            res.send(err)
        }
    }

    public static async addParty(req: Request, res: Response) {
        logger.info('Getting config for adding party.')
        let config;
        const state: string = req.body.state;
        const data = req.body.data;
        const totalSeats: number = req.body.totalSeats;
        const party = { [state]: data, "totalSeats": totalSeats };
        const update: boolean = req.body.update || false;
        logger.silly(update)
        try {
            config = await Server.instance.mongodb.getConfig();
            logger.silly(config.partyList.length)
            if (config.partyList.length === 0) {
                config.partyList.push(party)
                await config.save();
                Mongodb.gameConfig = config;
                return new SuccessMsgResponse('ok')
            } else {
                for (let i = 0; i < config.partyList.length; i++) {
                    const tmp = Object.keys(config.partyList[i])[0]
                    logger.silly(tmp)
                    logger.silly('check : ' + tmp + ' : ' + state + ' : ' + update)
                    if (tmp === state && update) {
                        config.partyList[i] = party;
                        logger.silly(JSON.stringify(party))
                        config.save()
                        Mongodb.gameConfig = config;
                        return new SuccessMsgResponse('updated...').send(res)
                    } else if (tmp === state && !update) {
                        logger.info("party for state is already added.")
                        return new DuplicateResponse("party for state is already added.").send(res)
                    }
                }
                config.partyList.push(party)
                config.save()
                Mongodb.gameConfig = config;
                // const data = config.partyList
                return new SuccessMsgResponse("data").send(res)
            }
        } catch (err) {
            logger.error(err)
            res.send(err)
        }
    }

    public static async getParty(req: Request, res: Response) {
        logger.info('Getting party list.')
        let config;
        const state: string = req.body.state
        try {
            // config = await Server.instance.mongodb.getConfig();
            config = Mongodb.gameConfig;
            if (!config.partyList || config.partyList.length === 0) {
                return new BadRequestResponse('No party list found.')
            } else {
                const data: any = {}
                for (const i of config.partyList) {
                    const tmp = Object.keys(i)[0]
                    logger.silly(tmp + ' : ' + state)
                    if (tmp === state) {
                        data[state] = i[tmp];
                        data.totalSeats = i.totalSeats
                        logger.silly(i.totalSeats)
                        break;
                    }
                }
                return new SuccessMsgResponse(data).send(res)
            }
        } catch (err) {
            logger.error(err)
            res.send(err)
        }
    }

    public static getMobileNumber(req: Request): number {
        let token;
        let num: number = 0;
        if (
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        ) {
            logger.silly('token found')
            token = req.headers.authorization.split(' ')[1];

            try {
                jwt.verify(token, configs.jwtSecret, (err: any, decoded: any) => {
                    logger.silly('token verify')
                    if (err) {
                        logger.error(err)
                        if (err.message === 'jwt expired') {
                            logger.silly('token expired')
                            return 0;
                        }

                    } else {
                        logger.silly('token : ' + decoded.mobileNumber)
                        num = decoded.mobileNumber;
                    }
                });
            } catch (err) {
                logger.error(err)
                return 0;
            }

        }
        logger.silly('num in token ' + num)
        return num;

    }

    // add temprary users
    public static async adduser(req: Request, res: Response) {
        logger.info('adding user')
        const num = 2000000;
        try {
            for (let i = 151298; i < num; i++) {
                const ph = 9700000000 + i;
                // const name = ["Shivam", "shubham", "Arun", "Sachin", "Sanju", "Rahul", "Ajay", "Ankit", "Anurag", "Bharat" ];
                const UP = [{
                    "Region1": { "BJP": 50, "CONG": 50, "AAP": 50 },
                    "Region2": { "BJP": 50, "CONG": 50, "AAP": 50 },
                    "Region3": { "BJP": 50, "CONG": 50, "AAP": 50 },
                    "Region4": { "BJP": 50, "CONG": 50, "AAP": 50 }
                }];
                const Delhi = [{ "BJP": 5, "CONG": 5, "AAP": 5 }]
                const Punjab = [{ "BJP": 15, "CONG": 15, "AAP": 15 }];
                await Server.instance.mongodb.setTmpData(ph, UP, Delhi, Punjab)
            }
        } catch (err) {
            logger.error(err)
            res.send(err)
        }


        res.send('ok')
    }
}