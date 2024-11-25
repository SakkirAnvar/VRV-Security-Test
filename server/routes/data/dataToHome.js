import express from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import {
     addAboutUs, addcards1, addcards2, addCarousel, deleteAboutUs,
     deletecards1, deletecards2, deleteCarousel, editAboutUS,
     editcards1, editcards2, editCarousel, getAboutUs, getAllCarousels, getcards1,
     getcards2,
     getFilteredAboutUs,
     getFilteredcards1,
     getfilteredcards2,
     getFilteredCarousels,
     getSingleTestimonial
} from '../../controllers/mediaDatas.js';
import { verifyToken } from '../../utils/jwtToken.js';
import checkPermission from '../../utils/auth.js';

const router = express.Router();

//carousel
router.post('/addcarousel', verifyToken, checkPermission("banner", "create"), asyncHandler(addCarousel))
router.get('/getfilteredcarousel',verifyToken, checkPermission("banner", "view"), asyncHandler(getFilteredCarousels))
router.put('/editcarousel/:id', verifyToken, checkPermission("banner", "edit"), asyncHandler(editCarousel))
router.delete('/deletecarousel/:id', verifyToken, checkPermission("banner", "delete"), asyncHandler(deleteCarousel))

//about us
router.post('/addaboutus',verifyToken, checkPermission("aboutPage", "create"), asyncHandler(addAboutUs))
router.get('/getfilteredaboutus',verifyToken, checkPermission("aboutPage", "view"), asyncHandler(getFilteredAboutUs))
router.put('/editaboutus/:id', verifyToken, checkPermission("aboutPage", "edit"), asyncHandler(editAboutUS))
router.delete('/deleteaboutus/:id', verifyToken, checkPermission("aboutPage", "delete"), asyncHandler(deleteAboutUs))

//cards 1
router.post('/addcards1', verifyToken, checkPermission("bookingCards", "create"), asyncHandler(addcards1))
router.get('/getfilteredcards1',verifyToken, checkPermission("bookingCards", "view"), asyncHandler(getFilteredcards1))
router.put('/editcards1/:id', verifyToken, checkPermission("bookingCards", "edit"), asyncHandler(editcards1))
router.delete('/deletecards1/:id', verifyToken, checkPermission("bookingCards", "delete"), asyncHandler(deletecards1))

//cards 2 or testimonials
router.post('/addcards2', verifyToken, checkPermission("testimonials", "create"), asyncHandler(addcards2))
router.get('/getfilteredcards2',verifyToken, checkPermission("testimonials", "view"), asyncHandler(getfilteredcards2))
router.put('/editcards2/:id', verifyToken, checkPermission("testimonials", "edit"), asyncHandler(editcards2))
router.delete('/deletecards2/:id', verifyToken, checkPermission("testimonials", "delete"), asyncHandler(deletecards2))
router.get('/getsingletestimonial/:id',verifyToken, checkPermission("testimonials", "view"), asyncHandler(getSingleTestimonial))



//api to website
router.get('/getallcarousel', asyncHandler(getAllCarousels))
router.get('/getaboutusdata', asyncHandler(getAboutUs))
router.get('/getcards1', asyncHandler(getcards1))
router.get('/getcards2', asyncHandler(getcards2))





export default router


