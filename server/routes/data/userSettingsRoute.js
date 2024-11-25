import express from 'express';
import { applyNewSettingsChange, getSettings } from '../../controllers/userSettingsController.js';
import asyncHandler from '../../utils/asyncHandler.js';

const router=express.Router();

router.post('/applynewsettings/:id',asyncHandler(applyNewSettingsChange))
router.get('/getsettingsdata/:id',asyncHandler(getSettings))


export default router