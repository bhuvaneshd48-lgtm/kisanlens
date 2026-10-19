"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  Truck,
  Timer,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { MANDI_CROPS } from "@/lib/constants";
import { calculateMandiPrices, type MandiResult } from "@/lib/mandi-engine";
import SpeakButton from "./SpeakButton";

interface Props {
  tr: (key: string) => string;
  lang: string;
  speechCode: string;
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

export default function MandiRadar({ tr, lang, speechCode, speak, isSpeaking, stopSpeaking }: Props) {
  const [selectedCrop, setSelectedCrop] = useState<string | null>("tomato");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MandiResult | null>(null);

  useEffect(() => {
    handleCheck("tomato");
  }, []);

  async function handleCheck(cropId: string) {
    setSelectedCrop(cropId);
    setIsLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1200));

    const res = calculateMandiPrices(cropId);
    setResult(res);
    setIsLoading(false);
  }

  const speakText = result
    ? `${result.crop} Mandi Price Report. ${result.verdictText}. Best price at ${result.bestMandi.mandi.name}: ${result.bestMandi.pricePerQuintal} rupees per quintal. After transport cost of ${result.bestMandi.transportCostPerQuintal} rupees, net price is ${result.bestMandi.netPricePerQuintal} rupees per quintal. Extra profit compared to local mandi: ${result.extraProfitPerTon} rupees per ton.`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-agri-green flex items-center justify-center gap-2">
          <TrendingUp className="w-7 h-7" /> {tr("mandiRadar")}
        </h2>
        <p className="text-gray-400 text-sm mt-1">{tr("mandiRadarDesc")}</p>
      </div>

      {/* Crop Selection */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">{tr("selectCrop")}</h3>
        <div className="grid grid-cols-5 gap-2">
          {MANDI_CROPS.map((crop) => (
            <motion.button
              key={crop.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCheck(crop.id)}
              className={`rounded-2xl p-3 border-2 text-center transition-all ${
                selectedCrop === crop.id
                  ? "border-agri-green bg-forest-card shadow-lg"
                  : "border-forest-border bg-forest-card/60 hover:border-forest-light"
              }`}
            >
              <span className="text-2xl block mb-1">{crop.emoji}</span>
              <p className="text-[10px] font-bold text-white">{crop.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 py-8"
        >
          <Loader2 className="w-8 h-8 text-agri-green animate-spin" />
          <span className="text-agri-green font-semibold">{tr("checkPrices")}...</span>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Giant Verdict Banner */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`rounded-2xl p-6 text-center border-2 ${
                result.verdict === "sell"
                  ? "bg-agri-green/10 border-agri-green/50 glow-green"
                  : "bg-agri-gold/10 border-agri-gold/50 glow-gold"
              }`}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {result.verdict === "sell" ? (
                  <Truck className="w-12 h-12 text-agri-green mx-auto mb-3" />
                ) : (
                  <Timer className="w-12 h-12 text-agri-gold mx-auto mb-3" />
                )}
              </motion.div>
              <h3 className={`text-xl font-black ${
                result.verdict === "sell" ? "text-agri-green" : "text-agri-gold"
              }`}>
                {result.verdictText}
              </h3>
              {result.verdict === "sell" && (
                <p className="text-sm text-gray-400 mt-2">
                  Extra profit vs local: <span className="text-agri-green font-bold">₹{result.extraProfitPerTon.toLocaleString("en-IN")}/Ton</span>
                </p>
              )}
            </motion.div>

            {/* Price Comparison Table */}
            <div className="bg-forest-card border border-forest-border rounded-2xl overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-5 gap-0 px-4 py-3 bg-forest-border/30 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <span className="col-span-1">Mandi</span>
                <span className="text-right">{tr("pricePerQuintal")}</span>
                <span className="text-right">{tr("distance")}</span>
                <span className="text-right">{tr("transportCost")}</span>
                <span className="text-right">{tr("netProfit")}</span>
              </div>

              {/* Data Rows */}
              {result.prices.map((price, i) => {
                const isBest = i === 0;
                return (
                  <motion.div
                    key={price.mandi.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`grid grid-cols-5 gap-0 px-4 py-3 border-t border-forest-border items-center ${
                      isBest ? "bg-agri-green/5" : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center gap-2">
                      <MapPin size={12} className={isBest ? "text-agri-green" : "text-gray-500"} />
                      <div>
                        <p className={`text-xs font-bold ${isBest ? "text-agri-green" : "text-white"}`}>
                          {price.mandi.name.split(" ").slice(0, 2).join(" ")}
                        </p>
                        {isBest && (
                          <span className="text-[8px] text-agri-green font-bold uppercase">⭐ Best</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white text-right">₹{price.pricePerQuintal.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-400 text-right">{price.mandi.distanceKm} km</p>
                    <p className="text-xs text-agri-red text-right">-₹{price.transportCostPerQuintal.toLocaleString("en-IN")}</p>
                    <p className={`text-sm font-black text-right ${isBest ? "text-agri-green" : "text-white"}`}>
                      ₹{price.netPricePerQuintal.toLocaleString("en-IN")}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Per-Ton Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-forest-card border border-forest-border rounded-2xl p-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase">{tr("bestMandi")} Net/Ton</p>
                <p className="text-2xl font-black text-agri-green">₹{result.bestMandi.netProfitPerTon.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-forest-card border border-forest-border rounded-2xl p-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase">Extra Profit/Ton</p>
                <p className="text-2xl font-black text-agri-gold">+₹{result.extraProfitPerTon.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Price Trend */}
            <div className="bg-forest-card border border-forest-border rounded-2xl p-4 flex items-center gap-3">
              {result.priceDirection === "rising" ? (
                <ArrowUpRight className="w-6 h-6 text-agri-green" />
              ) : result.priceDirection === "falling" ? (
                <TrendingDown className="w-6 h-6 text-agri-red" />
              ) : (
                <ArrowRight className="w-6 h-6 text-agri-gold" />
              )}
              <div>
                <p className="text-sm font-bold text-white">
                  Price Trend: {result.priceDirection.charAt(0).toUpperCase() + result.priceDirection.slice(1)}
                </p>
                <p className="text-xs text-gray-500">
                  {result.priceDirection === "rising"
                    ? "Prices are trending upward this week"
                    : result.priceDirection === "falling"
                    ? "Prices have been declining — sell soon"
                    : "Prices are stable this week"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <SpeakButton
                text={speakText}
                lang={speechCode}
                speak={speak}
                isSpeaking={isSpeaking}
                stopSpeaking={stopSpeaking}
                label={tr("speakAloud")}
                size="lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
