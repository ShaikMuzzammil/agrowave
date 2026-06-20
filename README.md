<div align="center">

# 🌾 AgroWave — Smart Farming Dashboard

**A full-stack, production-ready smart farming dashboard UI built for Indian agriculture.**  
Live market prices · AI-style farm insights · Soil & weather monitoring · Mandi rate tracking

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)

**[🚀 Live Demo →](https://your-deployment-url.vercel.app)** &nbsp;|&nbsp; **[GitHub →](https://github.com/ShaikMuzzammil/terra-project)**

> Built by [Shaik Muzzammil](https://github.com/ShaikMuzzammil) — CSE Student, Amrita Vishwa Vidyapeetham

</div>

---

## ⚡ What is AgroWave?

AgroWave is a **smart farming dashboard** that shows what modern agri-tech software could look like for Indian farmers — built entirely as a web app, **no hardware or sensors needed**.

**Why this project?**
- Indian farmers manage multiple plots, track crop prices, monitor soil health, and plan harvests — but existing tools are complex or inaccessible
- This project explores a clean, fast, mobile-friendly interface for all of that in one place
- It's a **learning + portfolio project** — not a replacement for real farm-management software or agronomists

**Who is it useful for?**
- Students / developers building agri-tech UIs (use it as a reference or starting point)
- Hackathon participants looking for a production-grade Next.js + Zustand template
- Anyone wanting to see how charts, live-state, and real email sending work together in a full-stack Next.js app

---

## 🛠 Tech Stack

| Layer | What & Why |
|---|---|
| **Framework** | Next.js 14 (App Router) — fast, file-based routing, API routes built-in |
| **Language** | TypeScript — type-safe across the whole codebase |
| **Styling** | Tailwind CSS + CSS custom properties — utility-first, consistent design tokens |
| **State** | Zustand + `persist` (localStorage) — lightweight global store, survives page refresh |
| **Animation** | Framer Motion — smooth page transitions, staggered lists, live sensor pulses |
| **Charts** | Recharts — Line, Bar, Radar, Area charts for soil/weather/inventory data |
| **Icons** | lucide-react — clean, consistent icon set |
| **Email** | Resend API — contact form + price alerts delivered instantly |
| **Dates** | date-fns — calendar and event formatting |
| **Deploy** | Vercel — zero-config, environment variable management |

---

## ✨ Features

<details>
<summary><strong>📊 Dashboard</strong> — farm overview at a glance</summary>

- Live 6-plot farm summary: total acreage, average health, low-moisture count, unread alerts
- Per-plot moisture rings, health/temp/pH bars, season-completion percentages
- Expandable Land Parcels card with acres/cents and health data per plot
- Farm Health Radar (moisture / health / growth / nutrition / sunlight)
- One-click "Open Detailed Land View" into the intelligence map

</details>

<details>
<summary><strong>🌱 My Fields (Field Monitor)</strong> — per-plot sensor detail</summary>

- Live scrollable plot list with health rings and rounded sensor badges
- Detail view: moisture %, health %, temperature, soil pH, NPK, pest risk, auto-irrigation
- **Add Plot** modal with live acres → cents conversion
- Two-step delete (confirm before removing) to prevent accidents
- Guide-tip cards generated from current plot numbers (irrigation, pest, fertilizer, soil health)

</details>

<details>
<summary><strong>🗺️ Land</strong> — satellite-style farm map</summary>

- SVG polygon "fields" coloured by an NDVI-style health/moisture score
- Extra plots (added via My Fields) auto-layout in a generated grid below the map — nothing clips
- Threshold sliders for Open / Warning / Critical status
- Pesticide & Input Control panel — per-plot spray toggle + schedule
- Full Section Analysis table with acres/cents, status, moisture, health, temp, pH, NPK

</details>

<details>
<summary><strong>🔭 Land Intelligence View</strong> — advanced interactive map (opens in new tab)</summary>

- Satellite / Terrain / NDVI map-style view toggles
- Animated rain overlay on rainy forecast days
- Click any plot → live side panel with 3 tabs:
  - **Overview** — live stats, NPK, pest risk, auto-irrigation + smart guide tips
  - **Edit All** — every field editable: name, crop, phase, area, size, moisture, health, temp, pH, NPK — changes sync instantly to all pages
  - **Trends** — 7-day health trend chart + per-plot radar profile
- Editing size (acres) visibly resizes the polygon on the map
- **Save & Sync All Views** button confirms propagation everywhere
- CSV export per plot, quick-irrigate, two-step remove

</details>

<details>
<summary><strong>☁️ Weather</strong> — 7-day forecast</summary>

- 7-day forecast cards with hourly temperature and rainfall charts
- Rain-alert banner on rainy days (auto-dismissed after acknowledgement, once per session)
- Farm advisories generated from the forecast
- Printable weather report

</details>

<details>
<summary><strong>📈 Market</strong> — mandi prices & alerts</summary>

- Live-feeling price cards for 8 crops with 30-day sparklines and MSP reference
- **Market Pulse** row — top gainer, top faller, above-MSP count, mandis tracked
- **24 mandis** across India — each with independent live-ticking "Xs ago" timestamps
- P&L calculator (yield, seed/fertilizer/labor costs, revenue breakdown)
- Price alerts — real email sent via Resend when threshold is set

</details>

<details>
<summary><strong>📅 Calendar</strong> — farm task scheduling</summary>

- Monthly calendar with colour-coded glowing dots per task type
- Click the month/year header → expand a jump-to-any-month picker
- Upcoming tasks sidebar, add / complete / delete tasks
- Printable farm schedule

</details>

<details>
<summary><strong>📦 Inventory</strong> — stock tracking</summary>

- Category-value bar chart (Seeds, Fertilizer, Pesticides, Fuel, Tools, Other)
- Click any row → expands stock-health bar, reorder suggestion, quick restock buttons
- Low-stock highlighting (red) below minimum threshold
- Add item modal, printable stock report

</details>

<details>
<summary><strong>✉️ Contact</strong> — real email delivery</summary>

- Single-step form with inline validation (no review/confirm step)
- Sends real email via Resend to your inbox; reply goes directly to the sender
- FAQ accordion (6 questions) + portfolio/tech-stack card

</details>

---

## ⚡ What "Real-Time" Means Here

> All data is **simulated in the browser** — no IoT hardware, no government API, no database.

<details>
<summary>Click to see the full list of live mechanics</summary>

| Mechanic | How it works |
|---|---|
| **Shared state** | Zustand + localStorage — edit on Land Intelligence View, see it instantly on Dashboard, Field Monitor, Land |
| **Sensor simulation** | Every 8 seconds, a random plot's moisture/health/temp drifts slightly (clamped to real ranges) with a `● LIVE` pulse |
| **Live notification timestamps** | All notifications carry a real `ts` (timestamp) and display as "Xs/Xm/Xh ago", refreshed every 30s while the bell is open |
| **Rain alert pipeline** | Weather page pushes a notification + banner when any forecast day has >60% rain — once per browser session |
| **Live mandi feed** | Each of 24 mandi rows has its own staggered "last updated" ticker, refreshed at 4-second intervals |
| **Real email sending** | Contact form + Market price alerts POST to `/api/contact` → Resend API → your inbox |
| **Dynamic plot layouts** | Adding plots in My Fields auto-generates new polygon slots in both the Land map and Land Intelligence View |

</details>

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/ShaikMuzzammil/terra-project.git
cd terra-project

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# → Edit .env.local and add your Resend key + email addresses

# 4. Run the development server
npm run dev
# → Open http://localhost:3000
```

```bash
# Production build (verify before deploying)
npm run build
npm run start
```

The app works fully **without any environment variables** — only the email features (contact form, price alerts) require them.

---

## 🔐 Environment Variables

Create `.env.local` based on `.env.example`:

| Variable | Required for email? | Description |
|---|---|---|
| `RESEND_API_KEY` | ✅ Yes | From [resend.com/api-keys](https://resend.com/api-keys) |
| `TEAM_EMAIL` | ✅ Yes | Your inbox — receives contact form submissions |
| `RESEND_FROM` | ✅ Yes | Verified sender address on Resend (e.g. `AgroWave <hello@yourdomain.com>`) |

**On Vercel:** Add these three in **Project Settings → Environment Variables** → Production + Preview.

---

## ☁️ Deploy to Vercel

```bash
# Option 1 — Vercel CLI
npm i -g vercel
vercel
# Follow prompts, add env vars when asked

# Option 2 — GitHub Import
# Push to GitHub → Import at vercel.com/new → Add env vars → Deploy
```

Vercel auto-detects Next.js — no extra config needed. The `vercel.json` in this repo sets build/dev/install commands explicitly.

---

## ⚠️ Disclaimer

AgroWave is a **personal portfolio and learning project**. It is not an officially registered agri-tech product or service.

- All farm data (plots, sensor readings, soil health) is **simulated**
- Mandi prices are **not live** — they are generated to feel realistic, not sourced from Agmarknet or any government API
- Weather forecasts are **not real** — not from IMD or any weather service
- **Do not use this for real farming, financial, or pest-management decisions**

For real farm data, consult certified agronomists, your local Krishi Vigyan Kendra, Agmarknet (agmarknet.gov.in), or IMD (imd.gov.in).

---

## 📜 License

MIT License — see `LICENSE` file (to be added by the author).

**[🚀 Live Demo →](https://your-deployment-url.vercel.app)** &nbsp;|&nbsp; **[GitHub →](https://github.com/ShaikMuzzammil/terra-project)** &nbsp;|&nbsp; Built by [Shaik Muzzammil](https://github.com/ShaikMuzzammil)
