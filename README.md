<div align="center">

# 🌾 AgroWave

### Smart Farming Dashboard for Indian Agriculture

**Live mandi prices · Soil & sensor monitoring · Weather intelligence · Crop calendar · Field management**

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-EF008F?style=flat-square&logo=framer&logoColor=white)](https://framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://agrowave.vercel.app)

**[🚀 Live Demo — agrowave.vercel.app](https://agrowave.vercel.app)** &nbsp;·&nbsp; **[GitHub](https://github.com/ShaikMuzzammil/terra-project)**

</div>

---

## What is AgroWave?

AgroWave is a **production-ready smart farming dashboard UI** — a full-stack Next.js web application that shows what modern agri-tech software could look like for Indian farmers.

**No hardware. No sensors. No app install.** Just open it in any browser.

The platform simulates a complete farm management system with live-feeling data, real email delivery, and a clean, mobile-friendly interface. It's built as a **learning and portfolio project** — not a replacement for real farm-management software, IoT devices, or agronomic advice.

> 💡 **Why choose AgroWave for your reference or hackathon?**
> - Production-quality codebase — not a tutorial toy
> - Demonstrates: global state + charts + real email + live animations in one app
> - Indian agriculture context — crop names, mandis, MSP prices, INR formatting
> - Fully open — clone, fork, and swap in real APIs whenever you're ready

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, built-in API routes, SSR-ready |
| Language | TypeScript | Type-safe across the entire codebase |
| Styling | Tailwind CSS + CSS custom properties | Utility-first, consistent design tokens, dark & light sections |
| State | Zustand + `persist` middleware | Lightweight global store, survives page refresh via localStorage |
| Animation | Framer Motion | Page transitions, staggered lists, live sensor pulse effects |
| Charts | Recharts | Line, Bar, Radar, Area charts for all farm data visualisations |
| Icons | lucide-react | Clean, consistent icon set (300+ icons) |
| Email | Resend API | Contact form + market price alerts sent via server API route |
| Dates | date-fns | Calendar formatting and event management |
| Deployment | Vercel | Zero-config, environment variables, instant preview deploys |

---

## ✨ Feature Tour

<details>
<summary><strong>📊 Dashboard</strong> — whole-farm overview at a glance</summary>
<br>

- **Summary stat cards** — total acreage, average health %, low-moisture plot count, unread alert count
- **Left panel** — scrollable plot list with live moisture rings, health/temp/pH mini bars, season completion %, pH values (1 decimal, no float overflow)
- **Land Parcels card** — expandable; shows every plot with acres + cents, health + moisture %; "🔭 Open Detailed Land View" deep-link (new tab)
- **Farm Health Radar** — pentagon chart across moisture / health / growth / nutrition / sunlight
- **7-day forecast strip**, quick-access nav to all 8 app pages
- Right column scrolls independently — no page-level overflow

</details>

<details>
<summary><strong>🌱 My Fields (Field Monitor)</strong> — per-plot sensor detail</summary>
<br>

- Scrollable left list with live moisture rings and rounded health/pest badges (no long decimals)
- Per-plot detail: moisture %, health %, temperature (°C), soil pH (1 dp), NPK (N/P/K kg/ha), pest risk, auto-irrigation toggle
- **Add Plot** modal with live acres → cents conversion and custom crop/phase/area
- **Two-step delete** — must confirm to prevent accidental plot removal; pushes a notification
- Guide-tip recommendation cards generated from live plot numbers:
  - 💧 Irrigation Status (moisture threshold)
  - 🐛 Pest Watch (risk level)
  - 🌱 Fertilizer Tip (NPK comparison)
  - 🧪 Soil Health (pH range)

</details>

<details>
<summary><strong>🗺️ Land</strong> — satellite-style interactive farm map</summary>
<br>

- SVG polygon plots coloured by NDVI-style health × moisture score (Excellent → Critical)
- **Dynamic slot system** — adding plots in My Fields automatically places new polygon shapes below the main map; nothing clips, nothing hides
- Open / Warning / Critical threshold sliders, live sensor pulse animations every 8s
- **Pesticide & Input Control panel** — per-plot spray ON/OFF toggle + Weekly / Bi-weekly / Monthly schedule
- **Section Analysis table** — all plots in one view: Field, Crop, Acres/Cents, Status, Health, Moisture, Pest, Temp, pH, NPK
- Scrollable left panel with branded green scrollbar
- Full print-friendly report view

</details>

<details>
<summary><strong>🔭 Land Intelligence View</strong> — GODMODE map (opens in new tab)</summary>
<br>

This is the most feature-rich screen in the app:

- **View mode toggles** — Satellite (row-line texture), Terrain (contour), NDVI (health colour fill)
- Animated rain canvas overlay on rainy forecast days
- **Live right side-panel** with 3 tabs per plot:
  - **Overview** — 8 stat cards, NPK, pest risk, auto-irrigation, smart guide tips
  - **Edit All** — every field live-editable: name, crop, phase, area/block, size (acres + live cents), moisture, health, temp, pH sliders + number inputs, NPK, pest risk, auto-irrigation. Edits sync instantly to Land, Dashboard, Field Monitor. "Save & Sync All Views" button confirms and fires a notification
  - **Trends** — 7-day health line chart + per-plot radar profile
- Editing **size (acres)** visibly scales the plot polygon on the map
- Horizontal plot-switcher always shows all plots including newly added ones
- "Remove Plot" with two-step confirm, CSV export per plot, quick-irrigate
- Farm Health Radar sidebar toggle

</details>

<details>
<summary><strong>☁️ Weather Intelligence</strong> — multi-condition alerts + 7-day forecast</summary>
<br>

- 7-day forecast cards with hourly temperature + rainfall charts
- **Multi-condition alert banners** — each fires independently based on today's forecast:
  - ⛈️ **Rain Alert** — rain probability ≥ 60%; advice to skip fertiliser/pesticide
  - 🌡️ **Heat Advisory** — high temp ≥ 38°C; fieldwork timing and irrigation advice
  - 💧 **Humidity Alert** — relative humidity ≥ 80%; fungal disease risk warning
  - 💨 **Wind Advisory** — wind ≥ 25 km/h; spray drift risk, cover advice
  - ✅ **Ideal Conditions** — shown when all metrics are in safe ranges
- Each alert also pushes a **notification to the bell** (once per browser session per alert type)
- Farm advisories panel — 4 advisory cards generated from the weekly forecast
- Printable weather report

</details>

<details>
<summary><strong>📈 Market</strong> — live mandi prices, P&L, and alerts</summary>
<br>

- **Market Pulse row** — top gainer, top faller, crops above MSP count, total mandis tracked
- 8 crop price cards with 30-day sparklines and MSP reference line
- Crop selector (Wheat, Rice, Maize, Soybean, Cotton, Onion, Tomato, Potato)
- **24 mandis** across India — Azadpur Delhi, Vashi Mumbai, Koyambedu Chennai, Guntur AP, Lucknow UP, Kolkata WB, Guwahati AS, Jaipur RJ, Amritsar PB and more — each with independent live-ticking "Xs ago" timestamps
- P&L Calculator — yield, seed/fertiliser/labour/irrigation costs, revenue, net profit/loss
- **Price alerts** — set a crop + direction + threshold; fires a real confirmation email via Resend API

</details>

<details>
<summary><strong>📅 Calendar</strong> — farm task scheduling</summary>
<br>

- Monthly calendar grid with colour-coded, glowing dots per task type:
  - 🔵 Irrigation · 🟡 Fertilizer · 🔴 Pesticide · 🟢 Harvest · 🟣 Planting · ⚫ Other
- **Click the month/year header** → expands a real `<input type="month">` jump-to-any-date picker + "Jump to Today" button
- TODAY and selected date highlighted with animated green glow
- Upcoming Tasks sidebar — next 7 upcoming tasks across all plots
- Add / complete / delete tasks per day
- Printable farm schedule

</details>

<details>
<summary><strong>📦 Inventory</strong> — stock tracking and reorder management</summary>
<br>

- **Category value bar chart** — Seeds, Fertilizer, Pesticides, Fuel, Tools, Other (Recharts BarChart)
- Category filter pills + search bar
- **Expandable rows** — click any item to reveal:
  - Stock health bar (% of 3× minimum buffer)
  - Reorder suggestion with estimated cost
  - Quick restock buttons (+50, +100, +250)
- Low-stock items highlighted in red (below minimum threshold)
- Add item modal (name, category, quantity, unit, min qty, cost per unit)
- Printable stock report

</details>

<details>
<summary><strong>✉️ Contact</strong> — real email delivery, no review step</summary>
<br>

- Single-step form — Name, Email, Phone (optional), Subject dropdown, Message
- **Inline validation** — click Send without filling required fields → each empty field shows a red error message with an alert icon. No disabled button, no modal blocking
- Sends real email via Resend API to your `TEAM_EMAIL` inbox; reply-to is the sender's address
- 3 info cards overlapping the dark hero: Kisan Helpline · Send a Message · Available on the Open Web
- FAQ accordion (6 questions, expand/collapse)
- Portfolio project card with tech stack badges
- Success screen shows exactly what was sent

</details>

---

## ⚡ How "Live" Data Works

> Everything is **simulated in the browser** — no IoT sensors, no government API feed, no database.

| What looks live | How it actually works |
|---|---|
| Sensor readings updating | `setInterval` every 8s randomly drifts a plot's moisture/health/temp within realistic bounds |
| "Xs ago" notification timestamps | All notifications store a real `Date.now()` timestamp; displayed with a `relTime()` formatter that refreshes every 30s while the bell is open |
| Mandi feed ticking | Each of 24 mandis has its own `lastSeen` timestamp updated on a staggered 4s interval |
| Weather alert notifications | Fire once per session per condition type via `sessionStorage` guard flags |
| Price refresh every 60s | `setInterval` calls `getLivePrices()` which adds ±0.5–1.5% random drift to base prices |
| Cross-page sync | Zustand store with `persist` middleware — edit a plot name on Land Intelligence View, see it immediately on Dashboard, Field Monitor, Land map |
| Real email | Contact form + price alerts POST to `/api/contact` → Resend API → your inbox |

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/ShaikMuzzammil/terra-project.git
cd terra-project

# 2. Install
npm install

# 3. Environment (optional — only needed for email features)
cp .env.example .env.local
# Edit .env.local with your Resend key and email addresses

# 4. Run locally
npm run dev
# Open http://localhost:3000
```

```bash
# Verify production build before deploying
npm run build
npm run start
```

---

## 🔐 Environment Variables

| Variable | Required for | Where to get it |
|---|---|---|
| `RESEND_API_KEY` | Email sending | [resend.com/api-keys](https://resend.com/api-keys) |
| `TEAM_EMAIL` | Your inbox for form submissions | Your email address |
| `RESEND_FROM` | Sender address shown to recipients | A verified domain on Resend (use `onboarding@resend.dev` for testing) |

**Without these**, the app works fully — only the contact form and price alert emails won't actually send (the UI still confirms success).

**On Vercel:** Add all three in **Project Settings → Environment Variables → Production + Preview**.

---

## ☁️ Deploy to Vercel

```bash
# Vercel CLI
npm i -g vercel
vercel --prod
```

Or: Push to GitHub → Import at [vercel.com/new](https://vercel.com/new) → Add the 3 env vars → Deploy.

The `vercel.json` in this repo pre-configures all build commands. No extra steps.

**Live:** [agrowave.vercel.app](https://agrowave.vercel.app)

---

## ⚠️ Disclaimer

AgroWave is a **personal portfolio and learning project**. It is not an officially registered product, agri-tech service, or government-affiliated tool.

- All farm sensor data (soil moisture, health, temperature, pH) is **simulated**
- Mandi prices are **generated to feel realistic** — not sourced from Agmarknet or any live government feed
- Weather forecasts are **not real** — not from IMD or any weather API
- **Do not use this for real farming decisions, financial planning, or pest management**

For real data: [Agmarknet](https://agmarknet.gov.in) · [IMD](https://imd.gov.in) · [eNAM](https://enam.gov.in) · your local Krishi Vigyan Kendra

---

## 📜 License

This project is licensed under the **MIT License** — see the [`LICENSE`](./LICENSE) file for details.

```
MIT License — Copyright (c) 2026 Shaik Muzzammil
```

Free to use, modify, and distribute with attribution.

---

<div align="center">

**[🚀 agrowave.vercel.app](https://agrowave.vercel.app)** &nbsp;·&nbsp; **[GitHub](https://github.com/ShaikMuzzammil/terra-project)** &nbsp;·&nbsp; **[Contact](https://agrowave.vercel.app/contact)**

Built with ❤️ by [Shaik Muzzammil](https://github.com/ShaikMuzzammil)

</div>
