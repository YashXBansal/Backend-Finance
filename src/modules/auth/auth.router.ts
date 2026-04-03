import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate, AuthRequest } from "../../middlewares/authenticate.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);
    res
      .status(201)
      .json(new ApiResponse(result, "User registered successfully"));
  }),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.loginUser(req.body);
    res.status(200).json(new ApiResponse(result, "Login successful"));
  }),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    res.status(200).json(new ApiResponse(req.user, "Current user"));
  }),
);

export default router;
