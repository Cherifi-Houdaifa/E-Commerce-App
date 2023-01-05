import express from "express";
const router = express.Router();

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/admin";

// get all products 10 at a time with an optimal skip query parameter
router.get("/", getProducts);

// create a product
router.post("/", createProduct);

// update a product with productid query parameter
router.put("/", updateProduct);

// delete a product with productid query parameter
router.delete("/", deleteProduct);

export default router;
