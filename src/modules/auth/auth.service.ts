import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { RegisterInput, LoginInput } from "./auth.schema.js";

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) throw ApiError.badRequest("Email already in use");

  const hashed = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: { ...input, password: hashed },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  const token = generateToken(user);
  return { user, token };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (user.status === "INACTIVE") {
    throw ApiError.forbidden("Account is deactivated");
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

const generateToken = (user: { id: number; email: string; role: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
};
