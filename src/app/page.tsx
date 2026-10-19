"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useVoice } from "@/hooks/useVoice";
import { seedDatabase } from "@/lib/db";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Navigation, { type TabId } from "@/components/Navigation";
import CropDoctor from "@/components/CropDoctor";
import PesticideScanner from "@/components/PesticideScanner";
import SoilAdvisor from "@/components/SoilAdvisor";
import MandiRadar from "@/components/MandiRadar";
import DatabaseView from "@/components/DatabaseView";
import IEEEDashboard from "@/components/IEEEDashboard";

export default function Home() {
  const { lang, setLang, tr, speechCode } = useLanguage();
  const {
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    stopSpeaking,
  } = useVoice(speechCode);

  const [activeTab, setActiveTab] = useState<TabId>("crop-doctor");
  const [isOnline, setIsOnline] = useState(true);
  const [dbReady, setDbReady] = useState(false);

  // Seed database on mount
  useEffect(() => {
    seedDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error("DB seed error:", err);
        setDbReady(true); // Continue anyway
      });
  }, []);

  // Online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-forest-bg">
      {/* ──── Top Bar ──── */}
      <header className="sticky top-0 z-50 bg-forest-bg/95 backdrop-blur-sm border-b border-forest-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* App Name + Language */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <Sprout className="w-8 h-8 text-agri-green" />
              </motion.div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">{tr("appName")}</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">{tr("appTagline")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Online indicator */}
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-agri-green" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-agri-red" />
                )}
                <span className={`text-[9px] font-medium ${isOnline ? "text-agri-green" : "text-agri-red"}`}>
                  {isOnline ? "LIVE" : "OFFLINE"}
                </span>
              </div>

              <LanguageSwitcher lang={lang} onChangeLang={setLang} />
            </div>
          </div>

          {/* Navigation */}
          <Navigation active={activeTab} onTabChange={setActiveTab} tr={tr} />
        </div>
      </header>

      {/* ──── Main Content ──── */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "crop-doctor" && (
            <motion.div key="crop-doctor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CropDoctor
                tr={tr}
                lang={lang}
                speechCode={speechCode}
                speak={speak}
                isSpeaking={isSpeaking}
                stopSpeaking={stopSpeaking}
                isListening={isListening}
                transcript={transcript}
                setTranscript={setTranscript}
                startListening={startListening}
                stopListening={stopListening}
              />
            </motion.div>
          )}

          {activeTab === "pesticide" && (
            <motion.div key="pesticide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PesticideScanner
                tr={tr}
                lang={lang}
                speechCode={speechCode}
                speak={speak}
                isSpeaking={isSpeaking}
                stopSpeaking={stopSpeaking}
              />
            </motion.div>
          )}

          {activeTab === "soil" && (
            <motion.div key="soil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SoilAdvisor
                tr={tr}
                lang={lang}
                speechCode={speechCode}
                speak={speak}
                isSpeaking={isSpeaking}
                stopSpeaking={stopSpeaking}
              />
            </motion.div>
          )}

          {activeTab === "mandi" && (
            <motion.div key="mandi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MandiRadar
                tr={tr}
                lang={lang}
                speechCode={speechCode}
                speak={speak}
                isSpeaking={isSpeaking}
                stopSpeaking={stopSpeaking}
              />
            </motion.div>
          )}

          {activeTab === "database" && (
            <motion.div key="database" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DatabaseView tr={tr} />
            </motion.div>
          )}

          {activeTab === "ieee" && (
            <motion.div key="ieee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IEEEDashboard tr={tr} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ──── Footer ──── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-forest-bg/95 backdrop-blur-sm border-t border-forest-border py-2">
        <p className="text-center text-[9px] text-gray-600">
          KisanLens v1.0 — Zero-Text Agricultural AI • Built for Indian Farmers 🇮🇳
        </p>
      </footer>
    </div>
  );
}
