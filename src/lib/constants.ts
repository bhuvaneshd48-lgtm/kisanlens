/* ────────── Preset Leaf Samples ────────── */

export interface LeafSample {
  id: string;
  crop: string;
  disease: string;
  emoji: string;
  color: string;
  gradient: string;
  image: string;
  severity: number;
  imageConfidence: number;
  multimodalConfidence: number;
  cureSteps: string[];
  voiceHint: string;
}

export const LEAF_SAMPLES: LeafSample[] = [
  {
    id: "tomato-early-blight",
    crop: "Tomato",
    disease: "Early Blight",
    emoji: "🍅",
    color: "#EF4444",
    gradient: "from-red-900/40 to-yellow-900/20",
    image: "/samples/tomato-early-blight.svg",
    severity: 72,
    imageConfidence: 74,
    multimodalConfidence: 94,
    cureSteps: [
      "Remove affected lower leaves immediately",
      "Apply Mancozeb 75% WP — 2g per litre of water",
      "Improve air circulation between plants",
      "Avoid overhead irrigation — use drip",
      "Apply Trichoderma bio-fungicide as preventive",
    ],
    voiceHint: "Black spots on lower leaves, spreading upward for 5 days",
  },
  {
    id: "rice-blast",
    crop: "Rice",
    disease: "Rice Blast",
    emoji: "🌾",
    color: "#F59E0B",
    gradient: "from-amber-900/40 to-orange-900/20",
    image: "/samples/rice-blast.svg",
    severity: 85,
    imageConfidence: 68,
    multimodalConfidence: 91,
    cureSteps: [
      "Apply Tricyclazole 75% WP — 0.6g per litre",
      "Reduce nitrogen fertilizer application by 25%",
      "Ensure proper field drainage",
      "Use blast-resistant rice varieties next season (e.g., IR-64)",
      "Spray Carbendazim 50% WP as backup treatment",
    ],
    voiceHint: "Diamond shaped grey spots on rice leaves after heavy rain",
  },
  {
    id: "chilli-leaf-curl",
    crop: "Chilli",
    disease: "Leaf Curl Virus",
    emoji: "🌶️",
    color: "#EF4444",
    gradient: "from-red-900/40 to-pink-900/20",
    image: "/samples/chilli-leaf-curl.svg",
    severity: 65,
    imageConfidence: 71,
    multimodalConfidence: 92,
    cureSteps: [
      "Spray Imidacloprid 17.8% SL to control whitefly vector",
      "Remove and destroy severely infected plants",
      "Install yellow sticky traps (20 per acre)",
      "Apply Neem oil 1500 ppm as preventive spray",
      "Transplant only healthy, virus-free seedlings",
    ],
    voiceHint: "Leaves curling upward, plant stunted for 3 days",
  },
  {
    id: "healthy-leaf",
    crop: "Tomato",
    disease: "Healthy",
    emoji: "🍃",
    color: "#10B981",
    gradient: "from-emerald-900/40 to-green-900/20",
    image: "/samples/healthy-leaf.svg",
    severity: 0,
    imageConfidence: 88,
    multimodalConfidence: 97,
    cureSteps: [
      "Continue current farming practices",
      "Monitor weekly for early pest signs",
      "Maintain proper drip irrigation schedule",
      "Apply organic compost every 15 days",
    ],
    voiceHint: "No symptoms, checking general plant health",
  },
];

/* ────────── Pesticide Presets ────────── */

export interface PesticidePreset {
  id: string;
  name: string;
  composition: string;
  emoji: string;
  type: "insecticide" | "fungicide" | "organic" | "fertilizer";
  color: string;
  capfuls: number;
  mlPerCap: number;
  totalMl: number;
  tankLitres: number;
  sprayTime: "morning" | "evening";
  safetyGear: string[];
  safetyLevel: "low" | "medium" | "high";
  waitingPeriodDays: number;
  targetPests: string[];
}

