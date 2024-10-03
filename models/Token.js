import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expirationDate: { type: Date, required: true }
});
const tokenModel = mongoose.model('token', TokenSchema);

export default tokenModel;
