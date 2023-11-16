import { Mongoose } from 'mongoose';

export abstract class BaseMongo {
    protected mongooseClient: Mongoose;

    abstract init(): Promise<any>;
    abstract getUser(key: number): Promise<any>;
    abstract setCutOffDate(date: Date, type: string, state:string): Promise<any>;
    abstract getConfig(): Promise<any>;
}