export const PESTICIDE_PRESETS: PesticidePreset[] = [
  {
    id: "imidacloprid",
    name: "Imidacloprid 17.8% SL",
    composition: "Imidacloprid 17.8% w/w, Solvent 82.2% w/w",
    emoji: "🧴",
    type: "insecticide",
    color: "#06B6D4",
    capfuls: 1,
    mlPerCap: 10,
    totalMl: 10,
    tankLitres: 15,
    sprayTime: "morning",
    safetyGear: ["Rubber Gloves", "Face Mask (N95)", "Full Sleeves", "Gumboots"],
    safetyLevel: "high",
    waitingPeriodDays: 14,
    targetPests: ["Whitefly", "Aphids", "Jassids", "Thrips"],
  },
  {
    id: "mancozeb",
    name: "Mancozeb 75% WP",
    composition: "Mancozeb 75% w/w, Inert carrier 25% w/w",
    emoji: "🧪",
    type: "fungicide",
    color: "#F59E0B",
    capfuls: 3,
    mlPerCap: 10,
    totalMl: 30,
    tankLitres: 15,
    sprayTime: "evening",
    safetyGear: ["Rubber Gloves", "Face Mask", "Goggles", "Full Sleeves"],
    safetyLevel: "medium",
    waitingPeriodDays: 7,
    targetPests: ["Early Blight", "Late Blight", "Downy Mildew", "Anthracnose"],
  },
  {
    id: "neem-oil",
    name: "Organic Neem Oil 1500 PPM",
    composition: "Azadirachtin 0.15% (1500 ppm), Neem Oil 99.85%",
    emoji: "🌿",
    type: "organic",
    color: "#10B981",
    capfuls: 5,
    mlPerCap: 10,
    totalMl: 50,
    tankLitres: 15,
    sprayTime: "evening",
    safetyGear: ["Basic Gloves"],
    safetyLevel: "low",
    waitingPeriodDays: 0,
    targetPests: ["Aphids", "Whitefly", "Mites", "Leaf Miners", "General Pest Repellent"],
  },
  {
    id: "urea",
    name: "Urea (46% N)",
    composition: "Nitrogen 46%, Biuret < 1.5%",
    emoji: "🪨",
    type: "fertilizer",
    color: "#8B5CF6",
    capfuls: 0,
    mlPerCap: 0,
    totalMl: 0,
    tankLitres: 0,
    sprayTime: "morning",
    safetyGear: ["Basic Gloves"],
    safetyLevel: "low",
    waitingPeriodDays: 0,
    targetPests: [],
  },
];

/* ────────── Soil Types ────────── */

export interface SoilType {
  id: string;
  name: string;
  emoji: string;
  color: string;
  ph: string;
  traits: string[];
}

export const SOIL_TYPES: SoilType[] = [
  {
    id: "red",
    name: "Red Soil",
    emoji: "🟤",
    color: "#DC2626",
    ph: "5.5 - 6.5",
    traits: ["Iron-rich", "Well-drained", "Low in Nitrogen", "Common in Karnataka Plateau"],
  },
  {
    id: "black-cotton",
    name: "Black Cotton Soil",
    emoji: "⬛",
    color: "#374151",
    ph: "7.2 - 8.5",
    traits: ["High clay content", "Retains moisture", "Rich in Calcium & Magnesium", "Cracks when dry"],
  },
  {
    id: "sandy-loam",
    name: "Sandy Loam",
    emoji: "🟡",
    color: "#D97706",
    ph: "6.0 - 7.0",
    traits: ["Good drainage", "Easy to till", "Moderate fertility", "Warms quickly"],
  },
];

/* ────────── Previous Crops ────────── */

export interface CropOption {
  id: string;
  name: string;
  emoji: string;
}

export const PREVIOUS_CROPS: CropOption[] = [
  { id: "tomato", name: "Tomato", emoji: "🍅" },
  { id: "paddy", name: "Paddy / Rice", emoji: "🌾" },
  { id: "ragi", name: "Ragi (Finger Millet)", emoji: "🌿" },
  { id: "groundnut", name: "Groundnut", emoji: "🥜" },
];

/* ────────── Mandi Crops ────────── */

export const MANDI_CROPS: CropOption[] = [
  { id: "tomato", name: "Tomato", emoji: "🍅" },
  { id: "onion", name: "Onion", emoji: "🧅" },
  { id: "potato", name: "Potato", emoji: "🥔" },
  { id: "rice", name: "Rice", emoji: "🌾" },
  { id: "chilli", name: "Chilli", emoji: "🌶️" },
];

/* ────────── Mandi Info ────────── */

export interface MandiInfo {
  id: string;
  name: string;
  distanceKm: number;
}

export const MANDIS: MandiInfo[] = [
  { id: "chickballapur", name: "Chickballapur Local Mandi", distanceKm: 18 },
  { id: "kolar", name: "Kolar APMC", distanceKm: 65 },
  { id: "yeshwanthpur", name: "Bengaluru Yeshwanthpur APMC", distanceKm: 55 },
];

export const TRANSPORT_COST_PER_KM_PER_QUINTAL = 15; // ₹15/km per quintal
