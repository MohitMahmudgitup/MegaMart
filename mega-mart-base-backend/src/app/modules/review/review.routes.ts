import express from "express";
import { createReviewDto } from "./review.controller";

const router = express.Router();

router.post("/", createReviewDto);

// later you can add:
// router.get("/:productId", getReviewsByProduct);

export const ReviewRoutes = router;
