/* ────────── Zero-Lab Soil & Crop Advisor Engine ────────── */

import type { WeatherData } from "./weather";

export interface CropRecommendation {
  crop: string;
  emoji: string;
  profitPerAcre: number;
  waterNeed: number;     // 1-5 scale
  harvestDays: number;
  nitrogenBenefit: string;
  suitabilityScore: number; // 0-100
}

export interface SoilAdvisoryResult {
  soilType: string;
  previousCrop: string;
  recommendations: CropRecommendation[];
  soilHealth: string;
  rotationAdvice: string;
}

// Knowledge base: crop suitability by soil × previous crop × weather
const CROP_DATABASE: Record<string, CropRecommendation[]> = {
  "red|tomato": [
    { crop: "Ragi (Finger Millet)", emoji: "🌿", profitPerAcre: 35000, waterNeed: 2, harvestDays: 110, nitrogenBenefit: "Moderate — improves soil structure", suitabilityScore: 88 },
    { crop: "Groundnut", emoji: "🥜", profitPerAcre: 42000, waterNeed: 3, harvestDays: 120, nitrogenBenefit: "High N-fixation (legume crop)", suitabilityScore: 85 },
    { crop: "Sunflower", emoji: "🌻", profitPerAcre: 30000, waterNeed: 2, harvestDays: 95, nitrogenBenefit: "Low — needs supplemental N", suitabilityScore: 78 },
  ],
  "red|paddy": [
    { crop: "Green Gram (Moong)", emoji: "🫘", profitPerAcre: 38000, waterNeed: 2, harvestDays: 65, nitrogenBenefit: "Very High N-fixation (pulse)", suitabilityScore: 92 },
    { crop: "Maize", emoji: "🌽", profitPerAcre: 32000, waterNeed: 3, harvestDays: 100, nitrogenBenefit: "Low — heavy N feeder", suitabilityScore: 80 },
    { crop: "Sesame", emoji: "🌰", profitPerAcre: 28000, waterNeed: 1, harvestDays: 90, nitrogenBenefit: "Moderate — drought tolerant", suitabilityScore: 75 },
  ],
  "red|ragi": [
    { crop: "Tomato", emoji: "🍅", profitPerAcre: 65000, waterNeed: 4, harvestDays: 75, nitrogenBenefit: "Low — but high cash value", suitabilityScore: 90 },
    { crop: "Chilli", emoji: "🌶️", profitPerAcre: 55000, waterNeed: 3, harvestDays: 90, nitrogenBenefit: "Low — good market price", suitabilityScore: 85 },
    { crop: "Groundnut", emoji: "🥜", profitPerAcre: 42000, waterNeed: 3, harvestDays: 120, nitrogenBenefit: "High N-fixation (legume)", suitabilityScore: 82 },
  ],
  "red|groundnut": [
    { crop: "Ragi (Finger Millet)", emoji: "🌿", profitPerAcre: 35000, waterNeed: 2, harvestDays: 110, nitrogenBenefit: "Benefits from residual N", suitabilityScore: 91 },
    { crop: "Tomato", emoji: "🍅", profitPerAcre: 65000, waterNeed: 4, harvestDays: 75, nitrogenBenefit: "Excellent — uses legume N residue", suitabilityScore: 88 },
    { crop: "Chilli", emoji: "🌶️", profitPerAcre: 55000, waterNeed: 3, harvestDays: 90, nitrogenBenefit: "Good — benefits from N fixation", suitabilityScore: 84 },
  ],
  "black-cotton|tomato": [
    { crop: "Cotton", emoji: "🧶", profitPerAcre: 48000, waterNeed: 4, harvestDays: 160, nitrogenBenefit: "Moderate — classic black soil crop", suitabilityScore: 93 },
    { crop: "Soybean", emoji: "🫘", profitPerAcre: 40000, waterNeed: 3, harvestDays: 100, nitrogenBenefit: "Very High N-fixation", suitabilityScore: 89 },
    { crop: "Sorghum (Jowar)", emoji: "🌾", profitPerAcre: 28000, waterNeed: 2, harvestDays: 110, nitrogenBenefit: "Low — but drought resistant", suitabilityScore: 80 },
  ],
  "black-cotton|paddy": [
    { crop: "Chickpea (Gram)", emoji: "🫘", profitPerAcre: 45000, waterNeed: 2, harvestDays: 100, nitrogenBenefit: "Very High N-fixation (pulse)", suitabilityScore: 94 },
    { crop: "Safflower", emoji: "🌻", profitPerAcre: 32000, waterNeed: 1, harvestDays: 120, nitrogenBenefit: "Low — oilseed crop", suitabilityScore: 82 },
    { crop: "Wheat", emoji: "🌾", profitPerAcre: 38000, waterNeed: 3, harvestDays: 120, nitrogenBenefit: "Low — needs N application", suitabilityScore: 78 },
  ],
  "black-cotton|ragi": [
    { crop: "Cotton", emoji: "🧶", profitPerAcre: 48000, waterNeed: 4, harvestDays: 160, nitrogenBenefit: "Moderate — ideal for black soil", suitabilityScore: 91 },
    { crop: "Pigeon Pea (Tur)", emoji: "🫘", profitPerAcre: 44000, waterNeed: 2, harvestDays: 150, nitrogenBenefit: "High N-fixation", suitabilityScore: 87 },
    { crop: "Maize", emoji: "🌽", profitPerAcre: 34000, waterNeed: 3, harvestDays: 100, nitrogenBenefit: "Low — heavy feeder", suitabilityScore: 79 },
  ],
  "black-cotton|groundnut": [
    { crop: "Sorghum (Jowar)", emoji: "🌾", profitPerAcre: 28000, waterNeed: 2, harvestDays: 110, nitrogenBenefit: "Benefits from legume N residue", suitabilityScore: 88 },
    { crop: "Cotton", emoji: "🧶", profitPerAcre: 48000, waterNeed: 4, harvestDays: 160, nitrogenBenefit: "Excellent after groundnut", suitabilityScore: 92 },
    { crop: "Sunflower", emoji: "🌻", profitPerAcre: 30000, waterNeed: 2, harvestDays: 95, nitrogenBenefit: "Moderate — oilseed rotation", suitabilityScore: 80 },
  ],
  "sandy-loam|tomato": [
    { crop: "Watermelon", emoji: "🍉", profitPerAcre: 55000, waterNeed: 4, harvestDays: 80, nitrogenBenefit: "Low — but high market value", suitabilityScore: 90 },
    { crop: "Groundnut", emoji: "🥜", profitPerAcre: 42000, waterNeed: 3, harvestDays: 120, nitrogenBenefit: "High N-fixation", suitabilityScore: 86 },
    { crop: "Carrot", emoji: "🥕", profitPerAcre: 50000, waterNeed: 3, harvestDays: 75, nitrogenBenefit: "Low — root crop", suitabilityScore: 83 },
  ],
  "sandy-loam|paddy": [
    { crop: "Groundnut", emoji: "🥜", profitPerAcre: 42000, waterNeed: 3, harvestDays: 120, nitrogenBenefit: "High N-fixation after rice", suitabilityScore: 91 },
    { crop: "Sweet Potato", emoji: "🍠", profitPerAcre: 38000, waterNeed: 2, harvestDays: 100, nitrogenBenefit: "Moderate — tuber crop", suitabilityScore: 84 },
    { crop: "Green Gram (Moong)", emoji: "🫘", profitPerAcre: 36000, waterNeed: 2, harvestDays: 65, nitrogenBenefit: "Very High N-fixation", suitabilityScore: 88 },
  ],
  "sandy-loam|ragi": [
    { crop: "Tomato", emoji: "🍅", profitPerAcre: 65000, waterNeed: 4, harvestDays: 75, nitrogenBenefit: "Low — high cash return", suitabilityScore: 89 },
    { crop: "Onion", emoji: "🧅", profitPerAcre: 52000, waterNeed: 3, harvestDays: 120, nitrogenBenefit: "Low — but stores well", suitabilityScore: 85 },
    { crop: "Cucumber", emoji: "🥒", profitPerAcre: 45000, waterNeed: 4, harvestDays: 55, nitrogenBenefit: "Low — fast harvest cycle", suitabilityScore: 81 },
  ],
  "sandy-loam|groundnut": [
    { crop: "Ragi (Finger Millet)", emoji: "🌿", profitPerAcre: 35000, waterNeed: 2, harvestDays: 110, nitrogenBenefit: "Uses residual N from groundnut", suitabilityScore: 90 },
    { crop: "Maize", emoji: "🌽", profitPerAcre: 34000, waterNeed: 3, harvestDays: 100, nitrogenBenefit: "Good — benefits from legume N", suitabilityScore: 85 },
    { crop: "Tomato", emoji: "🍅", profitPerAcre: 65000, waterNeed: 4, harvestDays: 75, nitrogenBenefit: "Excellent rotation after legume", suitabilityScore: 87 },
  ],
};

