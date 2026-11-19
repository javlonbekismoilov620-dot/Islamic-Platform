import { bigserial, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name"),
  role: text("role").$type<Role>().notNull().default("user"),
  status: text("status").$type<"active" | "disabled">().notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  userAgent: text("user_agent"),
});

export const userData = pgTable("user_data", {
  userId: uuid("user_id").notNull(),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.key] })]);

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  sort: integer("sort").notNull().default(0),
});

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),
  title: text("title").notNull(),
  author: text("author"),
  kind: text("kind").notNull(),
  publisher: text("publisher"),
  url: text("url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contentItems = pgTable("content_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").$type<ContentType>().notNull(),
  slug: text("slug").notNull(),
  category: text("category"),
  title: text("title").notNull(),
  summary: text("summary"),
  body: jsonb("body").$type<Record<string, unknown>>().notNull(),
  refs: jsonb("refs").$type<Reference[]>().notNull(),
  status: text("status").$type<Status>().notNull(),
  origin: text("origin").$type<"editor" | "ai_draft" | "import">().notNull(),
  sort: integer("sort").notNull().default(0),
  version: integer("version").notNull().default(1),
  searchText: text("search_text").notNull().default(""),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  reviewedBy: uuid("reviewed_by"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewNote: text("review_note"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contentRevisions = pgTable("content_revisions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  contentId: uuid("content_id").notNull(),
  version: integer("version").notNull(),
  snapshot: jsonb("snapshot").notNull(),
  changedBy: uuid("changed_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviewEvents = pgTable("review_events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  contentId: uuid("content_id").notNull(),
  actorId: uuid("actor_id"),
  action: text("action").notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  actorId: uuid("actor_id"),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  meta: jsonb("meta").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Role = "user" | "editor" | "reviewer" | "admin";
export type Status = "draft" | "in_review" | "changes_requested" | "published" | "rejected" | "archived";
export type ContentType = "dua" | "dhikr" | "hadith" | "article" | "lesson" | "quiz" | "glossary" | "event";
export type Reference = { title: string; author?: string; locator?: string; url?: string; kind?: string; sourceKey?: string };
export type ContentRow = typeof contentItems.$inferSelect;
