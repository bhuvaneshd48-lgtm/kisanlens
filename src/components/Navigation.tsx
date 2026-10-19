"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  FlaskConical,
  Mountain,
  TrendingUp,
  Database,
  BarChart3,
} from "lucide-react";

export type TabId = "crop-doctor" | "pesticide" | "soil" | "mandi" | "database" | "ieee";

interface Props {
  active: TabId;
  onTabChange: (tab: TabId) => void;
  tr: (key: string) => string;
}

const TABS: {
  id: TabId;
  icon: React.ComponentType<any>;
  labelKey: string;
  color: string;
  emoji: string;
}[] = [
  { id: "crop-doctor", icon: Leaf, labelKey: "cropDoctor", color: "text-agri-green", emoji: "🌿" },
  { id: "pesticide", icon: FlaskConical, labelKey: "pesticideScanner", color: "text-agri-cyan", emoji: "🧴" },
  { id: "soil", icon: Mountain, labelKey: "soilAdvisor", color: "text-agri-gold", emoji: "🌍" },
  { id: "mandi", icon: TrendingUp, labelKey: "mandiRadar", color: "text-agri-green", emoji: "📊" },
  { id: "database", icon: Database, labelKey: "database", color: "text-agri-cyan", emoji: "🗄️" },
  { id: "ieee", icon: BarChart3, labelKey: "ieee", color: "text-purple-400", emoji: "📊" },
];

export default function Navigation({ active, onTabChange, tr }: Props) {
  return (
    <nav className="w-full overflow-x-auto scrollbar-none">
      <div className="flex gap-2 px-1 py-2 min-w-max">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap touch-target ${
                isActive
                  ? `bg-forest-card border-2 border-agri-green/50 ${tab.color} shadow-lg`
                  : "bg-forest-card/50 border border-forest-border text-gray-400 hover:text-gray-200 hover:border-forest-light"
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              <Icon size={18} />
              <span className="hidden sm:inline">{tr(tab.labelKey)}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
