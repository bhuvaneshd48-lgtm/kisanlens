"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/i18n";

interface Props {
  lang: Language;
  onChangeLang: (l: Language) => void;
}

export default function LanguageSwitcher({ lang, onChangeLang }: Props) {
  return (
    <div className="flex items-center gap-1.5 bg-forest-card border border-forest-border rounded-full px-2 py-1 max-w-[240px] sm:max-w-none overflow-x-auto scrollbar-none">
      <Globe className="w-4 h-4 text-agri-cyan shrink-0 ml-1" />
      {LANGUAGES.map((l) => (
        <motion.button
          key={l.code}
          whileTap={{ scale: 0.92 }}
          onClick={() => onChangeLang(l.code)}
          title={l.label}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap touch-target shrink-0 ${
            lang === l.code
              ? "bg-agri-cyan text-forest-bg shadow-sm"
              : "text-gray-400 hover:text-white hover:bg-forest-border"
          }`}
        >
          {l.flag} {l.shortLabel}
        </motion.button>
      ))}
    </div>
  );
}