export function getSoilAdvisory(
  soilTypeId: string,
  previousCropId: string,
  weather: WeatherData | null
): SoilAdvisoryResult {
  const key = `${soilTypeId}|${previousCropId}`;
  let recommendations = CROP_DATABASE[key] || CROP_DATABASE["red|tomato"];

  // Adjust based on weather
  if (weather) {
    recommendations = recommendations.map((rec) => {
      let adjusted = { ...rec };
      // Penalize high-water crops if soil moisture is low
      if (weather.soilMoisture < 25 && rec.waterNeed >= 4) {
        adjusted.suitabilityScore = Math.max(50, adjusted.suitabilityScore - 10);
        adjusted.profitPerAcre = Math.round(adjusted.profitPerAcre * 0.85);
      }
      // Boost drought-tolerant crops if rainfall is low
      if (weather.rainfall < 5 && rec.waterNeed <= 2) {
        adjusted.suitabilityScore = Math.min(99, adjusted.suitabilityScore + 5);
      }
      // Temperature adjustments
      if (weather.temperature > 35 && rec.waterNeed >= 4) {
        adjusted.harvestDays = adjusted.harvestDays + 10; // Delayed harvest in heat
      }
      return adjusted;
    });
  }

  // Sort by suitability
  recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const soilNames: Record<string, string> = {
    red: "Red Soil",
    "black-cotton": "Black Cotton Soil",
    "sandy-loam": "Sandy Loam",
  };
  const cropNames: Record<string, string> = {
    tomato: "Tomato",
    paddy: "Paddy / Rice",
    ragi: "Ragi",
    groundnut: "Groundnut",
  };

  const rotationAdvice =
    previousCropId === "groundnut" || previousCropId === "ragi"
      ? "✅ Good rotation — previous legume/millet enriched soil nitrogen."
      : "💡 Consider planting a legume (Groundnut/Green Gram) next season to restore nitrogen.";

  const soilHealth =
    weather && weather.soilMoisture > 40
      ? `Soil moisture is adequate (${weather.soilMoisture}%). Good for transplanting.`
      : weather
      ? `Soil moisture is low (${weather.soilMoisture}%). Irrigate before planting.`
      : "Soil moisture data unavailable — check field manually.";

  return {
    soilType: soilNames[soilTypeId] || soilTypeId,
    previousCrop: cropNames[previousCropId] || previousCropId,
    recommendations,
    soilHealth,
    rotationAdvice,
  };
}
