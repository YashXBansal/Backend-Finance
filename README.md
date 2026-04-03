# 💰 Finance Management Backend API

A production-ready backend system for managing financial transactions, user roles, and analytics dashboards. Built with **Node.js, Express, TypeScript, and Prisma (SQLite)**.

---

## 🚀 Features Implemented

### 1. User and Role Management

* Created a user system with role-based access
* Supported roles: **ADMIN, ANALYST, VIEWER**
* Implemented:

  * User creation and authentication
  * Role assignment and updates
  * User status management (ACTIVE / INACTIVE)
* Enforced access restrictions based on roles using middleware

---

### 2. Financial Records CRUD

* Implemented full lifecycle for financial transactions:

  * Create transactions
  * Read transactions
  * Update transactions
  * Soft delete transactions
* Each record includes:

  * Amount
  * Type (INCOME / EXPENSE)
  * Category
  * Date
  * Description

---

### 3. Record Filtering

* Enabled filtering of financial records based on:

  * Transaction type
  * Category
  * Date range
* Added pagination support for efficient data retrieval
* Implemented search functionality across transactions

---

### 4. Dashboard Summary APIs

* Built APIs to provide aggregated financial insights:

  * Total income
  * Total expenses
  * Net balance
  * Category-wise breakdown
  * Monthly trends
  * Recent activity
* Designed for efficient dashboard consumption

---

### 5. Role Based Access Control

* Implemented RBAC using middleware
* Defined clear role hierarchy:

  * **ADMIN → full access**
  * **ANALYST → read + analytics**
  * **VIEWER → read-only**
* Restricted endpoints based on role permissions

---

### 6. Input Validation and Error Handling

* Used **Zod** for request validation
* Implemented centralized error handling
* Returned consistent API responses using custom wrappers
* Used proper HTTP status codes

---

### 7. Data Persistence (Database)

* Used **Prisma ORM with SQLite**
* Designed relational schema:

  * User ↔ Transactions
* Managed schema migrations
* Seeded database with initial data for testing


---

## 🏗️ Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM (SQLite)
- JWT Authentication
- Zod (validation)
- Express Rate Limit

---

## 📂 Project Structure

```
src/
 ├── config/         # Prisma setup
 ├── middlewares/    # Auth, validation, error handling
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── transactions/
 │    ├── dashboard/
 ├── utils/          # ApiResponse, ApiError, asyncHandler
 ├── server.ts       # Express app
 ├── index.ts        # Entry point

prisma/
 ├── schema.prisma
 ├── seed.ts
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone <your-repo-url>
cd finance-backend
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Setup Environment

Create `.env` file:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret"
```

---

### 4️⃣ Run Prisma

```
npx prisma generate
npx prisma migrate dev
```

---

### 5️⃣ Seed Database

```
npx tsx prisma/seed.ts
```

---

### 6️⃣ Run Server

```
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## 🔑 Test Credentials

| Role    | Email                                             | Password    |
| ------- | ------------------------------------------------- | ----------- |
| ADMIN   | [admin@finance.com](mailto:admin@finance.com)     | password123 |
| ANALYST | [analyst@finance.com](mailto:analyst@finance.com) | password123 |
| VIEWER  | [viewer@finance.com](mailto:viewer@finance.com)   | password123 |

---

## 📡 API Endpoints

---

### 🔐 Auth

#### Login

```
POST /api/v1/auth/login
```

---

### 👤 Users (Admin only)

#### Get all users

```
GET /api/v1/users
```

#### Update role

```
PATCH /api/v1/users/:id/role
```

#### Update status

```
PATCH /api/v1/users/:id/status
```

---

### 💳 Transactions

#### Get all (with filters & pagination)

```
GET /api/v1/transactions
```

Query params:

- `page`
- `limit`
- `type`
- `category`
- `startDate`
- `endDate`
- `search`

---

#### Create transaction

```
POST /api/v1/transactions
```

---

#### Update transaction

```
PATCH /api/v1/transactions/:id
```

---

#### Delete transaction

```
DELETE /api/v1/transactions/:id
```

---

### 📊 Dashboard

#### Summary

```
GET /api/v1/dashboard/summary
```

#### Analytics (ANALYST+)

```
GET /api/v1/dashboard/analytics
```

#### Recent Activity

```
GET /api/v1/dashboard/recent
```

---

## 🔐 Role-Based Access Control

| Role    | Permissions      |
| ------- | ---------------- |
| ADMIN   | Full access      |
| ANALYST | Read + analytics |
| VIEWER  | Read only        |

---

## 🧠 Design Decisions

- **Service-based architecture** for separation of concerns
- **Soft delete** used for financial data integrity
- **Pagination** implemented for scalability
- **RBAC hierarchy** ensures secure access
- **Prisma ORM** chosen for type safety and developer experience
- **SQLite** used for simplicity and quick setup

---

## ⚠️ Assumptions

- Single-tenant system (no multi-organization support)
- JWT-based stateless authentication
- No external payment integrations
- SQLite used for development/demo (can be swapped with PostgreSQL)

---

## 🚀 Future Improvements

- Unit & integration testing
- Advanced search (case-insensitive, full-text)
- Export reports (CSV/PDF)
- Caching (Redis)
- Docker deployment

---

## 🧾 Submission Notes

This project demonstrates:

- Backend architecture design
- API design & validation
- Role-based security
- Database modeling
- Real-world financial logic

---

## 👨‍💻 Author

Yash Bansal
