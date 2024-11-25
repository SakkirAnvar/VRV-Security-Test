import express from 'express';
import userRouter from './users/userRouter.js';
import roleRouter from './roles/roleRouter.js';
import dataToHome from './data/dataToHome.js';
import userSettingsRoute from './data/userSettingsRoute.js';









const router = express.Router();

router.use('/users',userRouter)
router.use('/roles',roleRouter)
router.use('/media',dataToHome)
router.use('/settings',userSettingsRoute)


export default router;
