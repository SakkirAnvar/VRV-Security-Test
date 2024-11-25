import express from 'express';
import { addBlog, deleteblog, editBlog, getAllBlogs, getAllFilterBlogs, getBlogById, getBlogBySlug } from '../../controllers/blogsController.js';
import { verifyToken } from '../../utils/jwtToken.js';
import checkPermission from '../../utils/auth.js';
import asyncHandler from '../../utils/asyncHandler.js';


const router =express.Router();

router.post('/addnewblog',verifyToken,checkPermission("blogs","create"),asyncHandler(addBlog))
router.get('/getfilterblogs',verifyToken,checkPermission("blogs","view"),asyncHandler(getAllFilterBlogs))
router.put('/editblog/:id',verifyToken,checkPermission("blogs","edit"),asyncHandler(editBlog))
router.delete('/deleteblog/:id',verifyToken,checkPermission("blogs","delete"),asyncHandler(deleteblog))
router.get('/getsingleblog/:id',verifyToken,checkPermission("blogs","view"),asyncHandler(getBlogById))

// api to website
router.get('/getallblogs',asyncHandler(getAllBlogs))
router.get('/getblog/:id',asyncHandler(getBlogBySlug))


export default router
