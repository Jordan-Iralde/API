import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  jsonb
} from "drizzle-orm/pg-core";

// USERS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userApps = pgTable("user_apps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  appId: integer("app_id").notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),

  theme: text("theme").default("light"),
  language: text("language").default("es"),

  shortcuts: jsonb("shortcuts").default({}),
  preferences: jsonb("preferences").default({}),

  twoFactorEnabled: boolean("two_factor_enabled").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),

  appId: integer("app_id").notNull(), // ← tu tenant

  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),

  status: text("status").default("pending"), // pending | sent | failed
  error: text("error"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});