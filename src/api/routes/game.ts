import { Router } from 'express';
// import middlewares from '../middlewares';
import { FantasyPolitics } from '../../controller/FantasyPolitics';

import middleware  from '../middlewares';

const route = Router();

export default ( app: Router) => {
    app.use('',route);

    route.get('/check', (req, res) => {
        res.send('Server is up.')
    });

    route.post('/resetglobalconfig', (req, res) => {
        FantasyPolitics.resetGlobalConfigVaribale(req, res)
    })

    route.post('/updateteamdata', middleware.ReqValidate.updateDataRequest, (req, res) => {
        FantasyPolitics.updateUserData(req,res)
    })

    route.post("/getleaderboardata",(req,res) => {
        FantasyPolitics.getLeaderBoard(req, res)
    })

    route.post('/updateclickfield', (req, res) => {
        FantasyPolitics.updateKnowMoreField(req, res)
    })

    route.post('/saveformdata', middleware.ReqValidate.saveFormDataRequest, (req, res) => {
        FantasyPolitics.saveFormData(req, res)
    })

    route.post('/cutoffdate', (req, res) => {
        FantasyPolitics.setCutOffDate(req,res)
    })

    route.post('/statelist',(req,res) => {
        FantasyPolitics.stateList(req, res)
    })

    route.post('/addparty', (req, res) => {
        FantasyPolitics.addParty(req, res)
    })

    route.post('/getparty', (req, res) => {
        FantasyPolitics.getParty(req, res)
    })
}