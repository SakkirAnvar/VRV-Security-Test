import express from 'express';
import {
  deleteNewsLetterEmail,
  findNewsLetterEmails,
  submitNewsLetterEmail
} from '../../controllers/newsLetterEmail.js';
import { verifyToken } from '../../utils/jwtToken.js';
import checkPermission from '../../utils/auth.js';
import asyncHandler from '../../utils/asyncHandler.js';

const router = express.Router();

router.post('/newsletteremail', asyncHandler(submitNewsLetterEmail));
router.get('/filterednewslettersemail',verifyToken,checkPermission("newsLetter", "view"), asyncHandler(findNewsLetterEmails));
router.delete('/deletenewsletteremail/:id',verifyToken,checkPermission("newsLetter", "delete"), asyncHandler(deleteNewsLetterEmail));

export default router;
