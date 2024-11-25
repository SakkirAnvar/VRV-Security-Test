import express from "express";
import { addNewFaq, deleteFaqContent, editFaqContent, getAllFaqs, getFaqById, getFilteredFaq } from "../../controllers/faqController.js";
import { verifyToken } from '../../utils/jwtToken.js';
import checkPermission from "../../utils/auth.js";


const router = express.Router();


router.post("/addnewfaq",verifyToken,checkPermission("faqs","create"),addNewFaq);
router.put('/editfaqcontent/:id',verifyToken,checkPermission("faqs","edit"),editFaqContent);
router.delete("/deletefaqcontent/:id",verifyToken,checkPermission("faqs","delete"),deleteFaqContent);
router.get("/getfilteredfaqs",verifyToken,checkPermission("faqs","view"),getFilteredFaq)
router.get('/getfaq/:id',verifyToken,checkPermission("faqs","view"),getFaqById)

router.get('/getallfaqs', (getAllFaqs))


export default router;
