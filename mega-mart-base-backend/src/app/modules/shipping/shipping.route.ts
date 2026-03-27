import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { shippingControllers } from "./shipping.controller";
import { createShippingZodSchema, updteShippingZodSchema } from "./shipping.validations";

const router = express.Router();

router.get("/", shippingControllers.getAllShipping);

router.get("/:id", shippingControllers.getSingleShipping);

router.post(
  "/create-shipping",
  validateRequest(createShippingZodSchema),
  shippingControllers.createShipping
);

router.patch(
  "/update-shipping/:id",
  validateRequest(updteShippingZodSchema),
  shippingControllers.updateShipping
);


router.delete(
  '/delete-shipping/:id',

  shippingControllers.deleteShipping
);

router.get('/stats/all', shippingControllers.shippingStats)

export const ShippingRoutes = router;
