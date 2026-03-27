import { WithdrawalControllers } from "./withdrawals.controller";
import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import { createWithdrawalZodSchema } from "./withdrawals.validations";

const router = express.Router();

router.post(
  "/",
  validateRequest(createWithdrawalZodSchema),
  WithdrawalControllers.createWithdrawal
);

router.get("/", WithdrawalControllers.getWithdrawals);
router.get("/:id", WithdrawalControllers.getSingleWithdrawal);
router.get('/vendor/:id', WithdrawalControllers.getVendorsWithdrawal);

router.patch(
  "/update/:id",
  validateRequest(createWithdrawalZodSchema.partial()),
  WithdrawalControllers.updateWithdrawal
);

router.patch("/:id", WithdrawalControllers.deleteWithdrawal);

export const WithdrawalRoutes = router;
