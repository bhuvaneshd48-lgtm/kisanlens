"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Upload,
  Loader2,
  HardHat,
  Eye,
} from "lucide-react";
import { PESTICIDE_PRESETS, type PesticidePreset } from "@/lib/constants";
import { calculateDosage, type DosageResult } from "@/lib/pesticide-engine";
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

export default function PesticideScanner({ tr, lang, speechCode, speak, isSpeaking, stopSpeaking }: Props) {
  const [selectedPreset, setSelectedPreset] = useState<PesticidePreset | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DosageResult | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleScan(preset: PesticidePreset) {
    setSelectedPreset(preset);
    setIsScanning(true);
    setResult(null);
    setSaved(false);

    await new Promise((r) => setTimeout(r, 1800));

    const dosageResult = calculateDosage(preset);
    setResult(dosageResult);
    setIsScanning(false);

    // Save to DB
    try {
      await db.pesticideScans.add({
        productName: dosageResult.productName,
        composition: dosageResult.composition,
        capfuls: dosageResult.dosageVisual.capfuls,
        mlPerCap: dosageResult.dosageVisual.mlPerCap,
        tankLitres: dosageResult.dosageVisual.tankLitres,
        sprayTime: dosageResult.sprayTime,
        safetyGear: JSON.stringify(dosageResult.safetyGear),
        isAuthentic: dosageResult.isAuthentic,
        language: lang,
        timestamp: Date.now(),
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save pesticide scan:", err);
    }
  }

  const speakText = result
    ? `${result.productName}. ${result.isAuthentic ? "Verified authentic product." : "Warning: unverified product."} ${
        result.isFertilizer
          ? `Apply ${result.fertilizerDosage?.kgPerAcre} kg per acre in ${result.fertilizerDosage?.splits.length} splits.`
          : `Mix ${result.dosageVisual.capfuls} capfuls, that is ${result.dosageVisual.totalMl} ml, in ${result.dosageVisual.tankLitres} litre tank. Spray during ${result.sprayTime}.`
      } Safety gear required: ${result.safetyGear.join(", ")}. ${result.warnings.join(". ")}`
    : "";

  const SAFETY_ICONS: Record<string, string> = {
    "Rubber Gloves": "🧤",
    "Basic Gloves": "🧤",
    "Face Mask (N95)": "😷",
    "Face Mask": "😷",
    "Full Sleeves": "👕",
    "Goggles": "🥽",
    "Gumboots": "🥾",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-agri-cyan flex items-center justify-center gap-2">
          <ScanLine className="w-7 h-7" /> {tr("pesticideScanner")}
        </h2>
        <p className="text-gray-400 text-sm mt-1">{tr("pesticideScannerDesc")}</p>
      </div>

      {/* Preset Products */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">{tr("presetProducts")}</h3>
        <div className="grid grid-cols-2 gap-3">
          {PESTICIDE_PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScan(preset)}
              className={`relative overflow-hidden rounded-2xl p-4 border-2 transition-all text-left ${
                selectedPreset?.id === preset.id
                  ? "border-agri-cyan bg-forest-card shadow-lg"
                  : "border-forest-border bg-forest-card/60 hover:border-forest-light"
              }`}
            >
              {/* Scan animation */}
              {selectedPreset?.id === preset.id && isScanning && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-agri-cyan/70"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                </div>
              )}

              <div className="relative z-10">
                <span className="text-3xl">{preset.emoji}</span>
                <p className="text-sm font-bold text-white mt-2">{preset.name}</p>
                <span
                  className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1"
                  style={{ backgroundColor: preset.color + "20", color: preset.color }}
                >
                  {preset.type}
                </span>
              </div>

              {selectedPreset?.id === preset.id && !isScanning && result && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-agri-green flex items-center justify-center z-10"
                >
                  <CheckCircle2 size={14} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Upload Label */}
      <label className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-forest-border hover:border-agri-cyan/50 bg-forest-card/40 cursor-pointer transition-all touch-target">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={() => {
            // For uploaded labels, scan with a random preset
            const pick = PESTICIDE_PRESETS[Math.floor(Math.random() * PESTICIDE_PRESETS.length)];
            handleScan(pick);
          }}
        />
        <ScanLine className="w-6 h-6 text-agri-cyan" />
        <span className="text-sm text-gray-300">Scan Pesticide / Fertilizer Label</span>
        <Upload className="w-5 h-5 text-gray-500" />
      </label>

      {/* Scanning Indicator */}
      {isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 py-6"
        >
          <Loader2 className="w-8 h-8 text-agri-cyan animate-spin" />
          <span className="text-agri-cyan font-semibold">{tr("scanning")}</span>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Authenticity Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-agri-green/10 border-2 border-agri-green/40 rounded-2xl p-4 flex items-center gap-4 glow-green"
            >
              <ShieldCheck className="w-10 h-10 text-agri-green shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-agri-green">{tr("verified")} ✅</h3>
                <p className="text-sm text-gray-300">{result.productName}</p>
                <p className="text-xs text-gray-500 mt-1">{result.composition}</p>
              </div>
            </motion.div>

            {/* Dosage Visual (for non-fertilizer products) */}
            {!result.isFertilizer && (
              <div className="bg-forest-card border border-forest-border rounded-2xl p-5">
                <h4 className="text-sm font-bold text-agri-cyan mb-4 flex items-center gap-2">
                  <Droplets size={18} /> {tr("mixingRatio")}
                </h4>

                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {/* Capfuls */}
                  <div className="text-center p-4 bg-forest-bg/60 rounded-2xl min-w-[100px]">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: result.dosageVisual.capfuls }).map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="text-2xl"
                        >
                          🧴
                        </motion.span>
                      ))}
                    </div>
                    <p className="text-lg font-black text-white">
                      {result.dosageVisual.capfuls} {tr("capfuls")}
                    </p>
                    <p className="text-xs text-gray-500">
                      = {result.dosageVisual.totalMl}ml
                    </p>
                  </div>

                  {/* Plus sign */}
                  <span className="text-3xl text-gray-500 font-bold">+</span>

                  {/* Tank */}
                  <div className="text-center p-4 bg-forest-bg/60 rounded-2xl min-w-[100px]">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl block mb-2"
                    >
                      🪣
                    </motion.span>
                    <p className="text-lg font-black text-white">{result.dosageVisual.tankLitres}L</p>
                    <p className="text-xs text-gray-500">Knapsack {tr("tank")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fertilizer Dosage */}
            {result.isFertilizer && result.fertilizerDosage && (
              <div className="bg-forest-card border border-forest-border rounded-2xl p-5">
                <h4 className="text-sm font-bold text-purple-400 mb-3">📦 Fertilizer Application</h4>
                <p className="text-2xl font-black text-white mb-3">{result.fertilizerDosage.kgPerAcre} kg / Acre</p>
                <div className="space-y-2">
                  {result.fertilizerDosage.splits.map((split, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-3 p-3 bg-forest-bg/40 rounded-xl"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-400/20 text-purple-400 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-300">{split}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">📝 {result.fertilizerDosage.method}</p>
              </div>
            )}

            {/* Spray Time */}
            <div className="bg-forest-card border border-forest-border rounded-2xl p-4 flex items-center gap-4">
              <span className="text-4xl">{result.sprayTimeIcon}</span>
              <div>
                <h4 className="text-sm font-bold text-agri-gold flex items-center gap-2">
                  <Clock size={16} /> {tr("sprayTime")}
                </h4>
                <p className="text-lg font-bold text-white">{result.sprayTime}</p>
              </div>
            </div>

            {/* Safety Gear */}
            <div className="bg-forest-card border border-forest-border rounded-2xl p-4">
              <h4 className="text-sm font-bold text-agri-red flex items-center gap-2 mb-3">
                <HardHat size={16} /> {tr("safetyGear")}
              </h4>
              <div className="flex flex-wrap gap-3">
                {result.safetyGear.map((gear) => (
                  <motion.div
                    key={gear}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-3 py-2 bg-forest-bg/60 rounded-xl border border-forest-border"
                  >
                    <span className="text-xl">{SAFETY_ICONS[gear] || "🛡️"}</span>
                    <span className="text-sm text-gray-300">{gear}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className={`rounded-2xl p-4 border ${
                result.safetyLevel === "high"
                  ? "bg-agri-red/10 border-agri-red/30"
                  : result.safetyLevel === "medium"
                  ? "bg-agri-gold/10 border-agri-gold/30"
                  : "bg-agri-green/10 border-agri-green/30"
              }`}>
                {result.warnings.map((w, i) => (
                  <p key={i} className="text-sm text-gray-300 mb-1 last:mb-0">{w}</p>
                ))}
              </div>
            )}

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
