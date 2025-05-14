import express, { Request, Response } from 'express';
import { async_errorhandler } from '../utils/asynchandler';
import { PATTERNS } from '../utils/patterns';
import { mySqlHelpers } from '../helper/mysql-helper';
import multer from 'multer';

export const authRouter = express.Router(); // Create a new router instance

authRouter.use(express.json()); // Parse JSON request bodies

const storage = multer.memoryStorage(); // or use diskStorage if saving to disk

const upload = multer({ storage });


//FOR USER CREATION INTO THE DB
authRouter.post('/user_creation', upload.single('profilePic'), async_errorhandler(async (req: Request, res: Response) => {
    const { fullName, username, email, phone, dob, gender, password, confirmPassword, address, userType } = req.body;

    if (!fullName) return res.status(400).json({ sts: 400, msg: 'Name is Required' });
    if (!email) return res.status(400).json({ sts: 400, msg: 'Email is Required' });
    if (!password) return res.status(400).json({ sts: 400, msg: 'Password is Required' });
    if (!userType) return res.status(400).json({ sts: 400, msg: 'UserType is Required' });
    if (!['admin', 'user'].includes(userType)) return res.status(400).json({ sts: 400, msg: 'UserType is not valid' })

    if (typeof fullName !== 'string') return res.status(400).json({ sts: 400, msg: 'Name is Invalid' });
    if (typeof email !== 'string') return res.status(400).json({ sts: 400, msg: 'Email is Invalid' });
    if (typeof password !== 'string') return res.status(400).json({ sts: 400, msg: 'Password is Invalid' });

    if (!PATTERNS.EMAIL.test(email)) return res.status(400).json({ sts: 400, msg: 'Email is Invalid' });
    if (!PATTERNS.PASSWORD.test(password)) return res.status(400).json({ sts: 400, msg: 'Password is Invalid' });
    const profilePic = req.file?.buffer || '';

    const queryParams = [fullName, username, email, phone, dob, gender, password, confirmPassword, address, profilePic, userType];

    const queryString = `CALL user_creation(?, ?, ?,?, ?, ?,?, ?, ?,?,?);`;

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

// FOR GETTING THE USERS

authRouter.get('/get_user_list', async_errorhandler(async (req: Request, res: Response) => {
    const { email, password } = req?.body;
    if (!email) return res.status(400).json({ sts: '200', msg: 'Email is required' });
    if (!password) return res.status(400).json({ sts: '200', msg: 'Password is required' });

    if (!PATTERNS.EMAIL.test(email)) return res.status(400).json({ sts: '400', msg: 'Invalid email Id' })
    if (!PATTERNS.PASSWORD.test(password)) return res.status(400).json({ sts: '400', msg: 'Invalid password' })


    try {
        const params = [email, password];
        const sqlstring = `CALL GET_USERS_LIST(?,?)`
        const dbResponse = await mySqlHelpers.exicuteWithQueryParams(sqlstring, params)
        if (Array.isArray(dbResponse) && dbResponse.length >= 2) {
            let result = dbResponse[0][0];
            let sts = result?.sts;
            let msg = result?.msg
            let data = dbResponse[1];
            data = data.map((user: any) => {
                if (user.profilePic && Buffer.isBuffer(user.profilePic)) {
                    const base64Image = user.profilePic.toString('base64');
                    // Add MIME type (assume JPEG or PNG — adjust if needed)
                    user.profilePic = `data:image/png;base64,${base64Image}`;
                } else {
                    user.profilePic = null;
                }
                return user;
            });
            console.log(result, sts);
            // return res.status(sts).json({sts:sts,msg:msg,data:data});
            return res.status(200).json({ sts, msg, data: data });
        } else {

        }
    } catch (err: any) {

    }
}))
