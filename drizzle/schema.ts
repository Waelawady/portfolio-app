import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table - stores uploaded project data and metadata
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectName: varchar("projectName", { length: 255 }).notNull(),
  projectCode: varchar("projectCode", { length: 100 }),
  clientName: varchar("clientName", { length: 255 }),
  projectManager: varchar("projectManager", { length: 255 }),
  
  // Dashboard data
  contractValue: int("contractValue").notNull(),
  baselineBudget: int("baselineBudget").notNull(),
  baselineGPM: int("baselineGPM").notNull(), // stored as percentage * 100 (e.g., 31.00% = 3100)
  workingBudget: int("workingBudget").notNull(),
  currentGPM: int("currentGPM").notNull(),
  actualCosts: int("actualCosts").notNull(),
  projectProgress: int("projectProgress").notNull(), // percentage * 100
  
  // File references
  dashboardFileKey: varchar("dashboardFileKey", { length: 500 }),
  dashboardFileUrl: text("dashboardFileUrl"),
  databaseFileKey: varchar("databaseFileKey", { length: 500 }),
  databaseFileUrl: text("databaseFileUrl"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Cost breakdown table - detailed cost categories from database file
 */
export const costBreakdowns = mysqlTable("costBreakdowns", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: int("amount").notNull(),
  isPaid: int("isPaid").notNull().default(1), // 1 = paid, 0 = pending
  paymentDate: timestamp("paymentDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CostBreakdown = typeof costBreakdowns.$inferSelect;
export type InsertCostBreakdown = typeof costBreakdowns.$inferInsert;

/**
 * Hours data table - monthly hours consumption
 */
export const hoursData = mysqlTable("hoursData", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  month: varchar("month", { length: 20 }).notNull(), // format: YYYY-MM
  hours: int("hours").notNull(), // stored as hours * 100 for precision
  isForecast: int("isForecast").notNull().default(0), // 0 = actual, 1 = forecast
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HoursData = typeof hoursData.$inferSelect;
export type InsertHoursData = typeof hoursData.$inferInsert;

/**
 * Invoices table - client invoices (past and future)
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull(),
  amount: int("amount").notNull(),
  submissionDate: timestamp("submissionDate"),
  status: mysqlEnum("status", ["paid", "unpaid", "submitted", "to_submit"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Future expenses table - subconsultants, missions, etc.
 */
export const futureExpenses = mysqlTable("futureExpenses", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  expenseType: varchar("expenseType", { length: 100 }).notNull(), // mission, subconsultant, other
  amount: int("amount").notNull(),
  paymentDate: timestamp("paymentDate"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FutureExpense = typeof futureExpenses.$inferSelect;
export type InsertFutureExpense = typeof futureExpenses.$inferInsert;

/**
 * Generated portfolios table - stores generated presentation metadata
 */
export const portfolios = mysqlTable("portfolios", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  portfolioFileKey: varchar("portfolioFileKey", { length: 500 }),
  portfolioFileUrl: text("portfolioFileUrl"),
  format: mysqlEnum("format", ["html", "pptx", "pdf"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = typeof portfolios.$inferInsert;