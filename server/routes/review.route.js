import express from "express";
import reviewController from "../controllers/review.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", reviewController.getReviews);

export default router;
