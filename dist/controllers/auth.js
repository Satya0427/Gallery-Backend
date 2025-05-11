"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const asynchandler_1 = require("../utils/asynchandler");
const patterns_1 = require("../utils/patterns");
const mysql_helper_1 = require("../helper/mysql-helper");
exports.authRouter = express_1.default.Router(); // Create a new router instance
exports.authRouter.use(express_1.default.json()); // Parse JSON request bodies
exports.authRouter.post('/regestration', (0, asynchandler_1.async_errorhandler)(async (req, res) => {
    const { fullName, username, email, phone, dob, gender, password, confirmPassword, address, profilePic } = req.body;
    if (!fullName)
        return res.status(400).json({ sts: 400, msg: 'Name is Required' });
    if (!email)
        return res.status(400).json({ sts: 400, msg: 'Email is Required' });
    if (!password)
        return res.status(400).json({ sts: 400, msg: 'Password is Required' });
    if (typeof fullName !== 'string')
        return res.status(400).json({ sts: 400, msg: 'Name is Invalid' });
    if (typeof email !== 'string')
        return res.status(400).json({ sts: 400, msg: 'Email is Invalid' });
    if (typeof password !== 'string')
        return res.status(400).json({ sts: 400, msg: 'Password is Invalid' });
    if (!patterns_1.PATTERNS.EMAIL.test(email))
        return res.status(400).json({ sts: 400, msg: 'Email is Invalid' });
    if (!patterns_1.PATTERNS.PASSWORD.test(password))
        return res.status(400).json({ sts: 400, msg: 'Password is Invalid' });
    const queryParams = [fullName, username, email, phone, dob, gender, password, confirmPassword, address, profilePic];
    const queryString = `CALL user_creation(?, ?, ?,?, ?, ?,?, ?, ?,?);`;
    try {
        const dbResponse = await mysql_helper_1.mySqlHelpers.exicuteWithQueryParams(queryString, queryParams);
        if (Array.isArray(dbResponse) && dbResponse.length >= 2) {
            const resultSet1 = dbResponse[0]?.[0]; // sts & msg
            const resultSet2 = dbResponse[1]; // username list
            const sts = resultSet1?.sts;
            const msg = resultSet1?.msg;
            if (sts == '200') {
                return res.status(200).json({ sts, msg, data: resultSet2 });
            }
            else {
                return res.status(400).json({ sts, msg });
            }
        }
        else {
            console.log('Unexpected DB response format:', dbResponse);
            return res.status(400).json({ sts: '400', msg: 'Unexpected response from DB' });
        }
    }
    catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ sts: 500, msg: 'Database error', error: error.message });
    }
}));
//# sourceMappingURL=auth.js.map