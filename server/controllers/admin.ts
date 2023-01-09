import { Response, NextFunction } from "express";
import { AuthorizedRequest } from "../helpers/types";
import db from "../models/index";
import { body, validationResult } from "express-validator";
import mutler from "multer";
const upload = mutler();

export async function getProducts(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const isAdmin = req.user?.isAdmin;
        if (!isAdmin) {
            return res.status(401).json({ message: "You are not admin" });
        }

        const skip =
            req.query.skip !== undefined ? Number(req.query.skip) : undefined;
        const products = await db.models.Product.findAll({
            limit: 10,
            offset: skip,
            order: [["createdAt", "DESC"]],
        });
        res.json(products);
    } catch (err) {
        next(err);
    }
}
export const createProduct = [
    upload.single("picture"),
    body("name").exists().notEmpty(),
    body("price").exists().notEmpty().isNumeric(),
    body("description").exists().notEmpty(),
    body("availability").exists().notEmpty().isIn(["Available", "Unavailable"]),
    body("category")
        .exists()
        .notEmpty()
        .isIn(["Tech", "Food", "Fashion", "Fitness", "Other"]),
    async function createProduct(
        req: AuthorizedRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const isAdmin = req.user?.isAdmin;
            if (!isAdmin) {
                return res.status(401).json({ message: "You are not admin" });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const picture = req.file;
            const { name, price, description, availability, category } =
                req.body;
            // check if picture is included
            if (picture === undefined) {
                return res
                    .status(400)
                    .json({ message: "You must provide a picture" });
            }
            // check image file extension
            const mimetypes = ["image/jpeg", "image/png", "image/gif"];
            if (!mimetypes.includes(picture.mimetype)) {
                return res.json({
                    message: `Unsupported file extension: ${picture.mimetype}`,
                });
            }
            if (picture.size > 5 * 1024 * 1024) {
                return res
                    .status(400)
                    .json({ message: "Picture size too big" });
            }
            const product = await db.models.Product.create({
                name,
                price,
                description,
                picture: picture.buffer,
                availability,
                category,
            });
            return res.json({ message: "You have created the product" });
        } catch (err) {
            next(err);
        }
    },
];
export const updateProduct = [
    upload.single("picture"),
    body("name").exists().notEmpty(),
    body("price").exists().notEmpty().isNumeric(),
    body("description").exists().notEmpty(),
    body("availability").exists().notEmpty().isIn(["Available", "Unavailable"]),
    body("category")
        .exists()
        .notEmpty()
        .isIn(["Tech", "Food", "Fashion", "Fitness", "Other"]),
    async function updateProduct(
        req: AuthorizedRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const isAdmin = req.user?.isAdmin;
            if (!isAdmin) {
                return res.status(401).json({ message: "You are not admin" });
            }

            const { productid } = req.query;
            if (productid === undefined) {
                return res.status(400).json({
                    message: "You must add a productid query parameter",
                });
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const picture = req.file;
            const { name, price, description, availability, category } =
                req.body;
            // check if picture is included
            if (picture !== undefined) {
                // check image file extension
                const mimetypes = ["image/jpeg", "image/png", "image/gif"];
                if (!mimetypes.includes(picture.mimetype)) {
                    return res.status(400).json({
                        message: `Unsupported file extension: ${picture.mimetype}`,
                    });
                }
                if (picture.size > 5 * 1024 * 1024) {
                    return res
                        .status(400)
                        .json({ message: "Picture size too big" });
                }
            }
            const affectedProducts = await db.models.Product.update(
                {
                    name,
                    price,
                    description,
                    picture,
                    availability,
                    category,
                },
                {
                    where: {
                        id: productid,
                    },
                }
            );
            return res.status(200).json({
                message: `You have updated the product with the id of ${productid}`,
            });
        } catch (err) {
            next(err);
        }
    },
];
export async function deleteProduct(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const isAdmin = req.user?.isAdmin;
        if (!isAdmin) {
            return res.status(401).json({ message: "You are not admin" });
        }

        const { productid } = req.query;
        if (productid === undefined) {
            return res.status(400).json({
                message: "You must add a productid query parameter",
            });
        }
        const product = await db.models.Product.destroy({
            where: {
                id: productid,
            },
        });
        return res.status(200).json({
            message: `You have delete the with the id of ${productid}`,
        });
    } catch (err) {
        next(err);
    }
}
