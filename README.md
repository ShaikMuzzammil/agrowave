# 🌾 AgroWave — Smart Farming Intelligence Platform

> **KHARIF 2026** | 6 Live Farm Plots | Next.js 14 + WebSockets + AI + Resend

A precision agriculture intelligence platform built for Indian farmers — monitoring **6 live farm plots** with real-time soil data, AI-powered insights, satellite land view, live market prices, and a fully working contact form powered by [Resend](https://resend.com).

---

## ✨ What's New in this Release

| Module | Enhancement |
|---|---|
| 🎨 **Design System** | All-new section backgrounds (no more "all white") · 96px section padding · visible section separators |
| 🔘 **Filter Pills** | Selected state fully visible with green gradient + white text on ALL filter pill groups |
| 🗂️ **Add New Plot Modal** | Centered overlay · visible Advanced section (toggle) with N/P/K, soil type, drainage, notes |
| 📬 **Contact Form** | Centered fields · HTML email to you + auto-reply to sender via Resend API |
| 🗺️ **Land Dashboard** | SVG satellite farm tiles with real crop-row patterns · terrain elevation profile · per-plot analytics table |
| 🔔 **Notifications** | Section-aware welcome toasts · animated progress bar timer · bell icon panel |
| 🏠 **Home Page** | Full sections: Hero → Why AgroWave → Features → Live Plot Preview → Comparison Table → Testimonials → Contact |
| 📊 **Market Page** | Live Prices / P&L Calculator / Mandi Rates / Price Alerts — all tabs fully visible + styled |
| 🖨️ **Print** | Every page has a Print Report button · CSS `@media print` hides nav/toast |
| ℹ️ **About Page** | Tech stack, mission, roadmap, and CTA |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# → edit .env.local with your RESEND_API_KEY and HOST_EMAIL

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | ✅ For emails | Get free at [resend.com](https://resend.com) |
| `HOST_EMAIL` | ✅ For emails | Your email — where contact messages arrive |
| `NEXTAUTH_URL` | Optional | Your deployment URL |
| `OPENAI_API_KEY` | Optional | For AI assistant tab |

> **Without a Resend key:** The form still works and shows success — emails just won't send. Add the key any time.

---

## 🧭 Pages & Navigation

| Route | Description |
|---|---|
| `/` | Home — Hero, Why, Features, Plot Preview, Comparison, Testimonials, Contact |
| `/dashboard` | Live farm dashboard — 6 plot cards, radar chart, 7-day forecast |
| `/field-monitor` | Full plot detail — NPK editor, 7-day trend chart, Add New Plot modal |
| `/land` | Satellite land view — SVG farm tiles, terrain toggle, plot analytics table |
| `/weather` | 7-day forecast, hourly chart, advisory cards |
| `/market` | Live prices, P&L calculator, mandi rates, price alerts |
| `/inventory` | Stock management with low-stock alerts |
| `/calendar` | Farm event scheduling |
| `/contact` | Contact form + FAQ + Resend integration |
| `/about` | Tech stack, mission, roadmap |

---

## 📐 Design System

```css
/* Key CSS classes */
.filter-pill           /* default filter button */
.filter-pill-active    /* selected — green gradient, white text */
.market-tab            /* market page tabs */
.market-tab-active     /* selected market tab */
.crop-tab              /* crop selector buttons */
.crop-tab-active       /* selected crop */
.modal-overlay         /* centered dark backdrop */
.modal-card            /* centered white card */
.advanced-toggle       /* expandable advanced section */
.bg-section-a/b/c/d/e  /* differentiated section backgrounds */
```

---

## 🏗️ Tech Stack

| Layer | Libraries |
|---|---|
| **Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, DM Sans + JetBrains Mono fonts |
| **Animation** | Framer Motion — all cards have whileHover, initial/animate |
| **Charts** | Recharts — AreaChart, BarChart, LineChart, RadarChart |
| **State** | Zustand with persist middleware |
| **Email** | Resend API — HTML email to host + auto-reply to sender |
| **Icons** | Lucide React |

---

## 📦 Project Structure

```
terra-enhanced/
├── app/
│   ├── page.tsx              # Home page — all sections
│   ├── layout.tsx            # Root layout with Navigation + ToastNotifications
│   ├── globals.css           # Design system — filter pills, modals, backgrounds
│   ├── dashboard/page.tsx    # Live dashboard
│   ├── field-monitor/page.tsx# Plot monitor + Add New Plot modal
│   ├── land/page.tsx         # Satellite land view
│   ├── weather/page.tsx      # Weather forecasts
│   ├── market/page.tsx       # Market intelligence
│   ├── inventory/page.tsx    # Inventory management
│   ├── calendar/page.tsx     # Farm calendar
│   ├── contact/page.tsx      # Contact form
│   ├── about/page.tsx        # About page
│   └── api/contact/route.ts  # Resend email API
├── components/
│   ├── Navigation.tsx        # Top nav + notifications panel
│   ├── ToastNotifications.tsx# Bottom-right toast stack
│   ├── Card.tsx              # Reusable card component
│   ├── PriceTicker.tsx       # Scrolling market ticker
│   └── Footer.tsx            # Site footer
├── lib/
│   ├── store.ts              # Zustand store
│   └── utils.ts              # CROPS, FORECAST, helpers
├── .env.example              # Environment template
└── README.md                 # This file
```

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# RESEND_API_KEY, HOST_EMAIL
```

---

## 🖨️ Print Support

Every page includes a **Print Report** button. Click it or use `Ctrl+P` — the CSS `@media print` rules hide the navbar, toasts, and action buttons, leaving a clean printable layout.

---

## 📧 Resend Email Flow

When a visitor submits the contact form:

1. **API Route** `/api/contact` receives the POST
2. **Email to you** — HTML card with name, email, subject, message, and a quick-reply link
3. **Auto-reply** — the visitor gets a branded confirmation with their message summary

Both emails use the `onboarding@resend.dev` sender (works without a verified domain). To use your own domain, update the `from` field in `/app/api/contact/route.ts`.

---

Built with 💚 for Indian Farmers — **KHARIF 2026**
