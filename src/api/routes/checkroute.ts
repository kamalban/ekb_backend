import logger from '../../loaders/Logger';
import { Router } from 'express';
logger.silly('c 1')
// import middlewares from '../middlewares';
import { FantasyPolitics } from '../../controller/FantasyPolitics';
logger.silly('c 2')



const route = Router();

export default ( app: Router) => {
    app.use('',route);

    route.post('/check', (req, res) => {
        FantasyPolitics.check(req,res)
    });

    route.post('/newuser', (req, res) => {
        FantasyPolitics.tmpUsersaved(req,res)
    })

    route.post('/adduser', (req, res) => {
        FantasyPolitics.adduser(req, res)
    })

    route.post('/addnewstate',(req,res) => {
        FantasyPolitics.addNewState(req, res)
    })


}