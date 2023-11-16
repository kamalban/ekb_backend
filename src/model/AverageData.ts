import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const averageDataSchema = new Schema({
    key: {      // statename_partyname
        type: String
    },
    count: {
        type: Number
    },
    totalUser: {
        type: Number
    }
});

const AverageData = mongoose.model('averageData', averageDataSchema);

module.exports = AverageData;