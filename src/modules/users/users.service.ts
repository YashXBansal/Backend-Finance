import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { Role, UserStatus } from "../../../generated/prisma/client.js";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserRole = async (id: number, role: Role) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

export const updateUserStatus = async (id: number, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
};
