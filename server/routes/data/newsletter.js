import express from 'express';
import {
  submitNewsletter,
  findNewsletters,
  deleteNewsletter
} from '../../controllers/newsletter.js';
import { verifyToken } from '../../utils/jwtToken.js';
import checkPermission from '../../utils/auth.js';
import asyncHandler from '../../utils/asyncHandler.js';

const router = express.Router();

router.post('/newsletter', asyncHandler(submitNewsletter));
router.get('/filterednewsletters',verifyToken,checkPermission("contact", "view"), asyncHandler(findNewsletters));
router.delete('/deletenewsletter/:id',verifyToken,checkPermission("contact", "delete"), asyncHandler(deleteNewsletter));

export default router;
