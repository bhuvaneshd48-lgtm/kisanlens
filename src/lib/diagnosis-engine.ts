/* ────────── Crop Diagnosis Engine ────────── */
/* Simulates multimodal fusion: Visual Analysis + Voice Context + Weather Data */

import type { LeafSample } from "./constants";
import type { WeatherData } from "./weather";

export interface DiagnosisResult {
  cropName: string;
  diseaseName: string;
  severity: number;
  imageConfidence: number;
  multimodalConfidence: number;
  cureSteps: string[];
  isHealthy: boolean;
  weatherImpact: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export function runDiagnosis(
  sample: LeafSample,
  voiceSymptom: string,
  weather: WeatherData | null
): DiagnosisResult {
  let { severity, imageConfidence, multimodalConfidence } = sample;

  // Voice context boosts confidence
  const hasVoice = voiceSymptom.trim().length > 0;
  if (hasVoice) {
    multimodalConfidence = Math.min(98, multimodalConfidence + 3);
  }

  // Weather impact analysis
  let weatherImpact = "Normal conditions — standard treatment advised.";
  if (weather) {
    if (weather.humidity > 80 && sample.disease !== "Healthy") {
      severity = Math.min(100, severity + 8);
      multimodalConfidence = Math.min(99, multimodalConfidence + 2);
      weatherImpact = `⚠️ High humidity (${weather.humidity}%) accelerates fungal spread. Increase spray frequency.`;
    }
    if (weather.rainfall > 10 && sample.disease !== "Healthy") {
      severity = Math.min(100, severity + 5);
      weatherImpact = `⚠️ Recent rainfall (${weather.rainfall}mm) may wash off sprays. Re-apply after rain stops.`;
    }
    if (weather.temperature > 35 && sample.disease !== "Healthy") {
      weatherImpact = `⚠️ High temperature (${weather.temperature}°C). Spray early morning or late evening to avoid leaf burn.`;
    }
    if (sample.disease === "Healthy" && weather.humidity < 70) {
      weatherImpact = `✅ Good conditions (${weather.temperature}°C, ${weather.humidity}% humidity). Crop looks healthy.`;
    }
  }

  // Risk level
  let riskLevel: DiagnosisResult["riskLevel"] = "low";
  if (severity > 80) riskLevel = "critical";
  else if (severity > 60) riskLevel = "high";
  else if (severity > 30) riskLevel = "medium";

  return {
    cropName: sample.crop,
    diseaseName: sample.disease,
    severity,
    imageConfidence,
    multimodalConfidence,
    cureSteps: sample.cureSteps,
    isHealthy: sample.disease === "Healthy",
    weatherImpact,
    riskLevel,
  };
}

/** Generate a diagnosis for an uploaded (unknown) image */
export function runUploadDiagnosis(
  voiceSymptom: string,
  weather: WeatherData | null
): DiagnosisResult {
  // Simulate analysis of an unknown upload
  const diseases = [
    { name: "Leaf Spot", crop: "Unknown Crop", severity: 55, cure: ["Remove spotted leaves", "Apply copper-based fungicide", "Ensure proper spacing"] },
    { name: "Powdery Mildew", crop: "Unknown Crop", severity: 48, cure: ["Apply Sulphur WP 80% (3g/L)", "Improve ventilation", "Remove affected parts"] },
    { name: "Nutrient Deficiency", crop: "Unknown Crop", severity: 35, cure: ["Apply balanced NPK fertilizer", "Check soil pH", "Add organic matter"] },
  ];
  const pick = diseases[Math.floor(Math.random() * diseases.length)];
  const imageConf = 58 + Math.floor(Math.random() * 15);
  const multiConf = imageConf + 15 + Math.floor(Math.random() * 8);

  let weatherImpact = "Upload analyzed. For best results, use preset samples.";
  if (weather && weather.humidity > 75) {
    weatherImpact = `Humidity is ${weather.humidity}%. Fungal diseases spread faster — act quickly.`;
  }

  return {
    cropName: pick.crop,
    diseaseName: pick.name,
    severity: pick.severity,
    imageConfidence: imageConf,
    multimodalConfidence: Math.min(97, multiConf),
    cureSteps: pick.cure,
    isHealthy: false,
    weatherImpact,
    riskLevel: pick.severity > 60 ? "high" : "medium",
  };
}
