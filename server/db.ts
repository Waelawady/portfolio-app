import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  InsertProject, projects,
  InsertCostBreakdown, costBreakdowns,
  InsertHoursData, hoursData,
  InsertInvoice, invoices,
  InsertFutureExpense, futureExpenses
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Project operations
export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(projects).values(project);
  return result[0].insertId;
}

export async function getProjectById(projectId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return result[0] || null;
}

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projects).where(eq(projects.userId, userId));
}

// Cost breakdown operations
export async function saveCostBreakdowns(items: InsertCostBreakdown[]) {
  const db = await getDb();
  if (!db || items.length === 0) return;
  
  await db.insert(costBreakdowns).values(items);
}

export async function getProjectCosts(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(costBreakdowns).where(eq(costBreakdowns.projectId, projectId));
}

// Hours data operations
export async function saveHoursData(items: InsertHoursData[]) {
  const db = await getDb();
  if (!db || items.length === 0) return;
  
  await db.insert(hoursData).values(items);
}

export async function getProjectHours(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(hoursData).where(eq(hoursData.projectId, projectId));
}

// Invoice operations
export async function saveInvoices(items: InsertInvoice[]) {
  const db = await getDb();
  if (!db || items.length === 0) return;
  
  await db.insert(invoices).values(items);
}

export async function getProjectInvoices(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(invoices).where(eq(invoices.projectId, projectId));
}

// Future expenses operations
export async function saveFutureExpenses(items: InsertFutureExpense[]) {
  const db = await getDb();
  if (!db || items.length === 0) return;
  
  await db.insert(futureExpenses).values(items);
}

export async function getProjectExpenses(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(futureExpenses).where(eq(futureExpenses.projectId, projectId));
}
