import express from 'express';
import {userRegistered} from '../controllers/auth.controller.js';


const userRouter =express.Router();
userRouter.post('/register',userRegistered);
export default userRouter;