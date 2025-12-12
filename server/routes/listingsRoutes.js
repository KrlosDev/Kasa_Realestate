import express from "express";
import { getLicenseTypes, getRoles } from "../controllers/listings.controller.js";

const router = express.Router();

router.get("/license-types", getLicenseTypes);
router.get("/roles", getRoles);

export default router;