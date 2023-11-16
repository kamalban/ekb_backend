import mongoose from "mongoose";
import logger from "../loaders/Logger";
const Schema = mongoose.Schema;

const UPSchema = new Schema({
  Awadh: { type: Schema.Types.Mixed }, // { "BJP+":12, "CONG+": 14}
  Purwanchal: { type: Schema.Types.Mixed },
  "West UP": { type: Schema.Types.Mixed },
  Bundelkhand: { type: Schema.Types.Mixed },
});

// const UPScoreSchema = new Schema({
//   Awadh: { type: Number }, // { "BJP+":12, "CONG+": 14}
//   Purwanchal: { type: Number },
//   "West UP": { type: Number },
//   Bundelkhand: { type: Number },
// });

const userInfoSchema = new Schema({
  mobileNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  click: {
    type: Boolean,
    default: false,
  },
  UP: {
    type: [UPSchema],
  },
  Uttarakhand: {
    type: [Schema.Types.Mixed], // [{"BJP+":12, "CONG+": 14}]
  },
  Punjab: {
    type: [Schema.Types.Mixed], // [{ "BJP+":12, "CONG+": 14}]
  },
  Goa: {
    type: [Schema.Types.Mixed],
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(), // (Date.now() + (330 * 60 * 1000)).getTime()
  },
  updatedAt: {
    type: Date,
    default: new Date(), // (Date.now() + (330 * 60 * 1000)).getTime()
  },
  banned: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
  },
  bannedUpdate: {
    type: Date,
    default: new Date(),
  },
  score_UP: { type: Number },
  score_Uttarakhand: { type: Number },
  score_Goa: { type: Number },
  score_Punjab: { type: Number },
  score_OverAll: { type: Number },

  rank_OverAll: { type: Number },
  rank_UP: { type: Number },
  rank_Uttarakhand: { type: Number },
  rank_Goa: { type: Number },
  rank_Punjab: { type: Number },
});

const Users = mongoose.model("user", userInfoSchema);

module.exports = Users;

Users.createIndexes({ mobileNumber: 1 });
// Users.ensureIndexes((err: any) =>  {
//     if (err)
//         logger.error('E : '+err);
//     else
//         logger.info('create up index successfully');
// })
