# 🌾 AgroWave — Smart Farming Dashboard for Indian Agriculture

> A real-time-feeling, simulation-driven smart farming dashboard built with **Next.js, TypeScript, Tailwind CSS, Zustand and Recharts** — a personal/portfolio project exploring what a modern agri-tech UI could look like for Indian farmers.

🔗 **Live demo:** _deploy your own with one click below — add the link here once deployed_
👤 **Author:** [Shaik Muzzammil](https://github.com/ShaikMuzzammil)

---

## 📋 Table of Contents

- [Why this project exists](#-why-this-project-exists)
- [Feature Tour](#-feature-tour)
- [What "Real-Time" Means Here](#-what-real-time-means-here)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deploy to Vercel](#%EF%B8%8F-deploy-to-vercel)
- [Roadmap / Ideas for Contributors](#-roadmap--ideas-for-contributors)
- [Disclaimer](#-disclaimer)
- [License](#-license)

---

## 🙋 Why this project exists

This isn't a production agri-tech platform, and it's **not trying to compete with or replace real farm-management software, IoT sensor networks, or agronomy expertise**. It started as a learning project — a way to practice building a large, multi-page Next.js app with a consistent design system, global state, charts, and "live" interactions — themed around something that felt meaningful: helping Indian farmers get a clearer picture of their land.

Think of it as **a small contribution, not a solution**. If you're a student, a self-taught developer, or someone exploring agri-tech UI ideas, feel free to:

- Use it as a **reference** for structuring a Next.js + Zustand + Tailwind dashboard
- **Fork it** and swap in real sensor/IoT/market-data APIs
- Pull out individual pieces (the calendar, the land-map SVG renderer, the live notification system, the price-alert flow) for your own projects
- Use it as a **portfolio piece** — it's intentionally feature-dense to show breadth

All farm data (plots, sensor readings, mandi prices, weather) is **simulated in the browser** so the app works instantly with zero backend setup. Nothing here should be used to make real agronomic, financial, or pest-management decisions.

---

## ✨ Feature Tour

<details>
<summary><strong>🏠 Home Page</strong> — marketing site + live contact section</summary>

- Animated hero with live clock and "KHARIF 2026 · Live Farm Intelligence Active" badge
- Feature grid, 7-tab interactive **Platform Guide**, "How It Works" walkthrough, benefits, testimonials
- Live crop-price ticker (CSS-animated marquee) and a market preview with sparkline charts
- **Contact section** (`/#contact-section`) — green-branded hero ("Have a question for AgroWave?"), quick "Contact Me" / helpline buttons, info cards, FAQ accordion (left) and a 3-step animated contact form (right) that sends real email via Resend
- The old standalone `/contact` route now redirects here — there is **one** contact destination, reached from the in-app "Home" button or the marketing nav
</details>

<details>
<summary><strong>📊 Dashboard</strong> — farm overview</summary>

- Live 6-plot farm summary: total acreage, average health, low-moisture count, unread alerts
- Per-plot moisture rings, health/temp/pH mini bars, season-completion %
- **Land Parcels** card — expandable list of every plot with acres/cents, health and moisture, plus a direct link into the Land Intelligence View
- Farm Health Radar (moisture / health / growth / nutrition / sunlight)
- Scrollable left panel so the page doesn't grow unbounded as you add plots
</details>

<details>
<summary><strong>🌱 My Fields (Field Monitor)</strong> — per-plot sensor detail</summary>

- Scrollable plot list with live moisture rings and rounded health/pest badges
- Detailed view per plot: moisture, health, temperature, soil pH, NPK (N/P/K), pest risk, auto-irrigation toggle
- **Add Plot** modal with acres → cents live conversion, custom crop/phase/area
- Two-step delete ("tap again to confirm") so you never lose a plot by accident
- Guide-tip recommendation cards (irrigation status, pest watch, fertilizer tip, soil health) generated from the plot's current numbers
- 7-day health trend chart + farm comparison radar
</details>

<details>
<summary><strong>🗺️ Land</strong> — satellite-style farm map</summary>

- Hand-drawn SVG polygon "fields" coloured by an NDVI-style health/moisture score
- **Any number of extra plots** you add are automatically laid out in a generated grid below the main map (with a divider + "newly added plot" legend) — nothing gets clipped or hidden
- Threshold sliders for Open / Warning status, live pulse animation when a plot's sensors update
- **Pesticide & Input Control panel** — per-plot spray on/off + weekly/bi-weekly/monthly schedule
- Full Section Analysis table (crop, acres/cents, status, moisture, health, temp, pH, NPK)
- Plot detail modal includes **Stop / Remove Plot** (two-step confirm) and a link into the full Land Intelligence View
- Print-friendly report view
</details>

<details>
<summary><strong>🔭 Land Intelligence View</strong> — the GODMODE detailed map</summary>

This is the most elaborate screen in the app:

- Satellite / Terrain / NDVI map-style toggles, animated rain overlay on rainy forecast days
- Click any plot to open a **live side panel** with three tabs:
  - **Overview** — live stats, NPK, pest risk, auto-irrigation status, and auto-generated guide tips
  - **Edit All** — every field is editable in real time: name, crop, phase, area/block, size in acres (with live cents conversion), moisture/health/temperature/pH sliders, NPK, pest risk, auto-irrigation — changes sync instantly to Land, Dashboard and Field Monitor, with a "✓ Synced" flash and an explicit **Save & Sync All Views** button for a clear confirmation
  - **Trends** — 7-day health trend line chart + a per-plot radar profile
- Editing the **size (acres)** visibly grows or shrinks the plot's polygon on the map
- A horizontal plot-switcher always shows every plot — including ones you've just added — so nothing is ever stranded off-screen
- "Remove Plot" (stop cultivation) with confirm, CSV export per plot, and quick-irrigate
- Sticky top bar + dismissible guide banner that stays out of the way once you've read it
</details>

<details>
<summary><strong>☁️ Weather</strong> — 7-day forecast & advisories</summary>

- Hyper-local-feeling 7-day forecast with hourly temperature and rainfall charts
- Rain-alert banner that appears automatically on rainy forecast days and pushes a notification (once per session)
- Farm advisories generated from the forecast (e.g. "postpone fertilizer application")
- Printable weather report
</details>

<details>
<summary><strong>📈 Market</strong> — mandi prices & alerts</summary>

- Live-feeling MSP + crop price cards with 30-day sparklines, for 8 major crops
- **24 mandis** across India (Delhi, Mumbai, Chennai, Kolkata, Lucknow, Guwahati, Jaipur, and more), each with an independently-ticking "Xs/Xm ago" live feed and state/trend/arrival columns
- Profit & Loss calculator (yield, costs, revenue breakdown)
- **Price alerts** — set a target price and get a real confirmation email via Resend (with inline validation and error states)
</details>

<details>
<summary><strong>📅 Calendar</strong> — farm task scheduling</summary>

- Monthly calendar with colour-coded, glowing dots per task type (irrigation, fertilizer, pesticide, harvest, planting, other)
- "TODAY" highlight, upcoming-tasks sidebar, add/complete/delete tasks, printable schedule
</details>

<details>
<summary><strong>📦 Inventory</strong> — stock tracking</summary>

- Category-filterable inventory list with low-stock highlighting
- Add-item modal, printable stock report
</details>

---

## ⚡ What "Real-Time" Means Here

Everything in this app runs **client-side** — there's no IoT hardware, no government data feed, and no database. "Real-time" means the UI behaves like a live system using timers, intervals and shared state, so it *feels* like a live farm dashboard. Specifically:

<details>
<summary>Click to expand the full list of live/real-time mechanics</summary>

- **Shared global state (Zustand + localStorage)** — plots, inventory, calendar events and notifications live in one store (`lib/store.ts`) and persist across page reloads, so an edit on the Land Intelligence View instantly shows up on the Dashboard, Land map and Field Monitor.
- **Sensor simulation intervals** — every few seconds, a random plot's moisture/health/temperature drifts slightly (clamped to realistic ranges), with a "● LIVE" pulse animation on the map.
- **Live notification feed** — notifications carry a real timestamp (`ts`) and render as "just now / Xs ago / Xm ago / Xh ago", updating while the bell dropdown is open (`lib/utils.ts → relTime`).
- **Rain-alert pipeline** — the Weather page checks the forecast for a high rain-probability day and, once per browser session, pushes a notification and shows a dismissible banner.
- **Live mandi feed** — each of the 24 mandi rows on the Market page has its own staggered "last updated" timestamp that ticks independently, plus a global "price feed synced Xs ago" indicator, refreshed every 60 seconds.
- **Real email sending** — the contact form, the home-page "Contact Me" flow, and Market price alerts all POST to `/api/contact`, which sends through [Resend](https://resend.com) using the `RESEND_API_KEY` / `HOST_EMAIL` environment variables.
- **Editable, synced plot data** — the Land Intelligence View's "Edit All" tab writes directly into the shared store via `setField` / `updateSensor`, so every number you type (size, NPK, pH, moisture, etc.) is reflected everywhere immediately, with an explicit "Save & Sync All Views" confirmation.
- **Dynamic layouts** — both the Land map and the Land Intelligence View generate extra polygon "cells" on the fly for any plot beyond the original six, so adding fields never breaks or hides them.

None of this talks to real sensors, real mandi APIs, or a real weather service — it's all deterministic-feeling randomness and shared state designed to demonstrate the *interaction patterns* a real system would need.
</details>

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS variables (`app/globals.css`) |
| State | [Zustand](https://github.com/pmndrs/zustand) with `persist` (localStorage) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Charts | [Recharts](https://recharts.org/) (Line, Bar, Radar, Area) |
| Icons | [lucide-react](https://lucide.dev/) |
| Email | [Resend](https://resend.com/) via a Next.js API route |
| Dates | [date-fns](https://date-fns.org/) |

---

## 📁 Project Structure

<details>
<summary>Click to expand the full folder tree</summary>

```
agrowave/
├── app/
│   ├── page.tsx                # Home — hero, guide, benefits, contact
│   ├── dashboard/page.tsx      # Farm overview
│   ├── field-monitor/page.tsx  # "My Fields" — per-plot detail
│   ├── land/page.tsx           # Land map + pesticide controls
│   ├── land-view/page.tsx      # GODMODE Land Intelligence View
│   ├── weather/page.tsx        # 7-day forecast & advisories
│   ├── market/page.tsx         # Mandi prices, P&L calc, alerts
│   ├── calendar/page.tsx       # Task calendar
│   ├── inventory/page.tsx      # Stock tracking
│   ├── about/page.tsx          # About page
│   ├── contact/page.tsx        # Redirects to /#contact-section
│   ├── api/
│   │   ├── contact/route.ts    # Resend email sending
│   │   ├── prices/route.ts     # Mock live price endpoint
│   │   ├── weather/route.ts    # Mock weather endpoint
│   │   ├── report/route.ts     # Report generation
│   │   └── alerts/...          # Price/weather alert endpoints
│   └── globals.css             # Design tokens, sections, print styles
├── components/
│   ├── Navigation.tsx           # Global nav + live status strip + notifications
│   ├── Footer.tsx
│   ├── PriceTicker.tsx          # CSS-animated marquee
│   ├── StatCounter.tsx          # Animated number counters
│   ├── ToastNotifications.tsx   # Page-entry tip toasts
│   └── Card.tsx
├── lib/
│   ├── store.ts                # Zustand store — plots, inventory, events, notifications
│   └── utils.ts                # Shared types, defaults, formatters, FORECAST/CROPS data
├── vercel.json
└── package.json
```
</details>

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (optional) configure email — see Environment Variables below
cp .env.example .env.local

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000
```

```bash
# Production build
npm run build
npm run start
```

The app works fully **without** any environment variables — only the email-sending features (contact form, price alerts) need them.

---

## 🔐 Environment Variables

Create a `.env.local` file (see `.env.example`):

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com/api-keys), used to send contact-form and price-alert emails |
| `HOST_EMAIL` | The email address that receives contact-form submissions |

If these are not set, the contact form and price alerts will still update the UI/notifications but won't send real emails — `/api/contact` will return an error that's surfaced gracefully in the form.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Import it on [vercel.com/new](https://vercel.com/new) — framework is auto-detected as Next.js
3. Add the two environment variables above in **Project Settings → Environment Variables**
4. Deploy — that's it, no database or extra services required

---

## 🗺 Roadmap / Ideas for Contributors

<details>
<summary>Click to expand — ideas if you want to extend this project</summary>

- Swap the simulated mandi prices for a real data source (e.g. [data.gov.in's Agmarknet API](https://data.gov.in)) — the Market page is already structured to make this a drop-in change in `getLivePrices()`
- Replace the sensor-simulation interval with real IoT/MQTT data
- Add user accounts so plot data isn't just local to one browser
- Add multi-language support (Hindi, Telugu, etc.) for accessibility
- Add a proper test suite (the project currently has none)
- Improve mobile gesture support on the Land Intelligence View's map
- Wire the Weather page to a real forecast API (e.g. Open-Meteo)
</details>

---

## ⚠️ Disclaimer

This is a **demo / educational / portfolio project**. Crop prices, weather forecasts, soil sensor readings, and pest-risk levels are **simulated** and must not be used for real farming, financial, or pest-management decisions. Always consult local agricultural extension services, certified agronomists, and official government sources (e.g. Agmarknet, IMD) for real decisions.

---

## 📜 License

This project will be released under the **MIT License** — a `LICENSE` file will be added by the author.
