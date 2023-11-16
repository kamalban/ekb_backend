import { Router } from 'express';
import { OTPGenVerify } from '../../controller/OTPGenVerify';

// import middleware  from '../middlewares';

const route = Router();

export default ( app: Router) => {
    app.use('',route);

    route.post('/generateotp', (req,res) => {
        OTPGenVerify.generateOTP(req,res)
    })

    route.post('/verifyotp', (req,res) => {
        OTPGenVerify.verifyOTP(req,res)
    })

    route.post('/')
}