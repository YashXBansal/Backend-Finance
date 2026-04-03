import { Router } from "express";
import { Role } from "../../../generated/prisma/client.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import { updateRoleSchema, updateStatusSchema } from "./users.schema.js";

import * as userService from "./users.service.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /users → ADMIN only
router.get(
  "/",
  authorize(Role.ADMIN),
  asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(new ApiResponse(users, "Users fetched successfully"));
  }),
);

// PATCH /users/:id/role → ADMIN only
router.patch(
  "/:id/role",
  authorize(Role.ADMIN),
  validate(updateRoleSchema),
  asyncHandler(async (req, res) => {
    const updated = await userService.updateUserRole(
      Number(req.params.id),
      req.body.role,
    );

    res.json(new ApiResponse(updated, "User role updated"));
  }),
);

// PATCH /users/:id/status → ADMIN only
router.patch(
  "/:id/status",
  authorize(Role.ADMIN),
  validate(updateStatusSchema),
  asyncHandler(async (req, res) => {
    const updated = await userService.updateUserStatus(
      Number(req.params.id),
      req.body.status,
    );

    res.json(new ApiResponse(updated, "User status updated"));
  }),
);

export default router;
