import express from "express";
import productController from "../controllers/product.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", productController.getProducts);
router.get("/:productId", productController.getProduct);
router.get("/search/:query", productController.search);


export default router;