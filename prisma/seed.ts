import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  PrismaClient,
  Role,
  TransactionType,
  Category,
} from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
async function main() {
  console.log("Seeding database...");

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@finance.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@finance.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@finance.com" },
    update: {},
    create: {
      name: "Analyst User",
      email: "analyst@finance.com",
      password: hashedPassword,
      role: Role.ANALYST,
    },
  });

  await prisma.user.upsert({
    where: { email: "viewer@finance.com" },
    update: {},
    create: {
      name: "Viewer User",
      email: "viewer@finance.com",
      password: hashedPassword,
      role: Role.VIEWER,
    },
  });

  // Create transactions across last 6 months
  const categories = Object.values(Category);
  const txData = [];

  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180));
    const isIncome = Math.random() > 0.4;

    txData.push({
      amount: Math.floor(Math.random() * 50000) + 1000,
      type: isIncome ? TransactionType.INCOME : TransactionType.EXPENSE,
      category: categories[Math.floor(Math.random() * categories.length)],
      date,
      description: `Auto-generated transaction ${i + 1}`,
      createdBy: Math.random() > 0.5 ? admin.id : analyst.id,
    });
  }

  await prisma.transaction.createMany({ data: txData });

  console.log("\n✅ Seeding complete!");
  console.log("----------------------------");
  console.log("Test credentials (password: password123)");
  console.log("  ADMIN:   admin@finance.com");
  console.log("  ANALYST: analyst@finance.com");
  console.log("  VIEWER:  viewer@finance.com");
  console.log("----------------------------");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
