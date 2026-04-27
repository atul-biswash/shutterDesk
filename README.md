# ShutterDesk — Photography Studio Management

A dark, refined studio management platform built with Next.js 15, Tailwind CSS, and Shadcn UI.

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the Admin Dashboard at `/admin`.

## Phase 1 Routes

| Route | Description |
|-------|-------------|
| `/admin` | Admin Dashboard (mock data, fully designed) |
| `/office` | Office Staff Portal (placeholder) |
| `/photographer` | Photographer Portal (placeholder) |

## Shadcn Components Included

All components are pre-built in `components/ui/` without CSS variables (uses Tailwind tokens directly):

- `Button` — 6 variants (default/amber, outline, secondary, ghost, link, destructive)
- `Card` — with Header, Title, Description, Content, Footer
- `Badge` — success, pending, destructive, secondary, outline
- `Avatar` — with fallback
- `Separator`
- `Input`

## Design System

- **Background**: `#0c0c0d` (near-black)
- **Surface**: `#141416` (card backgrounds)  
- **Accent**: Amber `#f59e0b` (golden hour)
- **Typography**: DM Serif Display (headings) + DM Sans (body)

## Tech Stack

- Next.js 15 with App Router
- Tailwind CSS 3.4
- Shadcn UI (manual, no CSS variables)
- Lucide React icons
- TypeScript

## Next Steps (Phase 2)

- Event management UI with calendar view
- Invoice creation and management
- Payment tracking
- Photographer assignment workflow
- Role-based authentication
