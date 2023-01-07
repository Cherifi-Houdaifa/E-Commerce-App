import { Response, NextFunction } from "express";
import { AuthorizedRequest } from "../helpers/types";
import db from "../models/index";
import { Op } from "sequelize";
import { getImgMime } from "../helpers/helper";

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
        const data = user?.products && user?.products.map((product) => {
            const newProduct = product.dataValues;
            const base64Picture = product?.picture.toString("base64");
            newProduct.picture = `data:${getImgMime(
                base64Picture === undefined ? "" : base64Picture
            )};base64,${base64Picture}`;
            return newProduct;
        });
        return res.status(200).json(data);
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
        const data = product?.dataValues;
        const base64Picture = product?.picture.toString("base64");
        data.picture = `data:${getImgMime(
            base64Picture === undefined ? "" : base64Picture
        )};base64,${base64Picture}`;
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        next(err);
    }
}
export async function getProductsByCategory(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { category } = req.query;
        // checking if the category exists and is one of these values
        if (
            !category ||
            !["Tech", "Food", "Fashion", "Fitness", "Other"].includes(
                category.toString()
            )
        ) {
            return res.status(400).json({
                message:
                    'Category must be: "Tech", "Food", "Fashion", "Fitness" or "Other"',
            });
        }
        const products = await db.models.Product.findAll({
            where: {
                category: category,
            },
        });
        const data = products.map((product) => {
            const newProduct = product.dataValues;
            const base64Picture = product?.picture.toString("base64");
            newProduct.picture = `data:${getImgMime(
                base64Picture === undefined ? "" : base64Picture
            )};base64,${base64Picture}`;
            return newProduct;
        });
        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}
export async function searchProductsByName(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { search } = req.query;
        if (search === undefined || search === "") {
            return res
                .status(200)
                .json({ message: "You must include a search query" });
        }
        const products = await db.models.Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${search}%`,
                },
            },
        });
        const data = products.map((product) => {
            const newProduct = product.dataValues;
            const base64Picture = product?.picture.toString("base64");
            newProduct.picture = `data:${getImgMime(
                base64Picture === undefined ? "" : base64Picture
            )};base64,${base64Picture}`;
            return newProduct;
        });
        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}
