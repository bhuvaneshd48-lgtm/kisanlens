"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  text: string;
  lang: string;
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function SpeakButton({
  text,
  lang,
  speak,
  isSpeaking,
  stopSpeaking,
  label = "🔊 Speak Aloud",
  size = "md",
}: Props) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const iconSize = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => {
        if (isSpeaking) {
          stopSpeaking();
        } else {
          speak(text, lang);
        }
      }}
      className={`flex items-center rounded-full font-semibold transition-all touch-target ${
        sizeClasses[size]
      } ${
        isSpeaking
          ? "bg-agri-gold/20 text-agri-gold border border-agri-gold/40"
          : "bg-agri-green/15 text-agri-green border border-agri-green/30 hover:bg-agri-green/25"
      }`}
    >
      {isSpeaking ? (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <VolumeX size={iconSize[size]} />
          </motion.div>
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 size={iconSize[size]} />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
}
