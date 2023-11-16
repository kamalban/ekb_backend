

import Logger from '../../loaders/Logger';
import config from '../../config';
import { decode, verify } from 'jsonwebtoken';
import { BadTokenError, TokenExpiredError } from '../../core/APIerror';

const isAuth = (req: any, res: any, next: any) => {
    const mobileNumber = req.query.mobileNumber || req.body.mobileNumber;
    let token: any;
    if ((req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        console.log('token not found..')
    }

    // token verify
    verify(token, config.jwtSecret, (err: any, decoded: any) => {
        if (err) {
            if (err.message === 'jwt expired') {
                throw new TokenExpiredError();
            }
            throw new BadTokenError();
        } else {
            // console.log('d : ',decoded.user)
            // console.log('u : ',user);
            if (decoded.mobileNumber === mobileNumber) {
                next()
            } else {
                return new BadTokenError();
            }
        }
    });
}
export default isAuth;

