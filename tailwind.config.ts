import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          bg: "#0B1911",
          card: "#132A1E",
          border: "#1E3F2D",
          light: "#2A5A3F",
        },
        agri: {
          green: "#10B981",
          gold: "#F59E0B",
          cyan: "#06B6D4",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 2s ease-in-out infinite",
        "mic-wave": "micWave 1.5s ease-in-out infinite",
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
        micWave: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
