import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum([
    "SALARY",
    "FREELANCE",
    "RENT",
    "FOOD",
    "UTILITIES",
    "TRANSPORT",
    "HEALTHCARE",
    "ENTERTAINMENT",
    "OTHER",
  ]),
  date: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  description: z.string().max(500).optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const filterSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().transform(Number).default(1),
  limit: z.string().transform(Number).default(20),
});
