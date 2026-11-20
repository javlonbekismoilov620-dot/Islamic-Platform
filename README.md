# Hidoyat — oʻzbek tilidagi islomiy taʼlim platformasi

An Uzbek-language (Latin script) Islamic education and daily-worship web app for Uzbek-speaking
Muslims, following Ahl al-Sunnah creed and the Hanafi madhhab.

> **Religious accuracy comes first.** Quranic Arabic, translations, hadith texts, hadith numbers
> and grades are imported verbatim from published sources with checksums. They are never written
> by AI. Everything written for this project (Uzbek explanations, lessons, fiqh articles,
> transliterations, dua meanings) is an **editorial draft**. It is shown with a clear
> *«Tekshiruv kutilmoqda»* (pending review) label until a qualified scholar approves it in the
> admin panel. See [Content status](#content-status-read-before-launch).

The brand name is set in `src/config/site.ts`. "Hidoyat" is a placeholder: the project does not
use the name or branding of any existing organisation or website.

## Features

| Area | What exists |
|---|---|
| **Home** | Greeting, next prayer, daily checklist, continue-reading cards, verse / hadith / dua / dhikr of the day |
| **Quran** (`/quron`) | 114 surahs, Uthmani text (Tanzil), 3 Uzbek translations (QuranEnc) with translator and version shown, Cyrillic→Latin display toggle, search, bookmarks, last read, per-surah progress, font size, audio (EveryAyah, several reciters), repeat mode |
| **Duas** (`/duolar`) | 20 categories and 75 duas, each with Arabic, transliteration, Uzbek meaning, source, grade, occasion, copy/share/bookmark |
| **Dhikr** (`/zikrlar`) | Counter with haptics, reset confirmation, custom targets, saved sessions, daily progress, history (`/zikrlar/tarix`), morning/evening sets |
| **Salah academy** (`/ibodat/namoz`) | 8 lessons: introduction, wudu (step by step), ghusl, words of salah, practical prayer, men/women differences, common mistakes, final test. Quizzes and progress tracking |
| **Fiqh library** (`/bilimlar`) | 14 topics with ruling categories (farz, vojib, sunnat, mustahab, muboh, makruh, harom) shown distinctly, references and bibliography |
| **Hadith** (`/hadislar`) | 63 hadiths from the six books with collection number, Abdul-Baqi number for Muslim, and grades as published |
| **Prayer times** (`/namoz-vaqtlari`) | Uzbekistan cities plus geolocation, configurable method (default MWL), Hanafi Asr, minute adjustments, monthly table, in-app reminders |
| **Qibla** (`/qibla`) | Compass using device orientation (where the browser allows it), plus the bearing in degrees |
| **Calendar** (`/taqvim`) | Hijri calendar (Umm al-Qura via `Intl`, with a ±day offset setting) and Islamic events |
| **Search** (`/qidiruv`) | One search across Quran, duas, dhikr, hadith and articles; tolerant of Uzbek spelling variants (oʻ/o', gʻ/g', x/h, Cyrillic input) and of Arabic diacritics |
| **Reference** | Glossary (`/lugat`), pronunciation guide for the transliteration standard (`/talaffuz`), sources and methodology (`/manbalar`), privacy (`/maxfiylik`) |
| **Accounts** | Optional. Guest mode stores everything in the browser. Signing in syncs bookmarks, progress, dhikr history and settings, with merge on first sync. Data export and account deletion |
| **Admin** (`/admin`) | Role-based (user / editor / reviewer / admin): content editor, review queue, approve / reject / request changes, four-eyes rule, revision history, sources, categories, users, audit log |
| **PWA / SEO** | Installable manifest, service worker with offline fallback, sitemap, robots, Open Graph image, JSON-LD, favicon / app icons |
| **Design** | Glass-style cards, emerald / ivory / gold palette, light and dark themes, Inter for UI, Amiri Quran / Noto Naskh Arabic for Arabic (RTL, full tashkeel), mobile bottom navigation |

## Tech stack

- **Next.js 16** (App Router, server components, server actions), **React 19**, **TypeScript**
- **Tailwind CSS 4**
- **PostgreSQL** with **Drizzle ORM**, hand-written SQL migrations, **Row Level Security**
- **PGlite** (embedded Postgres) for local development and tests, so no database server is needed
- `adhan` for prayer times; `Intl` `islamic-umalqura` for Hijri dates
- Vitest (unit and integration) and Playwright (browser checks)

## Getting started

Requires Node.js ≥ 20.9.

```bash
npm install
cp .env.example .env.local     # optional: the defaults work for local development
npm run dev                    # http://localhost:3000
```

With `DATABASE_URL` unset, the app creates an embedded PGlite database in `.data/pglite`. On first
start it runs the migrations and seeds the content automatically.

### Becoming an administrator

Either set `BOOTSTRAP_ADMIN_EMAILS=you@example.com` and register or sign in with that address,
or assign a role from the command line:

```bash
npm run user:role -- --email you@example.com --role admin   # user | editor | reviewer | admin
```

PGlite allows only one process at a time, so **stop the dev server before running CLI scripts**
(`user:role`, `db:seed`, `db:migrate`) against the local database.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. `POSTGRES_URL`, `STORAGE_URL` or any custom-prefixed `*_URL` holding a `postgres://` URL also works. Empty means local PGlite. Required in production |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for the sitemap and Open Graph. On Vercel it falls back to the production domain |
| `SKIP_AUTO_SEED` | `true` stops the app from seeding an empty database on first start |
| `CONTENT_VISIBILITY` | `include_pending` (default: pending content is public but clearly labelled) or `reviewed_only` (only scholar-approved content is public). **Use `reviewed_only` for a public launch** |
| `BOOTSTRAP_ADMIN_EMAILS` | Comma-separated emails that become admin on sign-in. Remove it after the first admin exists |
| `PGLITE_DIR` | Optional custom PGlite directory |
| `ALLOW_PGLITE_IN_PRODUCTION` | `true` lets `next start` use PGlite. For local production testing only |
| `RATE_LIMIT_MULTIPLIER` | Raises auth rate limits. **Automated tests only**; never set it in production |

### Production database

Point `DATABASE_URL` (or `POSTGRES_URL`) at any PostgreSQL 15+ instance (Neon, Supabase,
self-hosted, …). On the first request, the app applies pending migrations and, if the database
is empty, seeds the content. Both steps run under a transaction-level advisory lock. That makes
them safe when several server instances cold-start at once, and safe behind a transaction-mode
pooler such as PgBouncer. Set `SKIP_AUTO_SEED=true` to turn seeding off.

The first migration runs `CREATE ROLE app_user` and `GRANT app_user TO <current user>`. Every
request then runs inside a transaction with `SET LOCAL ROLE app_user`, so RLS policies apply. The
connecting role therefore needs `CREATEROLE` (the default owner role on Neon and Supabase has it),
or a DBA must create `app_user` beforehand.

`npm run db:migrate` and `npm run db:seed -- --force` are still available to run by hand.
(`--force` rewrites untouched AI drafts and keeps edited content.)

### Deploying to Vercel

`vercel.json` pins the framework to Next.js and the functions region to `fra1` (Frankfurt, the
closest Vercel region to Uzbekistan). Without it, a project imported while the repository was
still empty is set up as "Other" and serves only a Vercel `404: NOT_FOUND` page.

1. In the Vercel project: **Storage → Create Database → Neon (Postgres)**. Pick the **Frankfurt
   (eu-central-1)** region so the database sits next to the functions, then connect it to the
   project. This sets `DATABASE_URL`.
2. **Settings → Environment Variables**: set `BOOTSTRAP_ADMIN_EMAILS` (your email) and, for a
   public launch, `CONTENT_VISIBILITY=reviewed_only`. `NEXT_PUBLIC_SITE_URL` is optional: it falls
   back to the project's Vercel production domain.
3. **Deployments → Redeploy** the latest `main` deployment.
4. Register with the bootstrap email to become admin, then remove `BOOTSTRAP_ADMIN_EMAILS`.

The repository itself never deploys anything or signs up for paid services.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` / `lint` | `tsc --noEmit` / ESLint |
| `npm test` | All Vitest suites (transliteration, search normalisation, prayer and Hijri, RLS and workflow, content integrity) |
| `npm run db:test-rls` | RLS and review-workflow tests only |
| `npm run content:verify` | Content integrity tests only (verbatim Arabic, references, slugs) |
| `npm run test:e2e` | Browser sweep of every main page on mobile/dark and desktop/light: HTTP status, console errors, horizontal overflow, Arabic `dir="rtl"`. Needs a running server (`BASE_URL`, default `http://localhost:3000`) |
| `npm run db:migrate` / `db:seed` | Apply migrations / seed content |
| `npm run user:role` | Set a user's role |
| `npm run data:import-quran` | Rebuild `public/quran/*` from source datasets (`QURAN_JSON_DIR`) |
| `npm run data:import-hadith` | Rebuild `src/content/sources/hadith-sources.json` (`HADITH_API_DIR`) |
| `npm run data:import-duas` | Rebuild dua and dhikr Arabic from Hisn al-Muslim and cross-check it against the hadith collections (`ADHKAR_JSON`, `HADITH_API_DIR`) |

The `e2e/*.cjs` scripts are extra Playwright flows: auth and sync, the admin review workflow, and
the dhikr counter. They expect a running server started with `RATE_LIMIT_MULTIPLIER` set.

## Project layout

```
src/app/                 routes (Uzbek URL segments: quron, duolar, zikrlar, ibodat, bilimlar, …)
src/app/admin/           admin panel (staff only; non-staff get 404)
src/components/          UI by feature (quran, dhikr, prayer, content, admin, …)
src/content/sources/     verbatim imports (JSON with source checksums) and selection lists
src/content/seed/        editorial drafts (Uzbek text) that reference the verbatim sources
src/server/db/           schema, migrations (SQL + RLS + triggers), client, seed
src/server/auth/         passwords (scrypt), sessions, rate limiting, request checks
src/server/content/      content repository (cached, visibility-aware)
src/lib/                 prayer times, Hijri, transliteration, Uzbek script conversion, Arabic normalisation, local store and sync
public/quran/            generated Quran text and translations (served as static JSON)
public/sw.js             service worker
tests/, e2e/             Vitest suites and Playwright scripts
```

## Data sources and licensing

| Data | Source | Licence / terms | How it is used |
|---|---|---|---|
| Quran Arabic (Uthmani) | [Tanzil](https://tanzil.net) | CC BY 3.0, verbatim, with attribution | Imported unchanged; SHA-256 recorded |
| Uzbek translations | [QuranEnc](https://quranenc.com): Muhammad Sodiq Muhammad Yusuf (v1.0.1), Alouddin Mansur (v1.0.0), Ruvvod Center (v1.0.4) | QuranEnc terms of use | Stored verbatim in the original **Cyrillic**; translator and version shown with every verse |
| Hadith Arabic, numbers, grades | [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api) | Unlicense | Matn extracted verbatim; numbers and grades exactly as published |
| Dua and dhikr Arabic | Hisn al-Muslim via [rn0x/Adhkar-json](https://github.com/rn0x/Adhkar-json) | Check the repository's terms before commercial use | Verbatim, then automatically cross-checked against the cited hadith texts |
| Audio | [EveryAyah](https://everyayah.com) | Linked, not hosted | Streamed from the original host |

**Latin display of the translations.** QuranEnc publishes the Uzbek translations in Cyrillic and
does not allow modifying them. Stored data stays Cyrillic. The Latin view is a deterministic
script conversion done in the browser (`src/lib/uz-script.ts`), and users can switch to the
original. Before launch, confirm with QuranEnc that showing a transliterated script is
acceptable, or set Cyrillic as the default.

## Content verification

1. **Verbatim import.** Arabic is copied from source files only, and each import records the
   source file's SHA-256.
2. **Automatic cross-checks.** Every dua and dhikr is matched against the hadith texts it cites
   (`findVerbatimSpan` with diacritic-insensitive comparison). 74 of 75 duas match; the exception
   is listed below.
3. **Workflow in the database.** Content moves `draft → in_review → published`, or to
   `changes_requested` / `rejected`. PostgreSQL triggers enforce it, so it cannot be bypassed
   from the UI:
   - only reviewers and admins can publish, reject or request changes;
   - a reviewer cannot approve content they edited themselves (four-eyes rule);
   - editing published content sends it back to review automatically;
   - every edit is kept as a revision, every review decision is recorded with its note, and
     admin actions (deletions, role changes, sources, categories) go to the audit log.
4. **Approval confirmation.** Approving requires ticking a statement that the reviewer checked
   the Arabic against the source, the translation, transliteration, grades and references, and
   conformity with Hanafi fiqh and Ahl al-Sunnah creed.

## Content status (read before launch)

All seeded content starts as **`in_review`**: 75 duas, 15 dhikr items, 63 hadiths, 8 lessons,
8 quizzes, 14 fiqh articles, 65 glossary entries and 13 calendar events. The Arabic is verbatim
from the sources above. The Uzbek explanations, lessons, articles, transliterations, dua meanings
and hadith translations are AI-assisted editorial drafts. **None of it is a fatwa or established
guidance until a qualified Hanafi scholar reviews and approves it.**

Before a public launch:

- [ ] Scholars review and approve the content in `/admin/tekshiruv`
- [ ] Set `CONTENT_VISIBILITY=reviewed_only`
- [ ] Check the **Vitr qunut** dua (`qunut-duosi`) by hand. It is not in the hadith datasets used
      here, so it could not be cross-checked automatically
- [ ] Check the prayer-time method and adjustments against the official Muslim Board of
      Uzbekistan timetable for each region
- [ ] Confirm the translation-display question with QuranEnc (see above)
- [ ] Review the source licences for your use case

## Security

- Passwords hashed with scrypt; session tokens are random and stored only as SHA-256 hashes
- Session cookie is `HttpOnly`, `SameSite=Lax`, with the `__Host-` prefix in production
- Server actions are protected by Next.js's built-in Origin check; API `PUT`/`DELETE` routes check
  `Origin` explicitly
- Rate limiting (stored in the database) on sign-in, registration and sync
- Row Level Security: users can read and write only their own data; unpublished content is
  visible only to staff (or, with `include_pending`, publicly with a label)
- Content Security Policy and security headers in `next.config.ts`
- The Markdown renderer builds React elements from a small whitelist and never injects raw HTML
- The admin layout checks the session before rendering anything: anonymous visitors are
  redirected to sign-in, signed-in non-staff get 404

## Known limitations

- Prayer reminders are in-app notifications: they work only while the site is open. There are no
  push notifications from a server
- No password-reset email (no email service is configured)
- The qibla compass needs a device orientation sensor and browser permission; desktop browsers
  show only the bearing
- Hijri dates use the Umm al-Qura calculation, which can differ by a day from the local
  announcement; users can adjust it with the ±day setting
- Quran audio depends on EveryAyah being available
