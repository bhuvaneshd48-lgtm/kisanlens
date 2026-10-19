/* ────────── Pesticide Data & Dosage Engine ────────── */

import type { PesticidePreset } from "./constants";

export interface DosageResult {
  productName: string;
  composition: string;
  isAuthentic: boolean;
  type: string;
  dosageVisual: {
    capfuls: number;
    mlPerCap: number;
    totalMl: number;
    tankLitres: number;
    waterRatio: string;
  };
  sprayTime: string;
  sprayTimeIcon: string;
  safetyGear: string[];
  safetyLevel: string;
  safetyColor: string;
  waitingPeriodDays: number;
  targetPests: string[];
  applicationMethod: string;
  warnings: string[];
  isFertilizer: boolean;
  fertilizerDosage?: {
    kgPerAcre: number;
    splits: string[];
    method: string;
  };
}

export function calculateDosage(preset: PesticidePreset): DosageResult {
  const isFertilizer = preset.type === "fertilizer";

  const sprayTimeIcon = preset.sprayTime === "morning" ? "🌅" : "🌆";
  const sprayTimeLabel = preset.sprayTime === "morning" ? "Morning (6-9 AM)" : "Evening (4-6 PM)";

  let safetyColor = "#10B981"; // green
  if (preset.safetyLevel === "medium") safetyColor = "#F59E0B";
  if (preset.safetyLevel === "high") safetyColor = "#EF4444";

  const warnings: string[] = [];
  if (preset.safetyLevel === "high") {
    warnings.push("⚠️ Highly toxic — keep away from children and animals");
    warnings.push("⚠️ Do not eat, drink, or smoke while handling");
    warnings.push(`⚠️ Wait ${preset.waitingPeriodDays} days before harvesting`);
  }
  if (preset.safetyLevel === "medium") {
    warnings.push(`⚠️ Wait ${preset.waitingPeriodDays} days before harvesting`);
    warnings.push("⚠️ Wash hands thoroughly after use");
  }
  if (preset.type === "organic") {
    warnings.push("✅ Organic — safe for immediate harvest");
  }

  let applicationMethod = "Foliar spray with knapsack sprayer";
  if (isFertilizer) {
    applicationMethod = "Broadcast application / Top dressing";
  }

  const result: DosageResult = {
    productName: preset.name,
    composition: preset.composition,
    isAuthentic: true,
    type: preset.type,
    dosageVisual: {
      capfuls: preset.capfuls,
      mlPerCap: preset.mlPerCap,
      totalMl: preset.totalMl,
      tankLitres: preset.tankLitres,
      waterRatio: isFertilizer ? "N/A" : `${preset.totalMl}ml in ${preset.tankLitres}L water`,
    },
    sprayTime: sprayTimeLabel,
    sprayTimeIcon,
    safetyGear: preset.safetyGear,
    safetyLevel: preset.safetyLevel,
    safetyColor,
    waitingPeriodDays: preset.waitingPeriodDays,
    targetPests: preset.targetPests,
    applicationMethod,
    warnings,
    isFertilizer,
  };

  if (isFertilizer) {
    result.fertilizerDosage = {
      kgPerAcre: 50,
      splits: [
        "1st Split: 25 kg at sowing/transplanting",
        "2nd Split: 15 kg at 30 days after sowing",
        "3rd Split: 10 kg at flowering stage",
      ],
      method: "Broadcast evenly and irrigate immediately",
    };
  }

  return result;
}
