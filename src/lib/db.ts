import Dexie, { type EntityTable } from "dexie";

/* ────────── Type Definitions ────────── */

export interface DiagnosisRecord {
  id?: number;
  cropName: string;
  diseaseName: string;
  severity: number;
  imageConfidence: number;
  multimodalConfidence: number;
  weatherTemp: number;
  weatherHumidity: number;
  weatherRainfall: number;
  voiceSymptom: string;
  cureSteps: string;
  language: string;
  timestamp: number;
}

export interface PesticideScan {
  id?: number;
  productName: string;
  composition: string;
  capfuls: number;
  mlPerCap: number;
  tankLitres: number;
  sprayTime: string;
  safetyGear: string;
  isAuthentic: boolean;
  language: string;
  timestamp: number;
}

export interface SoilAdvisory {
  id?: number;
  soilType: string;
  previousCrop: string;
  weatherTemp: number;
  weatherHumidity: number;
  weatherSoilMoisture: number;
  weatherRainfall: number;
  recommendations: string;
  language: string;
  timestamp: number;
}

/* ────────── Database Class ────────── */

class KisanLensDB extends Dexie {
  diagnosisRecords!: EntityTable<DiagnosisRecord, "id">;
  pesticideScans!: EntityTable<PesticideScan, "id">;
  soilAdvisories!: EntityTable<SoilAdvisory, "id">;

  constructor() {
    super("KisanLensDB");
    this.version(1).stores({
      diagnosisRecords: "++id, cropName, diseaseName, timestamp",
      pesticideScans: "++id, productName, timestamp",
      soilAdvisories: "++id, soilType, previousCrop, timestamp",
    });
  }
}

export const db = new KisanLensDB();

/* ────────── Seed Historical Records ────────── */

export async function seedDatabase() {
  const diagCount = await db.diagnosisRecords.count();
  if (diagCount > 0) return; // Already seeded

  const now = Date.now();
  const day = 86400000;

  await db.diagnosisRecords.bulkAdd([
    {
      cropName: "Tomato",
      diseaseName: "Early Blight",
      severity: 72,
      imageConfidence: 74,
      multimodalConfidence: 94,
      weatherTemp: 28,
      weatherHumidity: 78,
      weatherRainfall: 12,
      voiceSymptom: "Black spots on lower leaves for 5 days",
      cureSteps: JSON.stringify(["Remove affected leaves", "Apply Mancozeb 75% WP (2g/L)", "Improve air circulation", "Avoid overhead irrigation"]),
      language: "en",
      timestamp: now - 7 * day,
    },
    {
      cropName: "Rice",
      diseaseName: "Rice Blast",
      severity: 85,
      imageConfidence: 68,
      multimodalConfidence: 91,
      weatherTemp: 30,
      weatherHumidity: 88,
      weatherRainfall: 35,
      voiceSymptom: "Diamond shaped spots with grey center",
      cureSteps: JSON.stringify(["Apply Tricyclazole 75% WP (0.6g/L)", "Reduce nitrogen application", "Maintain field drainage", "Use resistant varieties next season"]),
      language: "en",
      timestamp: now - 5 * day,
    },
    {
      cropName: "Chilli",
      diseaseName: "Leaf Curl Virus",
      severity: 65,
      imageConfidence: 71,
      multimodalConfidence: 92,
      weatherTemp: 32,
      weatherHumidity: 65,
      weatherRainfall: 0,
      voiceSymptom: "Leaves curling upward for 3 days",
      cureSteps: JSON.stringify(["Spray Imidacloprid 17.8% SL to control whitefly vector", "Remove and destroy severely infected plants", "Use yellow sticky traps", "Apply Neem oil as preventive"]),
      language: "en",
      timestamp: now - 3 * day,
    },
    {
      cropName: "Tomato",
      diseaseName: "Healthy",
      severity: 0,
      imageConfidence: 88,
      multimodalConfidence: 97,
      weatherTemp: 26,
      weatherHumidity: 60,
      weatherRainfall: 5,
      voiceSymptom: "No symptoms, checking routine health",
      cureSteps: JSON.stringify(["Continue current practices", "Monitor for pests weekly", "Maintain proper irrigation schedule"]),
      language: "en",
      timestamp: now - 1 * day,
    },
  ]);

  await db.pesticideScans.bulkAdd([
    {
      productName: "Imidacloprid 17.8% SL",
      composition: "Imidacloprid 17.8% w/w SL",
      capfuls: 1,
      mlPerCap: 10,
      tankLitres: 15,
      sprayTime: "Morning (6-9 AM)",
      safetyGear: JSON.stringify(["Gloves", "Face Mask", "Full Sleeves"]),
      isAuthentic: true,
      language: "en",
      timestamp: now - 6 * day,
    },
    {
      productName: "Mancozeb 75% WP",
      composition: "Mancozeb 75% w/w WP",
      capfuls: 3,
      mlPerCap: 10,
      tankLitres: 15,
      sprayTime: "Evening (4-6 PM)",
      safetyGear: JSON.stringify(["Gloves", "Face Mask", "Goggles"]),
      isAuthentic: true,
      language: "en",
      timestamp: now - 4 * day,
    },
  ]);

  await db.soilAdvisories.bulkAdd([
    {
      soilType: "Red Soil",
      previousCrop: "Tomato",
      weatherTemp: 28,
      weatherHumidity: 70,
      weatherSoilMoisture: 42,
      weatherRainfall: 15,
      recommendations: JSON.stringify([
        { crop: "Ragi (Finger Millet)", profitPerAcre: 35000, waterNeed: 2, harvestDays: 110, nitrogenBenefit: "Moderate N-fixation via crop rotation" },
        { crop: "Groundnut", profitPerAcre: 42000, waterNeed: 3, harvestDays: 120, nitrogenBenefit: "High N-fixation (legume)" },
        { crop: "Sunflower", profitPerAcre: 30000, waterNeed: 2, harvestDays: 95, nitrogenBenefit: "Low — needs supplemental N" },
      ]),
      language: "en",
      timestamp: now - 2 * day,
    },
  ]);
}
