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

// update a product
router.put("/:productid", updateProduct);

// delete a product
router.delete("/:productid", deleteProduct);

export default router;
