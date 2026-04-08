import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { orderControllers } from "./order.controller";
import { createOrderZodSchema } from "./order.validation";

const router = express.Router();

router.get("/", orderControllers.getAllOrder);

router.get("/my-order/:id", orderControllers.getMyOrders);

router.get("/:id", orderControllers.getSingleOrder);

router.post(
  "/create-order",
  validateRequest(createOrderZodSchema),
  orderControllers.createOrder
);

router.patch('/:id', orderControllers.updateStats);
router.patch('/update/track-code/:id', orderControllers.updatetrackingLink);

router.patch('/cancel/:id', orderControllers.cancelOrder);
router.delete('/:id', orderControllers.deleteOrder);

export const OrderRoutes = router;
