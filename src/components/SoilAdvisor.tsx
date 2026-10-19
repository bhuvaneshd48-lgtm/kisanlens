"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mountain,
  Loader2,
  CheckCircle2,
  Thermometer,
  Droplets,
  CloudRain,
  Sprout,
  TrendingUp,
  Calendar,
  Leaf,
} from "lucide-react";
import { SOIL_TYPES, PREVIOUS_CROPS } from "@/lib/constants";
import { getSoilAdvisory, type SoilAdvisoryResult } from "@/lib/soil-engine";
import { fetchLiveWeather, getWeatherDescription, type WeatherData } from "@/lib/weather";
import { db } from "@/lib/db";
import SpeakButton from "./SpeakButton";

interface Props {
  tr: (key: string) => string;
  lang: string;
  speechCode: string;
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

export default function SoilAdvisor({ tr, lang, speechCode, speak, isSpeaking, stopSpeaking }: Props) {
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SoilAdvisoryResult | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather() {
    setWeatherLoading(true);
    try {
      const w = await fetchLiveWeather();
      setWeather(w);
    } catch {
      // fallback handled internally
    }
    setWeatherLoading(false);
  }

  async function handleAnalyze() {
    if (!selectedSoil || !selectedCrop) return;

    setIsAnalyzing(true);
    setResult(null);
    setSaved(false);

    await new Promise((r) => setTimeout(r, 2200));

    const advisory = getSoilAdvisory(selectedSoil, selectedCrop, weather);
    setResult(advisory);
    setIsAnalyzing(false);

    // Save to DB
    try {
      await db.soilAdvisories.add({
        soilType: advisory.soilType,
        previousCrop: advisory.previousCrop,
        weatherTemp: weather?.temperature ?? 0,
        weatherHumidity: weather?.humidity ?? 0,
        weatherSoilMoisture: weather?.soilMoisture ?? 0,
        weatherRainfall: weather?.rainfall ?? 0,
        recommendations: JSON.stringify(advisory.recommendations),
        language: lang,
        timestamp: Date.now(),
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save soil advisory:", err);
    }
  }

  const speakText = result
    ? `Soil Advisory for ${result.soilType} after ${result.previousCrop}. ${result.rotationAdvice}. Top recommendation: ${result.recommendations[0]?.crop} with estimated profit of ${result.recommendations[0]?.profitPerAcre} rupees per acre, harvestable in ${result.recommendations[0]?.harvestDays} days. Second recommendation: ${result.recommendations[1]?.crop}. Third: ${result.recommendations[2]?.crop}. ${result.soilHealth}`
    : "";

  const waterDrops = (n: number) => Array.from({ length: 5 }).map((_, i) => (i < n ? "💧" : "⬜")).join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-agri-gold flex items-center justify-center gap-2">
          <Mountain className="w-7 h-7" /> {tr("soilAdvisor")}
        </h2>
        <p className="text-gray-400 text-sm mt-1">{tr("soilAdvisorDesc")}</p>
      </div>

      {/* Live Weather & Soil Data */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-forest-card border border-agri-cyan/30 rounded-2xl p-4 glow-cyan"
      >
        <div className="flex items-center gap-2 mb-3">
          <CloudRain className="w-5 h-5 text-agri-cyan" />
          <span className="text-agri-cyan font-semibold text-sm">
            🛰️ {tr("liveWeather")} & Soil — GPS (13.13°N, 77.57°E)
          </span>
          {weatherLoading && <Loader2 className="w-4 h-4 text-agri-cyan animate-spin" />}
        </div>
        {weather && (
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{weather.temperature}°C</p>
              <p className="text-[10px] text-gray-500">{tr("temperature")}</p>
            </div>
            <div className="text-center">
              <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{weather.humidity}%</p>
              <p className="text-[10px] text-gray-500">{tr("humidity")}</p>
            </div>
            <div className="text-center">
              <CloudRain className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{weather.rainfall}mm</p>
              <p className="text-[10px] text-gray-500">{tr("rainfall")}</p>
            </div>
            <div className="text-center">
              <Sprout className="w-5 h-5 text-agri-green mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{weather.soilMoisture}%</p>
              <p className="text-[10px] text-gray-500">{tr("soilMoisture")}</p>
            </div>
          </div>
        )}
        {weather && (
          <p className="text-xs text-center text-gray-400 mt-2">{getWeatherDescription(weather.weatherCode)}</p>
        )}
      </motion.div>

      {/* Soil Type Selector */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          🌍 {tr("selectSoilType")}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {SOIL_TYPES.map((soil) => (
            <motion.button
              key={soil.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedSoil(soil.id); setResult(null); }}
              className={`rounded-2xl p-4 border-2 text-center transition-all ${
                selectedSoil === soil.id
                  ? "border-agri-gold bg-forest-card shadow-lg"
                  : "border-forest-border bg-forest-card/60 hover:border-forest-light"
              }`}
            >
              <span className="text-3xl block mb-2">{soil.emoji}</span>
              <p className="text-xs font-bold text-white">{soil.name}</p>
              <p className="text-[10px] text-gray-500 mt-1">pH {soil.ph}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Previous Crop Selector */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          🌱 {tr("selectPreviousCrop")}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {PREVIOUS_CROPS.map((crop) => (
            <motion.button
              key={crop.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedCrop(crop.id); setResult(null); }}
              className={`rounded-2xl p-3 border-2 text-center transition-all ${
                selectedCrop === crop.id
                  ? "border-agri-gold bg-forest-card shadow-lg"
                  : "border-forest-border bg-forest-card/60 hover:border-forest-light"
              }`}
            >
              <span className="text-2xl block mb-1">{crop.emoji}</span>
              <p className="text-[11px] font-bold text-white">{crop.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        disabled={!selectedSoil || !selectedCrop || isAnalyzing}
        onClick={handleAnalyze}
        className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all touch-target ${
          selectedSoil && selectedCrop && !isAnalyzing
            ? "bg-agri-gold text-forest-bg hover:shadow-lg hover:shadow-agri-gold/20"
            : "bg-forest-border text-gray-500 cursor-not-allowed"
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" /> {tr("fetchingWeather")}
          </>
        ) : (
          <>
            <Sprout className="w-6 h-6" /> {tr("getRecommendations")}
          </>
        )}
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Rotation Advice */}
            <div className="bg-forest-card border border-agri-green/30 rounded-2xl p-4">
              <p className="text-sm text-gray-300">{result.rotationAdvice}</p>
              <p className="text-xs text-gray-500 mt-2">{result.soilHealth}</p>
            </div>

            {/* Top 3 Recommendations */}
            <h4 className="text-sm font-bold text-agri-gold flex items-center gap-2">
              🏆 {tr("topRecommendations")}
            </h4>

            {result.recommendations.map((rec, i) => (
              <motion.div
                key={rec.crop}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`bg-forest-card border rounded-2xl p-5 ${
                  i === 0 ? "border-agri-green/40 glow-green" : "border-forest-border"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{rec.emoji}</span>
                    <div>
                      <h5 className="text-lg font-bold text-white">{rec.crop}</h5>
                      <p className="text-xs text-gray-500">Suitability: {rec.suitabilityScore}%</p>
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="px-3 py-1 bg-agri-green/20 text-agri-green text-xs font-bold rounded-full">
                      #1 BEST
                    </span>
                  )}
                  {i === 1 && (
                    <span className="px-3 py-1 bg-agri-gold/20 text-agri-gold text-xs font-bold rounded-full">
                      #2
                    </span>
                  )}
                  {i === 2 && (
                    <span className="px-3 py-1 bg-agri-cyan/20 text-agri-cyan text-xs font-bold rounded-full">
                      #3
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center bg-forest-bg/40 rounded-xl p-3">
                    <TrendingUp className="w-4 h-4 text-agri-green mx-auto mb-1" />
                    <p className="text-lg font-black text-agri-green">₹{rec.profitPerAcre.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-gray-500">{tr("profitPerAcre")}</p>
                  </div>
                  <div className="text-center bg-forest-bg/40 rounded-xl p-3">
                    <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-white">{waterDrops(rec.waterNeed)}</p>
                    <p className="text-[10px] text-gray-500">{tr("waterNeed")}</p>
                  </div>
                  <div className="text-center bg-forest-bg/40 rounded-xl p-3">
                    <Calendar className="w-4 h-4 text-agri-gold mx-auto mb-1" />
                    <p className="text-lg font-black text-white">{rec.harvestDays}</p>
                    <p className="text-[10px] text-gray-500">{tr("harvestDays")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-forest-bg/30 rounded-xl">
                  <Leaf className="w-4 h-4 text-agri-green shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400">{rec.nitrogenBenefit}</p>
                </div>
              </motion.div>
            ))}

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
              {saved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-agri-green flex items-center gap-1"
                >
                  <CheckCircle2 size={14} /> {tr("savedToDb")}
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
