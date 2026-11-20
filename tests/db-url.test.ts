import { describe, expect, it } from "vitest";
import { resolveDatabaseUrl } from "@/server/db/client";

const PG = "postgres://u:p@host-pooler.example/db";
const PG_DIRECT = "postgresql://u:p@host.example/db";

describe("resolveDatabaseUrl", () => {
  it("prefers the well-known names", () => {
    expect(resolveDatabaseUrl({ DATABASE_URL: PG, POSTGRES_URL: PG_DIRECT })).toBe(PG);
    expect(resolveDatabaseUrl({ POSTGRES_URL: PG })).toBe(PG);
    expect(resolveDatabaseUrl({ STORAGE_URL: PG })).toBe(PG);
  });

  it("finds a custom-prefixed variable and prefers the pooled one", () => {
    expect(resolveDatabaseUrl({ MYDB_DATABASE_URL_UNPOOLED: PG_DIRECT, MYDB_DATABASE_URL: PG })).toBe(PG);
    expect(resolveDatabaseUrl({ NEON_URL: PG, NEON_URL_UNPOOLED: PG_DIRECT })).toBe(PG);
    expect(resolveDatabaseUrl({ X_URL_UNPOOLED: PG_DIRECT })).toBe(PG_DIRECT);
  });

  it("ignores empty and non-Postgres values", () => {
    expect(resolveDatabaseUrl({ DATABASE_URL: "", SITE_URL: "https://example.com", REDIS_URL: "redis://x" })).toBeUndefined();
    expect(resolveDatabaseUrl({})).toBeUndefined();
  });
});
