import express from "express";
import {
  addSinglePackage,
  deletePackageById,
  editSinglePackage,
  getAllPackages,
  getFilteredPackages,
  getPackagesByCatagory,
  getPackagesByid,
  getPackagesBySlug
} from "../../controllers/packagesController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { verifyToken } from "../../utils/jwtToken.js";
import checkPermission from "../../utils/auth.js";

const router = express.Router();

router.post("/addnewpackage", verifyToken, checkPermission("packagesCards", "create"), asyncHandler(addSinglePackage));
router.get("/getpackagesbycategory/:category", asyncHandler(getPackagesByCatagory));
router.get("/getsinglepackage/:id",verifyToken,checkPermission("packagesCards", "view"), asyncHandler(getPackagesByid));
router.get("/getfilteredpackages", verifyToken, checkPermission("packagesCards", "view"), asyncHandler(getFilteredPackages));
router.delete("/deletepackagebyid/:id", verifyToken, checkPermission("packagesCards", "delete"), asyncHandler(deletePackageById));
router.put("/editsinglepackage/:id", verifyToken, checkPermission("packagesCards", "edit"), asyncHandler(editSinglePackage));

// api to website
router.get("/getallpackages", asyncHandler(getAllPackages));
router.get("/getpackage/:id", asyncHandler(getPackagesBySlug));
export default router;
