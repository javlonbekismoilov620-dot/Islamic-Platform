/**
 * Row Level Security va tekshiruv jarayoni triggerlari uchun integratsion testlar.
 * Har bir test toza, xotiradagi PostgreSQL (PGlite) bazasida bajariladi.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";

process.env.SKIP_AUTO_SEED = "true";
process.env.CONTENT_VISIBILITY = "include_pending";

type DbMod = typeof import("@/server/db/client");
let db: DbMod;
const ids: Record<string, string> = {};

async function rows<T = Record<string, unknown>>(q: Promise<unknown>): Promise<T[]> {
  const r = (await q) as { rows?: T[] } | T[];
  return Array.isArray(r) ? r : (r.rows ?? []);
}

async function as<T>(user: string | null, fn: (tx: Parameters<Parameters<DbMod["withContext"]>[1]>[0]) => Promise<T>, pending = true) {
  return db.withContext(user ? ids[user] : null, fn, { includePending: pending });
}

async function expectDenied(p: Promise<unknown>, re?: RegExp) {
  let err: unknown = null;
  try { await p; } catch (e) { err = e; }
  expect(err, "kutilgan ruxsat xatosi yuz bermadi").not.toBeNull();
  if (re) {
    const e = err as { cause?: { message?: string }; message?: string };
    expect(`${e.cause?.message ?? ""} ${e.message ?? ""}`).toMatch(re);
  }
}

beforeAll(async () => {
  db = await import("@/server/db/client");
  const sys = await db.getSystemDb();
  for (const [name, role] of [["alice", "user"], ["bob", "user"], ["editor", "editor"], ["reviewer", "reviewer"], ["reviewer2", "reviewer"], ["admin", "admin"]] as const) {
    const [r] = await rows<{ id: string }>(sys.execute(sql`insert into users(email, password_hash, role) values (${name + "@test.uz"}, 'x', ${role}) returning id`));
    ids[name] = r.id;
  }
  await sys.execute(sql`insert into content_items(type, slug, title, status, origin) values
    ('dua', 'pub', 'Published', 'published', 'import'),
    ('dua', 'pend', 'Pending', 'in_review', 'ai_draft'),
    ('dua', 'draft', 'Draft', 'draft', 'editor')`);
  await sys.execute(sql`insert into user_data(user_id, key, value) values (${ids.alice}, 'bookmarks', '{"duas":["a"]}'::jsonb)`);
});

describe("public content visibility", () => {
  it("anonymous sees published and (if enabled) pending, never drafts", async () => {
    const r = await as(null, (tx) => rows<{ slug: string }>(tx.execute(sql`select slug from content_items order by slug`)));
    expect(r.map((x) => x.slug)).toEqual(["pend", "pub"]);
  });
  it("pending content is hidden when visibility is reviewed_only", async () => {
    const r = await as(null, (tx) => rows<{ slug: string }>(tx.execute(sql`select slug from content_items`)), false);
    expect(r.map((x) => x.slug)).toEqual(["pub"]);
  });
  it("regular users cannot see drafts either", async () => {
    const r = await as("alice", (tx) => rows<{ slug: string }>(tx.execute(sql`select slug from content_items where slug = 'draft'`)));
    expect(r).toHaveLength(0);
  });
  it("staff can see drafts", async () => {
    const r = await as("editor", (tx) => rows<{ slug: string }>(tx.execute(sql`select slug from content_items where slug = 'draft'`)));
    expect(r).toHaveLength(1);
  });
});

describe("personal data isolation", () => {
  it("users only see their own synced data", async () => {
    expect(await as("alice", (tx) => rows(tx.execute(sql`select * from user_data`)))).toHaveLength(1);
    expect(await as("bob", (tx) => rows(tx.execute(sql`select * from user_data`)))).toHaveLength(0);
  });
  it("a user cannot write data for another user", async () => {
    await expectDenied(as("bob", (tx) => tx.execute(sql`insert into user_data(user_id, key, value) values (${ids.alice}, 'goals', '{}'::jsonb)`)), /row-level security/);
  });
  it("a user cannot read other users' accounts", async () => {
    const r = await as("bob", (tx) => rows<{ email: string }>(tx.execute(sql`select email from users`)));
    expect(r.map((x) => x.email)).toEqual(["bob@test.uz"]);
  });
  it("sessions and rate limits are not reachable from the app role", async () => {
    await expectDenied(as("admin", (tx) => tx.execute(sql`select * from sessions`)), /permission denied/);
    await expectDenied(as(null, (tx) => tx.execute(sql`select * from rate_limits`)), /permission denied/);
  });
  it("a user cannot promote themselves", async () => {
    await expectDenied(as("alice", (tx) => tx.execute(sql`update users set role = 'admin' where id = ${ids.alice}`)), /administrator/);
  });
  it("an admin can change roles", async () => {
    await as("admin", (tx) => tx.execute(sql`update users set role = 'editor' where id = ${ids.bob}`));
    const sys = await db.getSystemDb();
    const [r] = await rows<{ role: string }>(sys.execute(sql`select role from users where id = ${ids.bob}`));
    expect(r.role).toBe("editor");
    await sys.execute(sql`update users set role = 'user' where id = ${ids.bob}`);
  });
});

describe("editorial workflow", () => {
  it("regular users cannot create content", async () => {
    await expectDenied(as("alice", (tx) => tx.execute(sql`insert into content_items(type, slug, title, status) values ('dua', 'x1', 'X', 'draft')`)), /row-level security/);
  });
  it("editors can create drafts but cannot publish", async () => {
    await as("editor", (tx) => tx.execute(sql`insert into content_items(type, slug, title, status) values ('dua', 'ed1', 'Ed', 'draft')`));
    await expectDenied(as("editor", (tx) => tx.execute(sql`insert into content_items(type, slug, title, status) values ('dua', 'ed2', 'Ed2', 'published')`)));
    await as("editor", (tx) => tx.execute(sql`update content_items set status = 'in_review' where slug = 'ed1'`));
    await expectDenied(as("editor", (tx) => tx.execute(sql`update content_items set status = 'published' where slug = 'ed1'`)), /tekshiruvchi|administrator/);
  });
  it("a reviewer cannot approve content they edited (four-eyes)", async () => {
    await as("reviewer", (tx) => tx.execute(sql`update content_items set title = 'Pending (tahrir)' where slug = 'pend'`));
    await expectDenied(as("reviewer", (tx) => tx.execute(sql`update content_items set status = 'published' where slug = 'pend'`)), /toʻrt koʻz/);
  });
  it("another reviewer can approve, and the reviewer is recorded", async () => {
    await as("reviewer2", (tx) => tx.execute(sql`update content_items set status = 'published' where slug = 'pend'`));
    const sys = await db.getSystemDb();
    const [r] = await rows<{ status: string; reviewed_by: string; version: number }>(sys.execute(sql`select status, reviewed_by, version from content_items where slug = 'pend'`));
    expect(r.status).toBe("published");
    expect(r.reviewed_by).toBe(ids.reviewer2);
    expect(r.version).toBe(2);
  });
  it("editing published content sends it back to review and keeps a revision", async () => {
    await as("editor", (tx) => tx.execute(sql`update content_items set body = '{"meaning":"yangi"}'::jsonb where slug = 'pub'`));
    const sys = await db.getSystemDb();
    const [r] = await rows<{ status: string; id: string }>(sys.execute(sql`select status, id from content_items where slug = 'pub'`));
    expect(r.status).toBe("in_review");
    const rev = await rows(sys.execute(sql`select * from content_revisions where content_id = ${r.id}`));
    expect(rev.length).toBe(1);
  });
  it("only admins can delete content", async () => {
    const res = await as("reviewer", (tx) => rows(tx.execute(sql`delete from content_items where slug = 'ed1' returning id`)));
    expect(res).toHaveLength(0);
    const res2 = await as("admin", (tx) => rows(tx.execute(sql`delete from content_items where slug = 'ed1' returning id`)));
    expect(res2).toHaveLength(1);
  });
  it("review events must be attributed to the acting user", async () => {
    const sys = await db.getSystemDb();
    const [c] = await rows<{ id: string }>(sys.execute(sql`select id from content_items where slug = 'pub'`));
    await expectDenied(as("editor", (tx) => tx.execute(sql`insert into review_events(content_id, actor_id, action) values (${c.id}, ${ids.reviewer}, 'approve')`)), /row-level security/);
  });
});
