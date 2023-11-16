import { Request, Response } from 'express';
import { Server } from '../loaders/Server';
import jwt from 'jsonwebtoken';

import logger from '../loaders/Logger';
import config from '../config'

import { BadRequestResponse, DuplicateResponse, NotFoundResponse, SuccessMsgResponse, SuccessResponse } from '../core/APIresponse';


import { RequestAPI } from '../core/RequestAPI';
import { Mongodb } from '../model/Mongo';

export class OTPGenVerify {

    public static async generateOTP(req: Request, res: Response) {
        const mobileNumber: string = req.body.mobileNumber;
        let user;
        let OTP: string;
        logger.silly(mobileNumber)
        try {
            user = await Server.instance.mongodb.getUser(Number(mobileNumber));
            OTP = user.otp;
        } catch (err) {
            if (err === null) {
                const Config = Mongodb.gameConfig;
                const date = new Date();
                logger.silly('checking date condition.')
                if (date >= new Date(Config.cutOffDate.UP)) {
                    logger.info('You cant register now.');

                    // If you are changing this Badrequestresponse message please update the message at the frontend.
                    return new BadRequestResponse('Registration closed').send(res)
                }
                OTP = this.otpGenerate();
                await Server.instance.mongodb.setUser(Number(mobileNumber), OTP)
            } else {
                logger.error(err);
                return new BadRequestResponse(err).send(res)
            }
        }

        const to = '91' + mobileNumber;
        const text = encodeURIComponent(`${OTP} is your OTP to login to EKB. Please do not share this with anyone. Visit www.Gamesmasti.com for more games.`)

        const param1 = '?feedid=' + config.feedId + '&username=' + config.userName + '&password=' + config.password
        const param2 = '&To=' + to + '&Text=' + text + '&entityid=' + config.principalEntityId + '&channelname=' + config.channelName
        const param3 = '&templateid=' + config.templateId + '&async=' + config.async + '&short=' + config.short + '&senderid=' + config.senderId


        const reqOptions = {
            host: 'bulkpush.mytoday.com',
            path: '/BulkSms/SingleMsgApi' + param1 + param2 + param3,
            method: 'GET',
            headers: config.headers
        }
        logger.silly(reqOptions.host + reqOptions.path)
        try {
            logger.silly('calling sms api')
            const apires = await RequestAPI.API(reqOptions, {})
            logger.silly('7')

        } catch (err) {
            logger.error('error while sending otp ' + err)
        }
        logger.silly('otp send.')
        return new SuccessMsgResponse(String(OTP)).send(res)

    }

    public static async verifyOTP(req: Request, res: Response) {
        const mobileNumber: string = req.body.mobileNumber;

        const OTP: string = String(req.body.otp);
        let user;
        let token;

        try {
            user = await Server.instance.mongodb.getUser(Number(mobileNumber))
        } catch (err) {
            logger.error(err);
            return new BadRequestResponse(err).send(res)
        }
        try {
            logger.silly(OTP)
            logger.silly(user)
            logger.info('78 : user otp : ' + user.otp + ' : enter otp : ' + OTP)
            logger.info('78 : user otp : ' + typeof user.otp + ' : ' + typeof OTP)
            if (user.otp === OTP) {
                token = this.generateToken(mobileNumber)
                const newOtp = this.otpGenerate()
                user.otp = newOtp;
                const userData: any = user;
                await user.save();
                userData.otp = 'NA';
                let data: any = { "token": token, "userData": userData }
                logger.silly('87 : ' + JSON.stringify(data))
                data = JSON.stringify(data)
                return new SuccessMsgResponse(data).send(res)
            } else {
                return new NotFoundResponse('not valid').send(res)
            }
        } catch (err) {
            logger.error('Error while verifing OTP. ' + err)
            if (err === null) return new BadRequestResponse('Otp expired').send(res)
            return new BadRequestResponse(err).send(res)
        }
    }

    public static verifyToken(req: Request, res: Response) {
        let token;
        if (
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
                if (err) {

                    if (err.message === 'jwt expired') {

                        return new BadRequestResponse('Token invalid').send(res);
                    }
                    return new BadRequestResponse('Token invalid');
                }
            });
        }
    }

    public static otpGenerate(): string {
        let OTP = String(Math.ceil(Math.random() * 10000));
        const len = OTP.length;
        switch (len) {
            case 1:
                OTP = OTP + '000';
                break;
            case 2:
                OTP = OTP + '00';
                break;
            case 3:
                OTP = OTP + '0';
        }
        return OTP;
    }
    private static generateToken(mobileNumber: string) {

        return jwt.sign({ mobileNumber }, config.jwtSecret, { expiresIn: '12h' });

    }
}