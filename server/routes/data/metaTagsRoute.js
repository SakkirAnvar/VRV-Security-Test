import express from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import { addMetaTags, deleteMetaTag, editMetaTags, getAllMetaTags, getSingleMetaTags, getSingleMetaTagsByTitle } from '../../controllers/metaTagsController.js';
import { verifyToken } from '../../utils/jwtToken.js';
import checkPermission from '../../utils/auth.js';


const router = express.Router();

router.post('/addmetatags',verifyToken,checkPermission("metaTagsAccess","create"),asyncHandler(addMetaTags))
router.put('/editmetatags/:id',verifyToken,checkPermission("metaTagsAccess","edit"),asyncHandler(editMetaTags))
router.get('/getallmetatags',verifyToken,checkPermission("metaTagsAccess","view"),asyncHandler(getAllMetaTags))
router.get('/getsinglemetatag/:id',verifyToken,checkPermission("metaTagsAccess","view"),asyncHandler(getSingleMetaTags))
router.get('/getsinglemetatagsbytitle/:title',asyncHandler(getSingleMetaTagsByTitle))
router.delete('/deletemetatag/:id',verifyToken,checkPermission("metaTagsAccess","delete"),asyncHandler(deleteMetaTag))


export default router