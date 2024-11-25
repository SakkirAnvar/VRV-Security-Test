import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import {
    deleteSubUser, editSubUser, getAllSubUsers, loginUser,
    signupUser, updatePassword, getUserStatus,
    checkAndUnblockUser,
    getFilteredSubUsers
} from "../../controllers/userController.js";
import { verifyToken } from "../../utils/jwtToken.js";
import checkPermission from "../../utils/auth.js";

const router = express.Router();

router.post("/adduser", asyncHandler(signupUser));
router.post("/loginuser", asyncHandler(loginUser));
router.get("/getsubusers",verifyToken, checkPermission("subUser", "view"), asyncHandler(getAllSubUsers));
router.get("/filteredsubusers",verifyToken, checkPermission("subUser", "view"),asyncHandler(getFilteredSubUsers))
router.put("/editsubuser/:id", verifyToken, checkPermission("subUser", "edit"), asyncHandler(editSubUser))
router.delete("/deletesubuser/:id", verifyToken, checkPermission("subUser", "delete"), asyncHandler(deleteSubUser))
router.patch("/change-password", verifyToken, asyncHandler(updatePassword))
router.get("/status/:id", asyncHandler(getUserStatus));
router.patch("/isblocked/:id",verifyToken, asyncHandler(checkAndUnblockUser))

export default router;
