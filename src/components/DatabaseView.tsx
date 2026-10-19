"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Trash2,
  Download,
  FileJson,
  FileSpreadsheet,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { db, type DiagnosisRecord, type PesticideScan, type SoilAdvisory } from "@/lib/db";

interface Props {
  tr: (key: string) => string;
}

type TableName = "diagnosisRecords" | "pesticideScans" | "soilAdvisories";

const TABLE_CONFIG: { id: TableName; label: string; emoji: string; color: string }[] = [
  { id: "diagnosisRecords", label: "Diagnosis Records", emoji: "🌿", color: "text-agri-green" },
  { id: "pesticideScans", label: "Pesticide Scans", emoji: "🧴", color: "text-agri-cyan" },
  { id: "soilAdvisories", label: "Soil Advisories", emoji: "🌍", color: "text-agri-gold" },
];

export default function DatabaseView({ tr }: Props) {
  const [activeTable, setActiveTable] = useState<TableName>("diagnosisRecords");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recordCount, setRecordCount] = useState<Record<TableName, number>>({
    diagnosisRecords: 0,
    pesticideScans: 0,
    soilAdvisories: 0,
  });

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const table = db.table(activeTable);
      const data = await table.orderBy("timestamp").reverse().toArray();
      setRecords(data);

      // Count all tables
      const counts: Record<TableName, number> = {
        diagnosisRecords: await db.diagnosisRecords.count(),
        pesticideScans: await db.pesticideScans.count(),
        soilAdvisories: await db.soilAdvisories.count(),
      };
      setRecordCount(counts);
    } catch (err) {
      console.error("Failed to load records:", err);
      setRecords([]);
    }
    setLoading(false);
  }, [activeTable]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function handleDelete(id: number) {
    try {
      await db.table(activeTable).delete(id);
      loadRecords();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function handleDeleteAll() {
    if (!confirm("Delete ALL records from this table?")) return;
    try {
      await db.table(activeTable).clear();
      loadRecords();
    } catch (err) {
      console.error("Delete all failed:", err);
    }
  }

  function exportData(format: "csv" | "json") {
    if (records.length === 0) return;

    let content: string;
    let mimeType: string;
    let ext: string;

    if (format === "json") {
      content = JSON.stringify(records, null, 2);
      mimeType = "application/json";
      ext = "json";
    } else {
      const headers = Object.keys(records[0]).join(",");
      const rows = records.map((r) =>
        Object.values(r)
          .map((v) => {
            const s = String(v);
            return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      );
      content = [headers, ...rows].join("\n");
      mimeType = "text/csv";
      ext = "csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kisanlens_${activeTable}_${new Date().toISOString().split("T")[0]}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatDate(ts: number): string {
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderDiagnosisRow(rec: DiagnosisRecord) {
    return (
      <motion.div
        key={rec.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-forest-bg/40 rounded-xl p-4 border border-forest-border"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              rec.diseaseName === "Healthy" ? "bg-agri-green/20 text-agri-green" : "bg-agri-red/20 text-agri-red"
            }`}>
              {rec.diseaseName}
            </span>
            <span className="text-xs text-gray-500 ml-2">{rec.cropName}</span>
          </div>
          <button
            onClick={() => handleDelete(rec.id!)}
            className="text-gray-500 hover:text-agri-red transition-colors p-1 touch-target"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-[11px]">
          <div><span className="text-gray-500">Severity:</span> <span className="font-bold text-white">{rec.severity}%</span></div>
          <div><span className="text-gray-500">Image:</span> <span className="font-bold text-agri-gold">{rec.imageConfidence}%</span></div>
          <div><span className="text-gray-500">Multi:</span> <span className="font-bold text-agri-green">{rec.multimodalConfidence}%</span></div>
          <div><span className="text-gray-500">Temp:</span> <span className="font-bold text-white">{rec.weatherTemp}°C</span></div>
        </div>
        {rec.voiceSymptom && (
          <p className="text-[10px] text-gray-500 mt-2 italic">🎤 &quot;{rec.voiceSymptom}&quot;</p>
        )}
        <p className="text-[10px] text-gray-600 mt-1">{formatDate(rec.timestamp)}</p>
      </motion.div>
    );
  }

  function renderPesticideRow(rec: PesticideScan) {
    return (
      <motion.div
        key={rec.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-forest-bg/40 rounded-xl p-4 border border-forest-border"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-agri-cyan">{rec.productName}</span>
            {rec.isAuthentic && <span className="ml-2 text-[10px] text-agri-green">✅ Verified</span>}
          </div>
          <button onClick={() => handleDelete(rec.id!)} className="text-gray-500 hover:text-agri-red p-1 touch-target">
            <Trash2 size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div><span className="text-gray-500">Caps:</span> <span className="font-bold text-white">{rec.capfuls}</span></div>
          <div><span className="text-gray-500">Tank:</span> <span className="font-bold text-white">{rec.tankLitres}L</span></div>
          <div><span className="text-gray-500">Spray:</span> <span className="font-bold text-white">{rec.sprayTime}</span></div>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">{formatDate(rec.timestamp)}</p>
      </motion.div>
    );
  }

  function renderSoilRow(rec: SoilAdvisory) {
    let recs: any[] = [];
    try { recs = JSON.parse(rec.recommendations); } catch {}
    return (
      <motion.div
        key={rec.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-forest-bg/40 rounded-xl p-4 border border-forest-border"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-agri-gold">{rec.soilType}</span>
            <span className="text-xs text-gray-500 ml-2">after {rec.previousCrop}</span>
          </div>
          <button onClick={() => handleDelete(rec.id!)} className="text-gray-500 hover:text-agri-red p-1 touch-target">
            <Trash2 size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-[11px] mb-2">
          <div><span className="text-gray-500">Temp:</span> <span className="font-bold">{rec.weatherTemp}°C</span></div>
          <div><span className="text-gray-500">Humidity:</span> <span className="font-bold">{rec.weatherHumidity}%</span></div>
          <div><span className="text-gray-500">Soil:</span> <span className="font-bold">{rec.weatherSoilMoisture}%</span></div>
          <div><span className="text-gray-500">Rain:</span> <span className="font-bold">{rec.weatherRainfall}mm</span></div>
        </div>
        {recs.length > 0 && (
          <p className="text-[10px] text-gray-400">
            Top: {recs.map((r: any) => r.crop).join(" → ")}
          </p>
        )}
        <p className="text-[10px] text-gray-600 mt-1">{formatDate(rec.timestamp)}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-agri-cyan flex items-center justify-center gap-2">
          <Database className="w-7 h-7" /> {tr("database")}
        </h2>
      </div>

      {/* Table Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {TABLE_CONFIG.map((t) => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTable(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTable === t.id
                ? `bg-forest-card border-2 border-agri-cyan/50 ${t.color}`
                : "bg-forest-card/50 border border-forest-border text-gray-400"
            }`}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-forest-bg text-[10px] font-bold">
              {recordCount[t.id]}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={loadRecords}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-forest-card border border-forest-border text-gray-300 hover:text-white transition-all touch-target"
        >
          <RefreshCw size={14} /> Refresh
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => exportData("csv")}
          disabled={records.length === 0}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-agri-green/10 border border-agri-green/30 text-agri-green hover:bg-agri-green/20 transition-all touch-target disabled:opacity-40"
        >
          <FileSpreadsheet size={14} /> {tr("exportCSV")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => exportData("json")}
          disabled={records.length === 0}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-agri-cyan/10 border border-agri-cyan/30 text-agri-cyan hover:bg-agri-cyan/20 transition-all touch-target disabled:opacity-40"
        >
          <FileJson size={14} /> {tr("exportJSON")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDeleteAll}
          disabled={records.length === 0}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-agri-red/10 border border-agri-red/30 text-agri-red hover:bg-agri-red/20 transition-all touch-target disabled:opacity-40 ml-auto"
        >
          <Trash2 size={14} /> {tr("deleteAll")}
        </motion.button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8 gap-3">
          <Loader2 className="w-6 h-6 text-agri-cyan animate-spin" />
          <span className="text-gray-400 text-sm">Loading records...</span>
        </div>
      )}

      {/* Records */}
      {!loading && records.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">{tr("noRecords")}</p>
          <p className="text-xs text-gray-600 mt-1">Use the modules to generate data</p>
        </div>
      )}

      {!loading && records.length > 0 && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {records.map((rec) => {
            if (activeTable === "diagnosisRecords") return renderDiagnosisRow(rec);
            if (activeTable === "pesticideScans") return renderPesticideRow(rec);
            if (activeTable === "soilAdvisories") return renderSoilRow(rec);
            return null;
          })}
        </div>
      )}
    </motion.div>
  );
}
