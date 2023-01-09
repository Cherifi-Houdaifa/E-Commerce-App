import expess from "express";
const router = expess.Router();

import passport from "passport";
import jwt from "jsonwebtoken";

router.get(
    "/google",
    passport.authenticate("google", {
        session: false,
        scope: ["email", "profile"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    function (req, res, next) {
        const user: { id?: string; isAdmin?: boolean } | undefined = req.user;
        const body = { id: user?.id, isAdmin: user?.isAdmin };
        const token = jwt.sign(
            body,
            process.env.JWT_SECRET ? process.env.JWT_SECRET : "",
            {
                expiresIn: "1d",
            }
        );
        return res
            .cookie("jwt", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                path: "/",
                maxAge: 1000 * 3600 * 24,
            })
            .send("<script>window.close();</script>");
    }
);

router.post(
    "/admin",
    passport.authenticate("local", { session: false }),
    function (req, res, next) {
        const user: { id?: string; isAdmin?: boolean } | undefined = req.user;
        const body = { id: user?.id, isAdmin: user?.isAdmin };
        const token = jwt.sign(
            body,
            process.env.JWT_SECRET ? process.env.JWT_SECRET : "",
            {
                expiresIn: "1d",
            }
        );
        return res
            .cookie("admin", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                path: "/",
                maxAge: 1000 * 3600 * 24,
            })
            .json({ message: "You have logged in as admin successfully" });
    }
);

router.get("/logout", function (req, res, next) {
    res.clearCookie("jwt").clearCookie("admin").json({
        message: "You have logged out successfully",
    });
});

export default router;
