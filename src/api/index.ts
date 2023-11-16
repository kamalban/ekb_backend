import { Router } from 'express';
import check from './routes/checkroute';
import game from './routes/game';
import verify from './routes/OTPGenVerify';

export default () => {
    const app = Router();

    check(app)

    game(app)

    verify(app)

    return app;
}