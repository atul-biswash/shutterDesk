# ShutterDesk

A full-stack photography studio management platform built for **Ambient Bliss** (Dhaka, Bangladesh). Manages events, invoices, client payments, photographer payouts, and user accounts — with role-based portals for Admins, Office staff, and Photographers, localized for BDT (৳).

Live on Vercel · Built with Next.js 15 App Router.

---

## Features

### Admin Portal (`/admin`)
- **Dashboard** with month/year date filtering via URL params — Total Income, Total Expenses, Net Profit, New Contracts, and Completed Events, each with automatic percentage comparison against the previous month
- **Events** — full table with search + filters, "Mark as Completed" action that triggers an instant photographer payout prompt (suggested at 50% of invoice value)
- **Invoices** — list with billed/collected/outstanding stats, automatic "Overdue" badges (unpaid > 30 days), invoice creation form with dynamic line items, and a print-optimized A4 invoice detail page with the Ambient Bliss letterhead
- **Finances** — Income / Expenses tabs, Record Client Payment dialog (auto-marks invoice PAID when payments cover the grand total), Pay Photographer dialog with cascading event select
- **Photographers** — roster with per-photographer workload and lifetime earnings
- **Users** (Admin-only) — create Admin/Office/Photographer accounts with bcrypt-hashed passwords

### Photographer Portal (`/photographer`)
- Personal dashboard — earnings this month, YTD, pending payouts, upcoming events
- **My Schedule** — upcoming shoots grouped by month
- **Earnings** — payout history with methods, plus pending payouts awaiting payment
- Admins/Office can preview any photographer's view (clearly banner-marked)

### Automation
- **Invoice emails via Resend** — clients automatically receive a branded HTML invoice email (BDT formatted, direct link to the invoice) the moment an invoice is created. Email failure never blocks invoice creation.
- **Auto-paid invoices** — recording payments that cover the grand total flips the invoice status to PAID automatically
- **Payout prompts** — completing an event with an assigned photographer immediately prompts for their payout

### Auth & Security
- Auth.js v5 with Credentials provider, JWT sessions, bcrypt password hashing
- Middleware-enforced route protection: photographers cannot access `/admin` or `/office`; `/admin/users` is Admin-only
- Every Server Action re-validates the session role server-side (`requireAdmin()` / `requireStaff()`)
- Security-patched: Next.js 15.3.8 + React 19.2.1 (CVE-2025-66478, CVE-2025-55182/-55183/-55184/-67779)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3.8 (App Router, Server Components, Server Actions) |
| UI | React 19.2.1, Tailwind CSS 3.4, Shadcn UI (in-tree), Lucide icons |
| Database | PostgreSQL + Prisma 6.16.2 (`Decimal(12,2)` for money) |
| Auth | Auth.js v5 (`next-auth@5.0.0-beta.25`) + Prisma Adapter, JWT strategy |
| Email | Resend |
| Fonts | DM Serif Display (headings) · DM Sans (body) |
| Currency | BDT (৳) via centralized `lib/currency.ts`, `en-IN` digit grouping |
| Hosting | Vercel |

---

## Project Structure

```
shutterdesk/
├── app/
│   ├── page.tsx                     # Role-based redirect
│   ├── auth/signin/                 # Login (Suspense-wrapped form)
│   ├── admin/
│   │   ├── page.tsx                 # Dashboard + DashboardPeriodPicker
│   │   ├── events/                  # EventsTable + payout prompt dialog
│   │   ├── invoices/                # List, create form, [id] print page
│   │   ├── finances/                # Tabs + payment dialogs
│   │   ├── photographers/           # Roster
│   │   └── users/                   # Admin-only user management
│   ├── photographer/
│   │   ├── page.tsx                 # Dashboard
│   │   ├── schedule/                # Upcoming, grouped by month
│   │   └── earnings/                # Payout history + pending
│   ├── office/                      # Placeholder portal
│   └── api/
│       ├── auth/[...nextauth]/
│       └── photographers/[id]/events/
├── components/
│   ├── layout/                      # Sidebar, Header, Shell
│   ├── providers/                   # SessionProvider
│   └── ui/                          # Shadcn primitives
├── lib/
│   ├── db.ts                        # Prisma singleton
│   ├── data.ts                      # Read queries (server-only)
│   ├── actions.ts                   # "use server" mutations + role guards
│   ├── email.ts                     # Resend client + invoice email template
│   ├── currency.ts                  # formatBDT / formatBDTWithDecimals
│   └── constants.ts                 # Date helpers, getInitials, paymentMethods
├── auth.ts                          # NextAuth + PrismaAdapter (Node runtime)
├── auth.config.ts                   # Edge-safe config for middleware
├── middleware.ts                    # Route protection
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/logo.png                  # Ambient Bliss logo (invoice letterhead)
├── types/next-auth.d.ts             # Session/JWT type augmentation
└── CLAUDE.md                        # Context file for Claude Code
```

