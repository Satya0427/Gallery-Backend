import express, { Request, Response } from 'express';
import { async_errorhandler } from '../utils/asynchandler';
import { PATTERNS } from '../utils/patterns';
import { mySqlHelpers } from '../helper/mysql-helper';


export const authRouter = express.Router(); // Create a new router instance

authRouter.use(express.json()); // Parse JSON request bodies

authRouter.post('/regestration', async_errorhandler(async (req: Request, res: Response) => {
    const {fullName, username, email, phone, dob, gender, password, confirmPassword, address, profilePic} = req.body;

    if (!fullName) return res.status(400).json({ sts: 400, msg: 'Name is Required' });
    if (!email) return res.status(400).json({ sts: 400, msg: 'Email is Required' });
    if (!password) return res.status(400).json({ sts: 400, msg: 'Password is Required' });

    if (typeof fullName !== 'string') return res.status(400).json({ sts: 400, msg: 'Name is Invalid' });
    if (typeof email !== 'string') return res.status(400).json({ sts: 400, msg: 'Email is Invalid' });
    if (typeof password !== 'string') return res.status(400).json({ sts: 400, msg: 'Password is Invalid' });

    if (!PATTERNS.EMAIL.test(email)) return res.status(400).json({ sts: 400, msg: 'Email is Invalid' });
    if (!PATTERNS.PASSWORD.test(password)) return res.status(400).json({ sts: 400, msg: 'Password is Invalid' });

    const queryParams = [fullName, username, email, phone, dob, gender, password, confirmPassword, address, profilePic];

    const queryString = `CALL user_creation(?, ?, ?,?, ?, ?,?, ?, ?,?);`;

    try {
        const dbResponse = await mySqlHelpers.exicuteWithQueryParams(queryString, queryParams);

        if (Array.isArray(dbResponse) && dbResponse.length >= 2) {
            const resultSet1 = dbResponse[0]?.[0]; // sts & msg
            const resultSet2 = dbResponse[1];      // username list

            const sts = resultSet1?.sts;
            const msg = resultSet1?.msg;

            if (sts == '200') {
                return res.status(200).json({ sts, msg, data: resultSet2 });
            } else {
                return res.status(400).json({ sts, msg });
            }
        } else {
            console.log('Unexpected DB response format:', dbResponse);
            return res.status(400).json({ sts: '400', msg: 'Unexpected response from DB' });
        }
    } catch (error: any) {
        console.error('Database Error:', error);
        return res.status(500).json({ sts: 500, msg: 'Database error', error: error.message });
    }

}));
