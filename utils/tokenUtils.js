// utils/tokenUtils.js

import jwt from "jsonwebtoken";
import tokenModel from "../models/tokenModel.js";  

// Token generation function
const generateToken = async (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'  // Token expiration time
    });

    // Store token in the database
    const newToken = new tokenModel({
        token,
        user: user._id,
        expirationDate: new Date(Date.now() + 3600000)  // Expiration set to 1 hour
    });
    await newToken.save();

    return token;
};

export default generateToken;
