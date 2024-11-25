import express from 'express';
import { addEnquiryDetails, editEnquiryDetails, getFilteredEnquiry, getSingleEnquiry, listEnquiry } from '../../controllers/enquiryController.js';
import asyncHandler from '../../utils/asyncHandler.js';
import checkPermission from '../../utils/auth.js';
import { verifyToken } from '../../utils/jwtToken.js';

const router = express.Router();

router.get('/enquirylist',verifyToken, checkPermission("enquiry", "view"),asyncHandler(listEnquiry))
router.get('/getfilteredlist',verifyToken, checkPermission("enquiry", "view"),asyncHandler(getFilteredEnquiry))
router.get('/:id',verifyToken, checkPermission("enquiry", "view"),asyncHandler(getSingleEnquiry))
router.put('/:id',verifyToken, checkPermission("enquiry", "edit"),asyncHandler(editEnquiryDetails))

//api for data from website
router.post('/addenquiry',asyncHandler(addEnquiryDetails))


export default router