import { Response, NextFunction } from "express";
import { Role } from "../../generated/prisma/client.js";
import { AuthRequest } from "./authenticate.js";
import { ApiError } from "../utils/ApiError.js";

const ROLE_LEVEL: Record<Role, number> = {
  VIEWER: 1,
  ANALYST: 2,
  ADMIN: 3,
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw ApiError.unauthorized();
    }

    const userLevel = ROLE_LEVEL[userRole];
    const requiredLevel = Math.min(...allowedRoles.map((r) => ROLE_LEVEL[r]));

    if (userLevel < requiredLevel) {
      throw ApiError.forbidden(
        `This action requires ${allowedRoles.join(" or ")} role`,
      );
    }

    next();
  };
};
