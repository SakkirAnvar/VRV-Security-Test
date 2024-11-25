import express from 'express';
import { addNewDestination, deleteDestinationById, editDestination, getAllDestination, getFilteredDestination } from '../../controllers/destinationController.js';
import asyncHandler from '../../utils/asyncHandler.js';
import checkPermission from '../../utils/auth.js';
import { verifyToken } from '../../utils/jwtToken.js';

const router = express.Router();


router.post('/adddestination',verifyToken, checkPermission("destination", "create"),asyncHandler(addNewDestination))
router.get('/getfiltereddestination',verifyToken, checkPermission("destination", "view"),asyncHandler(getFilteredDestination))
router.delete('/deletedestination/:id',verifyToken, checkPermission("destination", "delete"),asyncHandler(deleteDestinationById))
router.put('/editdestination/:id',verifyToken, checkPermission("destination", "edit"),asyncHandler(editDestination))

//api to wesite
router.get('/getalldestination',asyncHandler(getAllDestination))



export default router