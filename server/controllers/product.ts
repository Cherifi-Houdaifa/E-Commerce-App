import { Response, NextFunction } from "express";
import { AuthorizedRequest } from "../helpers/types";
import db from "../models/index";

export async function getBasket(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userid = req.user?.id;
        const user = await db.models.User.findByPk(userid, {
            include: {
                model: db.models.Product,
                as: "products",
            },
        });

        return res.status(200).json(user?.products);
    } catch (err) {
        next(err);
    }
}
export async function addToBasket(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userid = req.user?.id;
        const { productid } = req.query;
        const user = await db.models.User.findByPk(userid);
        const product = await db.models.Product.findByPk(
            typeof productid === "string" ? productid : ""
        );
        user?.addProduct(product);

        return res
            .status(200)
            .json({ message: "You have added a product ot your basket" });
    } catch (err) {
        next(err);
    }
}
export async function deleteBasket(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userid = req.user?.id;
        const user = await db.models.User.findByPk(userid);
        user?.setProducts([]);
        return res
            .status(200)
            .json({ message: "You have deleted every item of your basket" });
    } catch (err) {
        next(err);
    }
}
export async function getProductById(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { productid } = req.params;
        const product = await db.models.Product.findByPk(productid);
		return res.status(200).json(product);
    } catch (err) {
        next(err);
    }
}
export function getProductsByCategory(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {}
export function searchProductsByName(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {}
