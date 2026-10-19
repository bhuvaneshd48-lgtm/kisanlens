/* ────────── Mandi Price Arbitrage Engine ────────── */

import { MANDIS, TRANSPORT_COST_PER_KM_PER_QUINTAL, type MandiInfo } from "./constants";

export interface MandiPrice {
  mandi: MandiInfo;
  pricePerQuintal: number;
  transportCostPerQuintal: number;
  netPricePerQuintal: number;
  pricePerTon: number;
  netProfitPerTon: number;
}

export interface MandiResult {
  crop: string;
  prices: MandiPrice[];
  bestMandi: MandiPrice;
  worstMandi: MandiPrice;
  extraProfitPerTon: number;
  verdict: "sell" | "hold";
  verdictText: string;
  holdDays?: number;
  priceDirection: "rising" | "falling" | "stable";
}

// Benchmark base prices (₹ per quintal) — realistic Karnataka APMC rates
const BASE_PRICES: Record<string, Record<string, number>> = {
  tomato: {
    chickballapur: 2200,
    kolar: 2650,
    yeshwanthpur: 2800,
  },
  onion: {
    chickballapur: 1800,
    kolar: 2100,
    yeshwanthpur: 2350,
  },
  potato: {
    chickballapur: 1500,
    kolar: 1750,
    yeshwanthpur: 1900,
  },
  rice: {
    chickballapur: 2800,
    kolar: 3000,
    yeshwanthpur: 3200,
  },
  chilli: {
    chickballapur: 8500,
    kolar: 9200,
    yeshwanthpur: 9800,
  },
};

// Simulate slight daily price variation
function getSimulatedPrice(base: number): number {
  const variation = (Math.random() - 0.5) * 0.08; // ±4% daily variation
  return Math.round(base * (1 + variation));
}

export function calculateMandiPrices(cropId: string): MandiResult {
  const basePrices = BASE_PRICES[cropId] || BASE_PRICES.tomato;
  const cropNames: Record<string, string> = {
    tomato: "Tomato",
    onion: "Onion",
    potato: "Potato",
    rice: "Rice",
    chilli: "Chilli",
  };

  const prices: MandiPrice[] = MANDIS.map((mandi) => {
    const pricePerQuintal = getSimulatedPrice(basePrices[mandi.id] || 2000);
    const transportCostPerQuintal = mandi.distanceKm * TRANSPORT_COST_PER_KM_PER_QUINTAL;
    const netPricePerQuintal = pricePerQuintal - transportCostPerQuintal;

    return {
      mandi,
      pricePerQuintal,
      transportCostPerQuintal,
      netPricePerQuintal,
      pricePerTon: pricePerQuintal * 10,
      netProfitPerTon: netPricePerQuintal * 10,
    };
  });

  // Sort by net profit
  prices.sort((a, b) => b.netPricePerQuintal - a.netPricePerQuintal);

  const bestMandi = prices[0];
  const worstMandi = prices[prices.length - 1];
  const extraProfitPerTon = (bestMandi.netPricePerQuintal - worstMandi.netPricePerQuintal) * 10;

  // Determine if farmer should sell now or hold
  const priceDirection = Math.random() > 0.6 ? "rising" : Math.random() > 0.5 ? "falling" : "stable";
  const holdDays = priceDirection === "rising" ? Math.floor(Math.random() * 5) + 2 : undefined;

  let verdict: "sell" | "hold" = "sell";
  let verdictText = "";

  if (priceDirection === "rising" && Math.random() > 0.4) {
    verdict = "hold";
    verdictText = `⏳ HOLD FOR ${holdDays} DAYS — Prices Rising at ${bestMandi.mandi.name}`;
  } else {
    verdict = "sell";
    verdictText = `🚚 SELL AT ${bestMandi.mandi.name.toUpperCase()} (+₹${extraProfitPerTon.toLocaleString("en-IN")} Extra Profit/Ton)`;
  }

  return {
    crop: cropNames[cropId] || cropId,
    prices,
    bestMandi,
    worstMandi,
    extraProfitPerTon,
    verdict,
    verdictText,
    holdDays,
    priceDirection,
  };
}
