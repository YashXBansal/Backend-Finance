import { Router } from "express";
import { Role } from "../../../generated/prisma/client.js";
import { authenticate, AuthRequest } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "./transactions.schema.js";
import * as txService from "./transactions.service.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get(
  "/",
  authorize(Role.VIEWER), // VIEWER and above = everyone
  asyncHandler(async (req, res) => {
    const result = await txService.getTransactions(req.query);
    res.json(new ApiResponse(result));
  }),
);

router.get(
  "/:id",
  authorize(Role.VIEWER),
  asyncHandler(async (req, res) => {
    const tx = await txService.getTransactionById(Number(req.params.id));
    res.json(new ApiResponse(tx));
  }),
);

router.post(
  "/",
  authorize(Role.ADMIN),
  validate(createTransactionSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const tx = await txService.createTransaction(req.body, req.user!.id);
    res.status(201).json(new ApiResponse(tx, "Transaction created"));
  }),
);

router.patch(
  "/:id",
  authorize(Role.ADMIN),
  validate(updateTransactionSchema),
  asyncHandler(async (req, res) => {
    const tx = await txService.updateTransaction(
      Number(req.params.id),
      req.body,
    );
    res.json(new ApiResponse(tx, "Transaction updated"));
  }),
);

router.delete(
  "/:id",
  authorize(Role.ADMIN),
  asyncHandler(async (req, res) => {
    await txService.deleteTransaction(Number(req.params.id));
    res.json(new ApiResponse(null, "Transaction deleted"));
  }),
);

export default router;
