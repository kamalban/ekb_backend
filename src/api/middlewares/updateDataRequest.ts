import { Request, Response } from 'express';
import Joi from 'joi';
import logger from '../../loaders/Logger';

// import { BadRequestResponse } from '../../core/APIresponse';
import { BadRequestError } from '../../core/APIerror';

export class ReqValidate{

    public static updateDataRequest(req: Request, res: Response, next: any) {
        const schemaRules = {
            mobileNumber: Joi.string().min(10).max(12).required(),
            state: Joi.string().required(),
            data: Joi.object().required(),
            flag: Joi.boolean()
        }
        const schema = Joi.object(schemaRules);

        const { error, value } = schema.validate(req.body);

        if(error) {
            logger.error(JSON.stringify(error));
            throw new BadRequestError(JSON.stringify(error));
            // new BadRequestResponse(JSON.stringify(error)).send(res);
        } else {
            next();
        }
    }

    public static saveFormDataRequest(req: Request, res: Response, next: any) {
        const schemaRules = {
            mobileNumber: Joi.string().min(10).max(12).required(),
            form: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                // pincode: Joi.string().required()
            }).required(),
        }
        const schema = Joi.object(schemaRules);

        const { error, value } = schema.validate(req.body);

        if(error) {
            logger.error(JSON.stringify(error));
            throw new BadRequestError(JSON.stringify(error));
            // new BadRequestResponse(JSON.stringify(error)).send(res);
        } else {
            next();
        }
    }
}