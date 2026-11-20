import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "src/server/db/migrations");

/**
 * Applies pending *.sql migrations in order, recording them in schema_migrations.
 * wrap: false — the caller already runs everything inside one transaction.
 */
export async function runMigrations(exec: (q: string) => Promise<unknown>, query: (q: string) => Promise<unknown>, { wrap = true }: { wrap?: boolean } = {}) {
  await exec("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())");
  const res = (await query("select name from schema_migrations")) as { rows?: { name: string }[] } | { name: string }[];
  const rows = Array.isArray(res) ? res : (res.rows ?? []);
  const done = new Set(rows.map((r) => r.name));
  const files = readdirSync(DIR).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    if (done.has(f)) continue;
    const text = readFileSync(path.join(DIR, f), "utf8");
    const record = `insert into schema_migrations(name) values ('${f.replace(/'/g, "''")}');`;
    await exec(wrap ? `begin;\n${text}\n${record}\ncommit;` : `${text}\n${record}`);
    console.log(`[db] migratsiya qoʻllandi: ${f}`);
  }
}
