import express from 'express';
import {authRouter} from './controllers/auth';

 const router = express.Router();

router.use('/auth', authRouter);

export {router};
