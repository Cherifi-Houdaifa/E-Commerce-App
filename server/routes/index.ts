import express from "express";
const router = express.Router();

import passport from "passport";

import userRouter from "./user";
import productRouter from "./product";
import adminRouter from "./admin";

// user routes
router.get(
    "/user",
    passport.authenticate("jwt", { session: false }),
    userRouter
);

// product routes
router.get(
    "/product",
    passport.authenticate("jwt", { session: false }),
    productRouter
);

// admin routes
router.get(
    "/admin",
    passport.authenticate("jwt", { session: false }),
    adminRouter
);

export default router;
