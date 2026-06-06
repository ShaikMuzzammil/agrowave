# 🌾 AgroWave v3 — Smart Farm Intelligence Platform

> **A comprehensive, real-time smart farming platform built for Indian agriculture.** Track soil health, market prices, weather forecasts, pest risks, and farm inventory — all in one beautifully designed dashboard.

---

## 🚀 Live Demo

Deploy this to Vercel in 60 seconds. No backend required — the platform runs fully client-side with API routes for email.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Modules](#pages--modules)
- [Environment Variables](#environment-variables)
- [Deploy to Vercel](#deploy-to-vercel)
- [Local Development](#local-development)
- [Platform Guide](#platform-guide)
- [KHARIF 2026 Data](#kharif-2026-data)

---

## ✨ Features

| Module | Features |
|--------|----------|
| **Dashboard** | Live 6-plot farm map, moisture rings, Farm Health Radar, 7-day forecast, dismissable hints |
| **Field Monitor** | Detailed plot analytics, NPK editing, auto-irrigation toggle, centered Add-Plot modal, trend charts |
| **Weather** | 7-day forecast, farm advisories, hourly temperature, rainfall charts, print report |
| **Market** | Live MSP + mandi prices, P&L calculator, mandi-wise rates, price alerts with notifications |
| **Inventory** | Stock tracking, low-stock alerts, category filter pills, centered Add-Item modal, print report |
| **Calendar** | Monthly calendar, task scheduling, priority levels, upcoming tasks sidebar, print schedule |
| **Land View** | Satellite-style plot grid, terrain toggle, threshold-based Open/Warning status, per-plot sensor overlay |
| **Contact** | Real-time email via Resend API, auto-reply, form validation, FAQ quick-answers |
| **Home Page** | Hero, Features, Platform Guide (7-tab walkthrough), Why AgroWave, Comparison table, Benefits, Testimonials, Crop Calendar, Market Preview, Contact strip |

### 🎨 Design System
- Green gradient brand palette (`#059669` → `#10B981`)
- 8 differentiated section backgrounds (no repetitive plain white)
- Visible filter pill active states — green gradient with white text
- Centered modals with backdrop blur overlay
- Toast notifications with page-specific hints on every navigation
- Framer Motion animations throughout
- Full print support on every page (`no-print` class hides UI chrome)

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | Framer Motion |
| Charts | Recharts (Area, Bar, Line, Radar) |
| State | Zustand with localStorage persist |
| Email | Resend API (`/api/contact` route) |
| Icons | Lucide React |
| Fonts | DM Sans + JetBrains Mono (Google Fonts) |
| Deploy | Vercel (zero-config) |

---

## 📁 Project Structure

```
agrowave/
├── app/
│   ├── page.tsx              ← Home page (all sections + guide)
│   ├── dashboard/page.tsx    ← Farm Dashboard
│   ├── field-monitor/page.tsx ← Field Monitor + Add Plot modal
│   ├── weather/page.tsx      ← Weather Intelligence
│   ├── market/page.tsx       ← Market Intelligence
│   ├── inventory/page.tsx    ← Inventory Hub
│   ├── calendar/page.tsx     ← Farm Calendar
│   ├── land/page.tsx         ← Land View
│   ├── contact/page.tsx      ← Contact Page
│   ├── api/contact/route.ts  ← Email API (Resend)
│   ├── globals.css           ← Design system + filter pills + modals
│   └── layout.tsx            ← Root layout
├── components/
│   ├── Navigation.tsx        ← Responsive nav + notification panel
│   ├── ToastNotifications.tsx ← Page-specific hints + store toasts
│   ├── Card.tsx              ← Reusable card component
│   ├── PriceTicker.tsx       ← Live scrolling price ticker
│   └── StatCounter.tsx       ← Animated number counter
├── lib/
│   ├── store.ts              ← Zustand state store
│   └── utils.ts              ← Data constants (CROPS, FORECAST, plots)
└── public/
```

---

## 📄 Pages & Modules

### Home Page (`/`)
All sections in order with smooth-scroll navigation:
1. **Hero** — Live clock, stats grid, CTA buttons
2. **Price Ticker** — Auto-scrolling live prices
3. **Stats Banner** — Animated counters (dark background)
4. **Features** — 8-card feature grid
5. **Platform Guide** — 7-tab interactive walkthrough (Dashboard, Fields, Weather, Market, Inventory, Calendar, Land)
6. **Why AgroWave** — 6 benefit cards + comparison table vs traditional farming
7. **How It Works** — 3-step process
8. **Benefits** — Stats cards + season impact
9. **Market Preview** — Live crop price grid
10. **Crop Calendar** — Kharif/Rabi/Zaid season chart
11. **Testimonials** — 3 farmer stories
12. **CTA Strip** — Green gradient with action buttons
13. **Contact Section** — Dark section with inline contact form

### Dashboard (`/dashboard`)
- KHARIF 2026 completion percentages (exact 15-decimal values)
- Auto-updating moisture every 20 seconds
- Dismissable hint banner
- Clickable plot cards with expandable detail panel
- Farm Health Radar chart
- Quick navigation tiles

### Field Monitor (`/field-monitor`)
- **Centered Add New Plot modal** with full-screen backdrop blur
- NPK update panel with collapse animation
- 7-day trend chart + farm comparison radar
- Pest & soil advisory cards (4 types)
- Irrigate/Auto-irrigate controls

### Market (`/market`)
- **4 clearly visible tabs**: Live Prices / P&L Calculator / Mandi Rates / Price Alerts
- All tabs use green gradient active state
- Crop filter pills also visible when selected
- P&L calculator with auto-fill from crop presets

### Inventory (`/inventory`)
- Category filter pills with green active state
- **Centered Add Item modal**
- Low-stock banner with item names
- +/– stock adjustment controls

### Calendar (`/calendar`)
- Monthly calendar grid with event dots
- **Centered Add Event modal** with priority selector
- Upcoming tasks sidebar with days-until countdown
- Event type breakdown

---

## 🔐 Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | ✅ Yes | Your Resend API key from resend.com/api-keys |
| `HOST_EMAIL` | ✅ Yes | The email address to receive contact form messages |

### How to get them:
1. **RESEND_API_KEY**: Sign up at [resend.com](https://resend.com) → API Keys → Create Key → copy
2. **HOST_EMAIL**: Any email you own (e.g. `you@gmail.com` or `farm@yourdomain.com`)

### `.env.local` (for local dev):
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
HOST_EMAIL=your@email.com
```

> ⚠️ **Never commit `.env.local` to Git.** The `.gitignore` already excludes it.

---

## 🚀 Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
vercel
```
Follow the prompts, then add env vars in the Vercel dashboard.

### Option B — GitHub Import
1. Push this project to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Add environment variables:
   - `RESEND_API_KEY` = your Resend key
   - `HOST_EMAIL` = your email
5. Click Deploy

### After Deployment
1. Open your Vercel URL
2. Go to Contact page and send a test message
3. Check your `HOST_EMAIL` inbox for the notification

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create env file
cp .env.example .env.local
# Edit .env.local — add your RESEND_API_KEY and HOST_EMAIL

# 3. Run dev server
npm run dev

# 4. Open browser
open http://localhost:3000
```

**Build for production:**
```bash
npm run build
npm start
```

---

## 📖 Platform Guide

### How to use each section:

#### 🏠 Home Page
- Scroll down to explore all sections
- Click section names in the navigation to jump directly
- The **Platform Guide section** has step-by-step instructions for every module

#### 📊 Dashboard
1. Click any plot card (left panel) to expand its sensor data
2. Use "Irrigate All" to water all 6 plots simultaneously
3. Click any tile in the Farm Map to see quick stats
4. Dismiss the hint banner with the ✕ button

#### 🌾 Field Monitor
1. Click a plot name from the list to view full analytics
2. Click "Update NPK" to log a fertilizer application
3. Toggle "Auto-Irrigate" per plot
4. Click "+ Add New Plot" — the modal appears centered with full overlay

#### 📈 Market
1. Four tabs: **Live Prices**, **P&L Calculator**, **Mandi Rates**, **Price Alerts**
2. Active tab highlighted with green gradient
3. Filter by crop using the pill buttons
4. In P&L Calculator, select crop to auto-fill input costs

#### 📦 Inventory
1. Filter pills above the table — **active pill is green**
2. + button adds 50 units, − deducts 10
3. Trash icon removes item
4. "Add Item" button (top right) opens a centered modal

#### 📅 Calendar
1. Click any date to see events for that day
2. "Add Event" modal includes type, plot, priority, and notes
3. Click the ✓ circle to mark a task complete
4. Upcoming panel shows tasks sorted by due date

#### 🗺️ Land View
1. Click any plot tile for sensor overlay (right panel)
2. Toggle "Terrain" switch to view elevation profile
3. Green = Open (meets thresholds), Yellow = Warning

---

## 🌾 KHARIF 2026 Data

The platform uses authentic KHARIF 2026 season data. All 6 plots are pre-seeded:

| Plot | Crop | Completion | Moisture | Temp |
|------|------|-----------|---------|------|
| North Field | Wheat · Tillering | 93.95571812921074% | 72% | 32.14°C |
| East Block | Rice · Panicle Init. | 74.71632610612846% | 48% | 34.03°C |
| South Field | Cotton · Boll Formation | 62.98277071487386% | 24% | 32.18°C |
| West Block | Soybean · Pod Fill | 82.18390979790693% | 68% | 30.70°C |
| Central Plot | Maize · Silking | 88.52486644323442% | 56% | 31.78°C |
| Border Strip | Onion · Bulb Dev. | 77.83659463739020% | 62% | 29.57°C |

Completion % is preserved exactly (15 decimal places) and visible on hover in Field Monitor cards.

---

## 🖨️ Print Support

Every page has a **Print Report** button. CSS `@media print` rules:
- Hides navigation, buttons, and non-essential UI
- Formats cards cleanly for A4 paper
- Preserves tables and charts in print layout

---

## 📧 Contact / Email Flow

When a contact form is submitted:
1. `POST /api/contact` receives `{name, email, subject, message}`
2. Resend sends a **notification email** to `HOST_EMAIL`
3. Resend sends an **auto-reply** to the user's email
4. Success state shown in the UI

---

## 🎨 Color System

```css
--brand-500: #10B981   /* Primary green */
--brand-600: #059669   /* Darker green */
--brand-400: #34D399   /* Light green */
--gold:      #F59E0B   /* Amber/warning */
--sky:       #3B82F6   /* Blue/info */
--rose:      #F43F5E   /* Red/danger */
```

---

## 🔧 Customization

**Change farm name:** Edit `farmName` in `lib/store.ts`  
**Change plot data:** Edit `DEFAULT_PLOTS` in `lib/utils.ts`  
**Change crop prices:** Edit `CROPS` base prices in `lib/utils.ts`  
**Change forecast:** Edit `FORECAST` array in `lib/utils.ts`  
**Add inventory items:** Edit `DEFAULT_INV` in `lib/utils.ts`  

---

*Built with ❤️ for Indian farmers · AgroWave v3 · KHARIF 2026*
