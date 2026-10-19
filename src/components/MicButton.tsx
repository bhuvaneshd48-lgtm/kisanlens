"use client";

import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface Props {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  label?: string;
}

export default function MicButton({ isListening, onStart, onStop, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Pulsing rings when active */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-agri-gold/30"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-agri-gold/20"
              animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeOut" }}
            />
          </>
        )}

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={isListening ? onStop : onStart}
          className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all touch-target ${
            isListening
              ? "bg-agri-gold text-forest-bg shadow-lg shadow-agri-gold/30 mic-active"
              : "bg-forest-card border-2 border-agri-gold/40 text-agri-gold hover:bg-agri-gold/10"
          }`}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              <MicOff size={28} />
            </motion.div>
          ) : (
            <Mic size={28} />
          )}
        </motion.button>
      </div>
      {label && (
        <span className={`text-xs font-medium ${isListening ? "text-agri-gold" : "text-gray-400"}`}>
          {label}
        </span>
      )}
    </div>
  );
}
