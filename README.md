# 🌿 KisanLens (किसानलेंस / ಕಿಸಾನ್‌ಲೆನ್ಸ್ / கிசான்லென்ஸ் / కిసాన్‌లెన్స్)

> **Zero-Text, Voice-and-Vision Smart Agricultural System for Indian Farmers**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

KisanLens is a production-ready, accessible agricultural application designed for low-literacy Indian farmers. It eliminates text barriers by combining speech synthesis, voice recognition, camera input, and live satellite weather telemetry into an intuitive zero-text interface.

---

## 🚀 Supported Languages (8 Indian Regional Languages)

- 🇮🇳 **ಕನ್ನಡ (Kannada)** — `kn-IN`
- 🇮🇳 **हिन्दी (Hindi)** — `hi-IN`
- 🇬🇧 **English** — `en-IN`
- 🇮🇳 **தமிழ் (Tamil)** — `ta-IN`
- 🇮🇳 **తెలుగు (Telugu)** — `te-IN`
- 🇮🇳 **മലയാളം (Malayalam)** — `ml-IN`
- 🇮🇳 **मराठी (Marathi)** — `mr-IN`
- 🇮🇳 **বাংলা (Bengali)** — `bn-IN`

---

## 📱 Core Modules

1. **🌿 "Snap & Speak" Crop Doctor**
   - Multimodal disease diagnosis fusing Leaf Computer Vision + Voice Symptom Context + Live Open-Meteo GPS Weather Telemetry.
   - Demonstrates Single-Modal CNN (76.2%) vs Multimodal Fusion (94.4%) confidence comparison.
   - Step-by-step visual cure cards with audio readouts (`window.speechSynthesis`).

2. **🧴 Pesticide Scanner & Visual Dosage Calculator**
   - Zero-math visual dosage display: 🧴 Capfuls (e.g. 2 Caps = 20ml) + 🪣 15L Knapsack Sprayer Tank.
   - Verified authenticity badges, morning/evening spray timing, and PPE safety gear icons.

3. **🌍 Zero-Lab Satellite Soil & Crop Advisor**
   - 1-tap live GPS weather and soil moisture telemetry via Open-Meteo API.
   - Visual soil selector (Red Soil, Black Cotton Soil, Sandy Loam) with 12 crop-rotation matrices.
   - Top 3 recommended next crops ranked by estimated profit per acre (₹), water drop icons (💧), and harvest timeline.

4. **📊 Mandi Profit Radar**
   - Real-time APMC price arbitrage comparing regional mandis (Chickballapur, Kolar, Yeshwanthpur).
   - Automatically factors in transport costs (₹15/km per quintal).
   - High-contrast **SELL NOW** or **HOLD** verdicts.

5. **🗄️ Live Database & History**
   - Persistent client-side IndexedDB engine (Dexie.js) storing 3 tables: `diagnosis_records`, `pesticide_scans`, and `soil_advisories`.
   - Real-time row filtering, deletion, and CSV/JSON export.

6. **📈 Academic IEEE Research Metrics Dashboard**
   - Complete research comparison with Recharts: Accuracy bar chart, 6-metric radar chart, ablation study table, latency breakdown (ms), and classification metrics.

---

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/kisanlens.git
cd kisanlens

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ 1-Click Deployment to Vercel / Netlify

This project is 100% self-contained with no localhost:8000 dependencies:

```bash
# Deploy to Vercel
npm i -g vercel
vercel
```
