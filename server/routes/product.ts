import express from "express";
const router = express.Router();

import {
    getBasket,
    addToBasket,
    deleteBasket,
    getProductsByCategory,
    searchProductsByName,
    getProductById,
} from "../controllers/product";

// get current user basket
router.get("/", getBasket);

// add item to current user basket
router.post("/", addToBasket);

// delete current user items from basket (Like checkout)
router.delete("/", deleteBasket);

// get products on category with category query parameter
router.get("/category", getProductsByCategory);

// search products by name with name query parameter
router.get("/search", searchProductsByName);

// get product by id
router.get("/:productid", getProductById);

export default router;
