import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const gameConfigSchema = new Schema({
    cutOffDate: {
        type: Schema.Types.Mixed
    },
    state: {
        type: Schema.Types.Mixed
    },
    partyList: [
        Schema.Types.Mixed
    ]
    // partyList: [
    //     {
    //         UP: {
    //             type: {
    //                 Zone1: [String],
    //                 Zone2: [String],
    //                 Zone3: [String],
    //                 Zone4: [String]
    //             }
    //         }
    //     },
    //     { Delhi: [String] },
    //     { Punjab: [String] }
    // ]
});

const GameConfig = mongoose.model('gameConfig', gameConfigSchema);

module.exports = GameConfig;