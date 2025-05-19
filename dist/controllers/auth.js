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
const multer_1 = __importDefault(require("multer"));
const imagekit_1 = __importDefault(require("imagekit"));
exports.authRouter = express_1.default.Router(); // Create a new router instance
exports.authRouter.use(express_1.default.json()); // Parse JSON request bodies
const storage = multer_1.default.memoryStorage(); // or use diskStorage if saving to disk
const upload = (0, multer_1.default)({ storage });
const imagekit = new imagekit_1.default({
    publicKey: "public_Oo7AmdsNAR3ib3zQvLu0DYuMZrU=",
    privateKey: "private_ohtIPrTHBmT9UqjLqoqNPLBPbgI=",
    urlEndpoint: "https://ik.imagekit.io/sfmijw3gk"
});
//FOR USER CREATION INTO THE DB
exports.authRouter.post('/user_creation', upload.single('profilePic'), (0, asynchandler_1.async_errorhandler)(async (req, res) => {
    const { fullName, username, email, phone, dob, gender, password, confirmPassword, address, userType } = req.body;
    if (!fullName)
        return res.status(400).json({ sts: 400, msg: 'Name is Required' });
    if (!email)
        return res.status(400).json({ sts: 400, msg: 'Email is Required' });
    if (!password)
        return res.status(400).json({ sts: 400, msg: 'Password is Required' });
    if (!userType)
        return res.status(400).json({ sts: 400, msg: 'UserType is Required' });
    if (!['admin', 'user'].includes(userType))
        return res.status(400).json({ sts: 400, msg: 'UserType is not valid' });
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
    const profilePic = req.file?.buffer || '';
    const queryParams = [fullName, username, email, phone, dob, gender, password, confirmPassword, address, profilePic, userType];
    const queryString = `CALL user_creation(?, ?, ?,?, ?, ?,?, ?, ?,?,?);`;
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
//FOR USER LOGIN 
exports.authRouter.post('/login', (0, asynchandler_1.async_errorhandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email)
        return res.status(400).json({ sts: '400', msg: 'Email is required' });
    if (!password)
        return res.status(400).json({ sts: '400', msg: 'Password is required' });
    const params = [email, password];
    const sqlstring = `CALL user_login(?,?);`;
    const dbResponse = await mysql_helper_1.mySqlHelpers.exicuteWithQueryParams(sqlstring, params);
    if (Array.isArray(dbResponse) && dbResponse.length >= 2) {
        const resultSet1 = dbResponse[0]?.[0]; // sts & msg
        const resultSet2 = dbResponse[1][0]; // username list
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
}));
// FOR GETTING THE USERS
exports.authRouter.post('/get_user_list', (0, asynchandler_1.async_errorhandler)(async (req, res) => {
    const { email, password } = req?.body;
    if (!email)
        return res.status(400).json({ sts: '200', msg: 'Email is required' });
    if (!password)
        return res.status(400).json({ sts: '200', msg: 'Password is required' });
    if (!patterns_1.PATTERNS.EMAIL.test(email))
        return res.status(400).json({ sts: '400', msg: 'Invalid email Id' });
    if (!patterns_1.PATTERNS.PASSWORD.test(password))
        return res.status(400).json({ sts: '400', msg: 'Invalid password' });
    try {
        const params = [email, password];
        const sqlstring = `CALL GET_USERS_LIST(?,?)`;
        const dbResponse = await mysql_helper_1.mySqlHelpers.exicuteWithQueryParams(sqlstring, params);
        if (Array.isArray(dbResponse) && dbResponse.length >= 2) {
            let result = dbResponse[0][0];
            let sts = result?.sts;
            let msg = result?.msg;
            let data = dbResponse[1];
            data = data.map((user) => {
                if (user.profilePic && Buffer.isBuffer(user.profilePic)) {
                    const base64Image = user.profilePic.toString('base64');
                    // Add MIME type (assume JPEG or PNG — adjust if needed)
                    user.profilePic = `data:image/png;base64,${base64Image}`;
                }
                else {
                    user.profilePic = null;
                }
                return user;
            });
            console.log(result, sts);
            // return res.status(sts).json({sts:sts,msg:msg,data:data});
            return res.status(200).json({ sts, msg, data: data });
        }
        else {
        }
    }
    catch (err) {
    }
}));
exports.authRouter.post('/users/uploadImage', upload.array('image', 50), (0, asynchandler_1.async_errorhandler)(async (req, res) => {
    try {
        const { email, password, userId } = req.body;
        if (!email)
            return res.status(400).json({ sts: '400', msg: 'Email is required' });
        if (!password)
            return res.status(400).json({ sts: '400', msg: 'Password is required' });
        if (!userId)
            return res.status(400).json({ sts: '400', msg: 'User id is required' });
        if (!patterns_1.PATTERNS.EMAIL.test(email))
            return res.status(400).json({ sts: '400', msg: 'Invalid email Id' });
        if (!patterns_1.PATTERNS.PASSWORD.test(password))
            return res.status(400).json({ sts: '400', msg: 'Invalid password' });
        // UPLOADING IMAGE TO CLOUD
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }
        const uploadedImages = [];
        for (const file of files) {
            try {
                const result = await imagekit.upload({
                    file: file.buffer.toString('base64'),
                    fileName: file.originalname,
                    folder: userId
                });
                uploadedImages.push({
                    fileName: result.name,
                    filePath: result.filePath,
                    url: result.url,
                });
            }
            catch (imgErr) {
                console.error(`Error uploading ${file.originalname}:`, imgErr);
            }
        }
        // IF UPLOADS TO IMAGEKIT ARE SUCCESSFUL, CALL THE BATCH SP
        if (uploadedImages.length > 0) {
            const imageArray = uploadedImages.map(img => ({
                fileName: img.fileName,
                filePath: img.filePath
            }));
            const sqlstring = `CALL upload_images_batch(?,?,?,?)`;
            const params = [
                userId,
                email,
                password,
                JSON.stringify(imageArray)
            ];
            const dbResponse = await mysql_helper_1.mySqlHelpers.exicuteWithQueryParams(sqlstring, params);
            return res.status(200).json({
                sts: '200',
                msg: 'Images uploaded and stored successfully',
                data: dbResponse[0][0],
            });
        }
        else {
            return res.status(500).json({
                sts: '500',
                msg: 'No images were uploaded to ImageKit'
            });
        }
    }
    catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({ message: 'Upload failed', error });
    }
}));
exports.authRouter.post('/getAllDocumetns', (0, asynchandler_1.async_errorhandler)(async (req, res) => {
    const { userid, email, password } = req?.body;
    const params = [userid, email, password];
    const sqlstring = `CALL get_user_images(?,?,?)`;
    const dbResponse = await mysql_helper_1.mySqlHelpers.exicuteWithQueryParams(sqlstring, params);
    if (Array.isArray(dbResponse) && dbResponse.length >= 2) {
        const resultSet1 = dbResponse[0]?.[0]; // sts & msg
        const resultSet2 = dbResponse[1]; // list of imagePath rows
        const sts = resultSet1?.sts;
        const msg = resultSet1?.msg;
        if (sts == '200') {
            // Collect all image lists
            // const allImages = [];
            try {
                const result = await imagekit.listFiles({
                    path: userid,
                    limit: 100
                });
                const images = result.map((e) => ({
                    imageName: e.name,
                    imageUrl: e.url
                }));
                console.log(result);
                return res.status(200).json({ sts: '200', msg: 'get records success', data: images });
            }
            catch (err) {
                // console.error(`Failed to fetch images from ${path}:`, err);
            }
            // return res.status(200).json({ sts, msg, data: allImages });
        }
        else {
            return res.status(400).json({ sts, msg });
        }
    }
    else {
        console.log('Unexpected DB response format:', dbResponse);
        return res.status(400).json({ sts: '400', msg: 'Unexpected response from DB' });
    }
}));
//# sourceMappingURL=auth.js.map