import { prisma } from "../../config/prisma.js";

export const getSummary = async () => {
  const transactions = await prisma.transaction.findMany({
    where: { isDeleted: false },
    select: { amount: true, type: true },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  };
};

export const getCategoryBreakdown = async () => {
  const results = await prisma.transaction.groupBy({
    by: ["category", "type"],
    where: { isDeleted: false },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
  });

  return results.map((r) => ({
    category: r.category,
    type: r.type,
    total: r._sum.amount ?? 0,
    count: r._count,
  }));
};

export const getMonthlyTrends = async (months = 6) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const transactions = await prisma.transaction.findMany({
    where: { isDeleted: false, date: { gte: since } },
    select: { amount: true, type: true, date: true },
    orderBy: { date: "asc" },
  });

  // Group by year-month
  const grouped: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((t) => {
    const key = t.date.toISOString().slice(0, 7); // "2025-10"
    if (!grouped[key]) grouped[key] = { income: 0, expenses: 0 };

    if (t.type === "INCOME") grouped[key].income += t.amount;
    else grouped[key].expenses += t.amount;
  });

  return Object.entries(grouped).map(([month, data]) => ({
    month,
    ...data,
    net: data.income - data.expenses,
  }));
};

export const getRecentActivity = async (limit = 10) => {
  return prisma.transaction.findMany({
    where: { isDeleted: false },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
};
