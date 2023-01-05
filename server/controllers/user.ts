import { Response, NextFunction } from "express";
import { AuthorizedRequest } from "../helpers/types";
import db from "../models/index";

export async function getCurrentUser(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userid = req.user?.id;
        // get the user and turn it into object
        const user = (await db.models.User.findByPk(userid))?.dataValues;

        delete user.password;
        delete user.googleid;
        delete user.isAdmin;

        return res.json(user);
    } catch (err) {
        next(err);
    }
}