---

## Database Models

| Model | Purpose |
|---|---|
| `User` | Accounts with `role: ADMIN \| OFFICE \| PHOTOGRAPHER` |
| `Event` | Shoots with `status: PENDING \| COMPLETED \| CANCELED`, optional photographer |
| `Invoice` | `UNPAID \| PAID`, one per event, `grandTotal Decimal(12,2)` |
| `InvoiceItem` | Line items (description, qty, price, total) |
| `Payment` | `INCOME_CLIENT` (→ Invoice) or `EXPENSE_PHOTOGRAPHER` (→ Event + User) |
| `Account` / `Session` / `VerificationToken` | Auth.js adapter tables |

---

## Getting Started

### Prerequisites
- Node.js 18.18+ (tested on 22)
- PostgreSQL database (local, or Neon/Supabase)

### Setup

```bash
git clone <your-repo-url>
cd shutterdesk
npm install --legacy-peer-deps
```

Create `.env` from the template:

```bash
cp .env.example .env
```

Fill in:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
AUTH_SECRET=""            # node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_TRUST_HOST="true"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY=""         # from resend.com (optional in dev — emails skip gracefully)
RESEND_FROM_ADDRESS="Ambient Bliss <onboarding@resend.dev>"
```

Initialize the database:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

Run:

```bash
npm run dev
```

### Demo Accounts (after seeding)

All passwords: `password123`

| Email | Role | Lands on |
|---|---|---|
| admin@shutterdesk.com | ADMIN | /admin |
| office@shutterdesk.com | OFFICE | /admin |
| james@shutterdesk.com | PHOTOGRAPHER | /photographer |
| priya@shutterdesk.com | PHOTOGRAPHER | /photographer |

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync schema to DB (dev) |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio GUI |
| `npm run db:reset` | Wipe + re-migrate + re-seed |

`postinstall` automatically runs `prisma generate` after every install.

---

## Deployment (Vercel)

1. Push to GitHub (`.env` is gitignored)
2. Import the repo in Vercel
3. **Settings → Build & Development**:
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install --legacy-peer-deps`
4. **Settings → Environment Variables**: add all keys from `.env.example` (use the pooled Postgres URL; generate a fresh production `AUTH_SECRET`; set `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the Vercel domain)
5. Run once from local against the production DB: `npx prisma db push && npm run db:seed`
6. Deploy

If the build fails with a Prisma engine error, add to `schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

---

## Key Workflows

**Invoice lifecycle**
Create invoice (`/admin/invoices/create`) → event + invoice + items saved in one transaction → client automatically emailed (if email provided) → payments recorded on `/admin/finances` → invoice auto-flips to PAID when covered → print anytime from the invoice page (A4-optimized, Ambient Bliss letterhead).

**Event completion → payout**
Mark event completed on `/admin/events` → if a photographer is assigned and unpaid, a dialog immediately suggests a 50% payout → pay on the spot or later from Finances → payout appears in the photographer's Earnings page.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `EventStatus has no exported member` | `npx prisma generate` |
| `EPERM` on prisma generate (Windows) | `Get-Process node \| Stop-Process -Force`, close VS Code, retry |
| "Cannot find module for page" build error | `Remove-Item -Recurse -Force .next` then rebuild |
| Adapter type error in `auth.ts` | Keep the `as Adapter` cast — duplicate `@auth/core` instances |
| Invoice email not sending | Check `RESEND_API_KEY`; with the `onboarding@resend.dev` sender you can only email your own verified address — verify a domain in Resend for real clients |

---

## License

Private project — all rights reserved.
