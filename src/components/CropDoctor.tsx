"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Droplets,
  CloudRain,
  ChevronRight,
  Loader2,
  Sparkles,
  ImageIcon,
  Leaf,
} from "lucide-react";
import { LEAF_SAMPLES, type LeafSample } from "@/lib/constants";
import { runDiagnosis, runUploadDiagnosis, type DiagnosisResult } from "@/lib/diagnosis-engine";
import { fetchLiveWeather, getWeatherDescription, type WeatherData } from "@/lib/weather";
import { db } from "@/lib/db";
import MicButton from "./MicButton";
import SpeakButton from "./SpeakButton";

interface Props {
  tr: (key: string) => string;
  lang: string;
  speechCode: string;
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  isListening: boolean;
  transcript: string;
  setTranscript: (s: string) => void;
  startListening: () => void;
  stopListening: () => void;
}

export default function CropDoctor({
  tr, lang, speechCode, speak, isSpeaking, stopSpeaking,
  isListening, transcript, setTranscript, startListening, stopListening,
}: Props) {
  const [selectedSample, setSelectedSample] = useState<LeafSample | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [saved, setSaved] = useState(false);

  // Auto-fetch weather on mount
  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather() {
    setWeatherLoading(true);
    try {
      const w = await fetchLiveWeather();
      setWeather(w);
    } catch {
      // fallback handled by fetchLiveWeather
    }
    setWeatherLoading(false);
  }

  function handleSelectSample(sample: LeafSample) {
    setSelectedSample(sample);
    setUploadedImage(null);
    setResult(null);
    setSaved(false);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setSelectedSample(null);
      setResult(null);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  async function handleDiagnose() {
    setIsScanning(true);
    setResult(null);
    setSaved(false);

    // Simulate processing time
    await new Promise((r) => setTimeout(r, 2000));

    let diagResult: DiagnosisResult;
    if (selectedSample) {
      diagResult = runDiagnosis(selectedSample, transcript, weather);
    } else {
      diagResult = runUploadDiagnosis(transcript, weather);
    }

    setResult(diagResult);
    setIsScanning(false);

    // Auto-save to database
    try {
      await db.diagnosisRecords.add({
        cropName: diagResult.cropName,
        diseaseName: diagResult.diseaseName,
        severity: diagResult.severity,
        imageConfidence: diagResult.imageConfidence,
        multimodalConfidence: diagResult.multimodalConfidence,
        weatherTemp: weather?.temperature ?? 0,
        weatherHumidity: weather?.humidity ?? 0,
        weatherRainfall: weather?.rainfall ?? 0,
        voiceSymptom: transcript,
        cureSteps: JSON.stringify(diagResult.cureSteps),
        language: lang,
        timestamp: Date.now(),
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save diagnosis:", err);
    }
  }

  const canDiagnose = selectedSample || uploadedImage;

  // Build speak text
  const speakText = result
    ? `${result.isHealthy ? "Good news!" : "Disease detected:"} ${result.diseaseName} on ${result.cropName}. Severity: ${result.severity} percent. Confidence: ${result.multimodalConfidence} percent. ${result.cureSteps.join(". ")}. ${result.weatherImpact}`
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
          <Leaf className="w-7 h-7" /> {tr("cropDoctor")}
        </h2>
        <p className="text-gray-400 text-sm mt-1">{tr("cropDoctorDesc")}</p>
      </div>

      {/* Live Weather Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-forest-card border border-agri-cyan/30 rounded-2xl p-4 glow-cyan"
      >
        <div className="flex items-center gap-2 mb-3">
          <CloudRain className="w-5 h-5 text-agri-cyan" />
          <span className="text-agri-cyan font-semibold text-sm">{tr("liveWeather")} — Bengaluru, Karnataka</span>
          {weatherLoading && <Loader2 className="w-4 h-4 text-agri-cyan animate-spin" />}
        </div>
        {weather && (
          <div className="grid grid-cols-3 gap-4">
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
          </div>
        )}
        {weather && (
          <p className="text-xs text-center text-gray-400 mt-2">{getWeatherDescription(weather.weatherCode)}</p>
        )}
      </motion.div>

      {/* Preset Samples */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-agri-gold" /> {tr("presetSamples")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {LEAF_SAMPLES.map((sample) => (
            <motion.button
              key={sample.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectSample(sample)}
              className={`relative overflow-hidden rounded-2xl p-3 border-2 transition-all text-left ${
                selectedSample?.id === sample.id
                  ? "border-agri-cyan bg-forest-card shadow-lg"
                  : "border-forest-border bg-forest-card/60 hover:border-forest-light"
              }`}
            >
              {/* Gradient background simulating leaf image */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sample.gradient} opacity-40`} />

              {/* Scan laser animation when selected */}
              {selectedSample?.id === sample.id && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-agri-cyan/60"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
              )}

              <div className="relative z-10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-forest-border/80 bg-forest-bg/90 flex items-center justify-center shadow-inner">
                  <img src={sample.image} alt={sample.disease} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{sample.emoji}</span>
                    <p className="text-sm font-bold text-white truncate">{sample.crop}</p>
                  </div>
                  <p
                    className="text-xs font-semibold mt-0.5 truncate"
                    style={{ color: sample.color }}
                  >
                    {sample.disease}
                  </p>
                </div>
              </div>

              {selectedSample?.id === sample.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-agri-cyan flex items-center justify-center z-10"
                >
                  <CheckCircle2 size={12} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Upload Own Image */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">{tr("orUpload")}</h3>
        <label className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-forest-border hover:border-agri-cyan/50 bg-forest-card/40 cursor-pointer transition-all touch-target">
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} />
          <Camera className="w-6 h-6 text-agri-cyan" />
          <span className="text-sm text-gray-300">{tr("uploadPhoto")} / {tr("takePicture")}</span>
          <Upload className="w-5 h-5 text-gray-500" />
        </label>
        {uploadedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2 text-agri-green text-sm">
            <ImageIcon size={16} /> Image loaded ✓
          </motion.div>
        )}
      </div>

      {/* Active Leaf Scanner Preview */}
      {(selectedSample || uploadedImage) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl bg-forest-card border-2 border-agri-cyan/50 p-4 glow-cyan"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-agri-cyan flex items-center gap-1.5 uppercase tracking-wide">
              <Camera size={14} /> Leaf Camera / Scanner
            </span>
            <span className="text-[11px] text-gray-300 bg-forest-bg/80 px-2.5 py-0.5 rounded-full border border-forest-border">
              {selectedSample ? `Sample: ${selectedSample.crop} - ${selectedSample.disease}` : "Custom Upload"}
            </span>
          </div>

          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-forest-bg/90 flex items-center justify-center border border-forest-border">
            <img
              src={selectedSample?.image || uploadedImage!}
              alt="Leaf to analyze"
              className="w-full h-full object-contain p-2"
            />

            {/* Reticle / Viewfinder markings */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-agri-cyan" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-agri-cyan" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-agri-cyan" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-agri-cyan" />

            {/* Laser scanning bar */}
            {isScanning && (
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-agri-cyan to-transparent shadow-lg shadow-agri-cyan"
                animate={{ top: ["5%", "92%", "5%"] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Voice Symptom Input */}
      <div className="bg-forest-card border border-agri-gold/30 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-agri-gold mb-3 flex items-center gap-2">
          🎤 {tr("voiceNote")}
        </h3>
        <div className="flex items-center gap-4">
          <MicButton
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            label={isListening ? tr("listening") : tr("tapToSpeak")}
          />
          <div className="flex-1">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={selectedSample?.voiceHint || "Describe symptoms..."}
              className="w-full bg-forest-bg/60 border border-forest-border rounded-xl p-3 text-sm text-gray-200 resize-none h-20 focus:border-agri-gold/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Diagnose Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        disabled={!canDiagnose || isScanning}
        onClick={handleDiagnose}
        className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all touch-target ${
          canDiagnose && !isScanning
            ? "bg-agri-green text-forest-bg hover:shadow-lg hover:shadow-agri-green/20"
            : "bg-forest-border text-gray-500 cursor-not-allowed"
        }`}
      >
        {isScanning ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" /> {tr("scanning")}
          </>
        ) : (
          <>
            <Zap className="w-6 h-6" /> {tr("diagnose")}
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
            {/* Disease Banner */}
            <div
              className={`rounded-2xl p-5 border-2 ${
                result.isHealthy
                  ? "border-agri-green/50 bg-agri-green/10 glow-green"
                  : "border-agri-red/50 bg-agri-red/10 glow-red"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {(selectedSample?.image || uploadedImage) && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-forest-border/80 bg-forest-bg/90 shrink-0 shadow">
                      <img
                        src={selectedSample?.image || uploadedImage!}
                        alt={result.diseaseName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {result.isHealthy ? (
                    <CheckCircle2 className="w-8 h-8 text-agri-green shrink-0" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-agri-red shrink-0" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{result.diseaseName}</h3>
                    <p className="text-sm text-gray-400">{result.cropName}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    result.isHealthy ? "bg-agri-green/20 text-agri-green" : "bg-agri-red/20 text-agri-red"
                  }`}
                >
                  {result.isHealthy ? tr("healthy") : tr("diseaseDetected")}
                </span>
              </div>

              {/* Severity Bar */}
              {!result.isHealthy && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{tr("severity")}</span>
                    <span className="font-bold text-white">{result.severity}%</span>
                  </div>
                  <div className="h-3 bg-forest-bg rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.severity}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        result.severity > 75
                          ? "bg-agri-red"
                          : result.severity > 50
                          ? "bg-agri-gold"
                          : "bg-agri-green"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Confidence Comparison */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-forest-bg/50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{tr("imageOnly")}</p>
                  <p className="text-2xl font-black text-agri-gold mt-1">{result.imageConfidence}%</p>
                  <div className="h-1.5 bg-forest-border rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.imageConfidence}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-agri-gold rounded-full"
                    />
                  </div>
                </div>
                <div className="bg-forest-bg/50 rounded-xl p-3 text-center border border-agri-green/20">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{tr("multimodal")}</p>
                  <p className="text-2xl font-black text-agri-green mt-1">{result.multimodalConfidence}%</p>
                  <div className="h-1.5 bg-forest-border rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.multimodalConfidence}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-full bg-agri-green rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Impact */}
            <div className="bg-forest-card border border-forest-border rounded-2xl p-4">
              <p className="text-sm text-gray-300">{result.weatherImpact}</p>
            </div>

            {/* Cure Steps */}
            {!result.isHealthy && (
              <div className="bg-forest-card border border-agri-green/20 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-agri-green mb-3 flex items-center gap-2">
                  💊 {tr("cure")}
                </h4>
                <div className="space-y-2">
                  {result.cureSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-3 p-3 bg-forest-bg/40 rounded-xl"
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-agri-green/20 text-agri-green flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                      <ChevronRight size={16} className="text-gray-600 shrink-0 mt-0.5" />
                    </motion.div>
                  ))}
                </div>
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
