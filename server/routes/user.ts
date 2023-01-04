import express from "express";
const router = express.Router();

import { getCurrentUser } from "../controllers/user";

// get current user information
router.get("/", getCurrentUser);

export default router;
