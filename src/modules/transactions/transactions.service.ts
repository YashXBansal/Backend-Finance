import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

// export const getTransactions = async (filters: any) => {
//   const { type, category, startDate, endDate, page = 1, limit = 20 } = filters;

//   const where: any = { isDeleted: false };

//   if (type) where.type = type;
//   if (category) where.category = category;
//   if (startDate || endDate) {
//     where.date = {};
//     if (startDate) where.date.gte = new Date(startDate);
//     if (endDate) where.date.lte = new Date(endDate);
//   }

//   const skip = (page - 1) * limit;

//   const [transactions, total] = await Promise.all([
//     prisma.transaction.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: { date: "desc" },
//       include: {
//         user: { select: { name: true, email: true } },
//       },
//     }),
//     prisma.transaction.count({ where }),
//   ]);

//   return {
//     transactions,
//     pagination: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// };

export const getTransactions = async (filters: any) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = "1",
    limit = "20",
    search,
  } = filters;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const where: any = { isDeleted: false };

  if (type) where.type = type;
  if (category) where.category = category;
  if (search) {
    const normalizedSearch = search.toUpperCase();

    where.OR = [
      {
        description: {
          contains: search,
        },
      },
      {
        category: normalizedSearch,
      },
    ];
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const skip = (pageNumber - 1) * limitNumber;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { date: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const getTransactionById = async (id: number) => {
  const tx = await prisma.transaction.findFirst({
    where: { id, isDeleted: false },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!tx) throw ApiError.notFound("Transaction not found");
  return tx;
};

export const createTransaction = async (data: any, userId: number) => {
  return prisma.transaction.create({
    data: { ...data, date: new Date(data.date), createdBy: userId },
  });
};

export const updateTransaction = async (id: number, data: any) => {
  const tx = await prisma.transaction.findFirst({
    where: { id, isDeleted: false },
  });

  if (!tx) throw ApiError.notFound("Transaction not found");

  return prisma.transaction.update({
    where: { id },
    data: { ...data, ...(data.date && { date: new Date(data.date) }) },
  });
};

export const deleteTransaction = async (id: number) => {
  const tx = await prisma.transaction.findFirst({
    where: { id, isDeleted: false },
  });

  if (!tx) throw ApiError.notFound("Transaction not found");

  // Soft delete — never hard delete financial records
  return prisma.transaction.update({
    where: { id },
    data: { isDeleted: true },
  });
};
