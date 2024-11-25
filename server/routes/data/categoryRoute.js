import express from 'express';
import { addNewCategory, deleteCategoryById, editCategory, getAllCategory, getFilteredCategory } from '../../controllers/categoryController.js';
import asyncHandler from '../../utils/asyncHandler.js';
import checkPermission from '../../utils/auth.js';
import { verifyToken } from '../../utils/jwtToken.js';

const router = express.Router();


router.post('/addcategory',verifyToken, checkPermission("category", "create"),asyncHandler(addNewCategory))
router.get('/getallcategory',verifyToken, checkPermission("category", "view"),asyncHandler(getAllCategory))
router.get('/getfilteredcategory',verifyToken, checkPermission("category", "view"),asyncHandler(getFilteredCategory))
router.delete('/deletecategory/:id',verifyToken, checkPermission("category", "delete"),asyncHandler(deleteCategoryById))
router.put('/editcategory/:id',verifyToken, checkPermission("category", "edit"),asyncHandler(editCategory))



export default router