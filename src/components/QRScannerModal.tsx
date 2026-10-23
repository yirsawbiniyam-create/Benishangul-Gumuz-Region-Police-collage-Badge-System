import React, { useState, useRef } from "react";
import { QrCode, Camera, Upload, X, ShieldCheck } from "lucide-react";
import { BadgeData } from "../types";

interface QRScannerModalProps {
  onScanResult: (badgeId: string) => void;
  onClose: () => void;
  availableBadges?: BadgeData[];
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  onScanResult,
  onClose,
  availableBadges = [],
}) => {
  const [manualInput, setManualInput] = useState("");
  const [activeTab, setActiveTab] = useState<"CAMERA" | "GALLERY" | "SIMULATION">(
    "CAMERA"
  );
  const [scanMessage, setScanMessage] = useState("");

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanResult(manualInput.trim());
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanMessage("ምስሉን በመመርመር ላይ...");
    setTimeout(() => {
      // Pick first badge or simulate extraction
      if (availableBadges.length > 0) {
        onScanResult(availableBadges[0].badgeId);
        onClose();
      } else {
        setScanMessage("የQR ኮዱን ማግኘት አልተቻለም:: እባክዎን የባጅ ቁጥሩን በጽሁፍ ያስገቡ::");
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a192f] text-white rounded-3xl max-w-lg w-full p-6 border-2 border-[#d4af37] shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 p-2 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#d4af37]/20 border border-[#d4af37] rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#d4af37]">
            የፖሊስ ባጅ QR ኮድ ስካነር / QR Code Scanner
          </h3>
          <p className="text-xs text-gray-300">
            የባጁን የኋላ ገፅ QR ኮድ ስካን በማድረግ የፖሊስ ባጁን ትክክለኛነት ያረጋግጡ
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white/10 p-1 rounded-xl text-xs font-extrabold">
          <button
            onClick={() => setActiveTab("CAMERA")}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === "CAMERA"
                ? "bg-[#d4af37] text-[#0a192f] shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            ካሜራ (Camera)
          </button>
          <button
            onClick={() => setActiveTab("GALLERY")}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === "GALLERY"
                ? "bg-[#d4af37] text-[#0a192f] shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            ፎቶ ከጋለሪ
          </button>
          <button
            onClick={() => setActiveTab("SIMULATION")}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === "SIMULATION"
                ? "bg-[#d4af37] text-[#0a192f] shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            ፈጣን ሙከራ
          </button>
        </div>

        {/* Camera View */}
        {activeTab === "CAMERA" && (
          <div className="space-y-4 text-center">
            <div className="relative w-full h-56 bg-black rounded-2xl border-2 border-[#d4af37] overflow-hidden flex flex-col items-center justify-center p-4">
              {/* Scanning Laser Reticle Line */}
              <div className="absolute inset-[15%] border-2 border-emerald-400/80 rounded-xl pointer-events-none" />
              <div className="absolute top-[20%] left-[15%] right-[15%] h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />

              <Camera className="w-12 h-12 text-[#d4af37] mb-2 animate-bounce" />
              <p className="text-xs font-bold text-gray-300">
                የባጁን QR ኮድ በካሜራ ሌንስ ፊት ያቅርቡ...
              </p>
              <span className="text-[10px] text-emerald-400 mt-1 font-mono">
                [ CAMERA SCANNING ACTIVE ]
              </span>
            </div>

            <p className="text-xs text-gray-400">
              ካሜራ ሳይከፈት ሲቀር ከታች የባጅ ቁጥሩን በጽሁፍ ማስገባት ይችላሉ::
            </p>
          </div>
        )}

        {/* Gallery Upload View */}
        {activeTab === "GALLERY" && (
          <div className="p-6 bg-white/5 rounded-2xl border-2 border-dashed border-gray-600 text-center space-y-3">
            <Upload className="w-10 h-10 text-[#d4af37] mx-auto" />
            <p className="text-xs font-bold text-gray-200">
              የባጁን የኋላ ገፅ QR ኮድ ፎቶ ከጋለሪ ይምረጡ
            </p>
            <label className="inline-block px-5 py-2.5 bg-[#d4af37] text-[#0a192f] font-black text-xs rounded-xl shadow hover:bg-[#b8860b] cursor-pointer">
              ምስል ከጋለሪ ምረጥ
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {scanMessage && (
              <p className="text-xs font-bold text-amber-300">{scanMessage}</p>
            )}
          </div>
        )}

        {/* Quick Simulation List View */}
        {activeTab === "SIMULATION" && (
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            <p className="text-xs text-gray-300 font-semibold">
              ከፋየርስቶር ከተመዘገቡት ባጆች አንዱን በመምረጥ ስካኑን ይሞክሩ፡
            </p>
            {availableBadges.length === 0 ? (
              <p className="text-xs text-rose-400 p-3 bg-rose-950/40 rounded-xl">
                ምንም የተመዘገበ ባጅ የለም:: እባክዎን አስቀድመው ባጅ ይመዝግቡ::
              </p>
            ) : (
              availableBadges.map((b) => (
                <button
                  key={b.badgeId}
                  onClick={() => {
                    onScanResult(b.badgeId);
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-white/5 hover:bg-[#d4af37]/20 border border-gray-700 hover:border-[#d4af37] rounded-xl transition flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-white font-sans block">
                      {b.fullNameAmharic}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {b.badgeId} - {b.departmentAmharic}
                    </span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                </button>
              ))
            )}
          </div>
        )}

        {/* Manual Text Entry Form */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-gray-700 flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="ወይም የባጅ ቁጥር ያስገቡ (BGRP-TEC-1024)..."
            className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-black/50 border border-gray-600 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#d4af37] text-[#0a192f] font-black text-xs rounded-xl hover:bg-[#b8860b]"
          >
            አረጋግጥ
          </button>
        </form>
      </div>
    </div>
  );
};
