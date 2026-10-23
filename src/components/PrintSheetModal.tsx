import React, { useState } from "react";
import { BadgeData } from "../types";
import { BadgeCardFront } from "./BadgeCardFront";
import { BadgeCardBack } from "./BadgeCardBack";
import { Printer, X, ShieldCheck, Layers, Scissors, Check } from "lucide-react";

interface PrintSheetModalProps {
  badge: BadgeData;
  onClose: () => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({
  badge,
  onClose,
}) => {
  const [printLayout, setPrintLayout] = useState<"SIDE_BY_SIDE" | "STACKED" | "FRONT_ONLY" | "BACK_ONLY">("SIDE_BY_SIDE");
  const [showCutGuides, setShowCutGuides] = useState<boolean>(true);

  const handlePrintTrigger = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full p-6 border-2 border-[#d4af37] shadow-2xl relative space-y-6 print:p-0 print:bg-white print:text-black print:border-none print:shadow-none print:rounded-none">
        {/* Header - Hidden in Print */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-800 gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[#d4af37]">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  የፖሊስ ባጅ ሆሪዞንታል ማተሚያ ገፅ (Landscape Print Studio)
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  CR80 ሆሪዞንታል
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                መጠን፡ 85.6mm x 54mm (Horizontal Landscape CR80 ID Card)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrintTrigger}
              className="px-5 py-2.5 bg-[#d4af37] text-[#0a192f] font-black text-xs rounded-xl shadow-lg hover:bg-[#b8860b] flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              አሁን አትም (Print Now)
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-white/10 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Configuration Controls - Hidden in Print */}
        <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 flex flex-wrap items-center justify-between gap-4 print:hidden text-xs">
          {/* Print Layout Selection */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              የማተሚያ አቀማመጥ፡
            </span>
            <div className="inline-flex bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setPrintLayout("SIDE_BY_SIDE")}
                className={`px-3 py-1 font-bold rounded-md transition cursor-pointer ${
                  printLayout === "SIDE_BY_SIDE"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ጎን ለጎን (Side by Side)
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout("STACKED")}
                className={`px-3 py-1 font-bold rounded-md transition cursor-pointer ${
                  printLayout === "STACKED"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ላይና ታች (Stacked)
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout("FRONT_ONLY")}
                className={`px-3 py-1 font-bold rounded-md transition cursor-pointer ${
                  printLayout === "FRONT_ONLY"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                የፊት ብቻ
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout("BACK_ONLY")}
                className={`px-3 py-1 font-bold rounded-md transition cursor-pointer ${
                  printLayout === "BACK_ONLY"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                የኋላ ብቻ
              </button>
            </div>
          </div>

          {/* Cut Guides Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-bold">
            <input
              type="checkbox"
              checked={showCutGuides}
              onChange={(e) => setShowCutGuides(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
            />
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            የመቁረጫ መስመር አሳይ (Cut Guides)
          </label>
        </div>

        {/* Printable Area */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-gray-800 print:bg-white print:p-0 print:border-none flex flex-col items-center gap-6">
          <div className="text-center print:hidden space-y-1">
            <span className="text-xs font-bold text-[#d4af37] bg-[#0a192f] px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ - ሆሪዞንታል ባጅ
            </span>
            <h4 className="text-sm font-black text-white mt-1">
              {badge.fullNameAmharic} ({badge.badgeId})
            </h4>
          </div>

          {/* Cards Container */}
          <div
            className={`flex items-center justify-center gap-6 print:gap-6 print:justify-center print:w-full print:m-0 ${
              printLayout === "SIDE_BY_SIDE"
                ? "flex-col lg:flex-row print:flex-row"
                : printLayout === "STACKED"
                ? "flex-col print:flex-col"
                : "flex-col"
            }`}
          >
            {/* Front Card */}
            {(printLayout === "SIDE_BY_SIDE" ||
              printLayout === "STACKED" ||
              printLayout === "FRONT_ONLY") && (
              <div className="flex flex-col items-center gap-2 print-card-container">
                <span className="text-xs font-bold text-gray-400 print:hidden">
                  የፊት ገፅ (Front Side - Landscape)
                </span>
                <div
                  className={`p-1 bg-white/5 rounded-2xl print:p-0 print:m-0 ${
                    showCutGuides
                      ? "border border-dashed border-amber-400/40 print:border-gray-300"
                      : ""
                  }`}
                >
                  <BadgeCardFront data={badge} scale={1} />
                </div>
              </div>
            )}

            {/* Back Card */}
            {(printLayout === "SIDE_BY_SIDE" ||
              printLayout === "STACKED" ||
              printLayout === "BACK_ONLY") && (
              <div className="flex flex-col items-center gap-2 print-card-container">
                <span className="text-xs font-bold text-gray-400 print:hidden">
                  የኋላ ገፅ (Back Side - Landscape)
                </span>
                <div
                  className={`p-1 bg-white/5 rounded-2xl print:p-0 print:m-0 ${
                    showCutGuides
                      ? "border border-dashed border-amber-400/40 print:border-gray-300"
                      : ""
                  }`}
                >
                  <BadgeCardBack data={badge} scale={1} />
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-400 print:hidden max-w-lg leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            💡 <strong className="text-amber-300">የማተሚያ መመሪያ (Print Settings)፡</strong>{" "}
            በማተሚያ ሳጥኑ ውስጥ <strong>Destination &rarr; Save as PDF</strong> ወይም ተስማሚ ፕሪንተር ይምረጡ፤{" "}
            <strong>Layout &rarr; Landscape</strong> ወይም <strong>Portrait</strong>፣ እንዲሁም{" "}
            <strong>More settings &rarr; Background graphics</strong> የሚለውን ያብሩ::
          </div>
        </div>
      </div>
    </div>
  );
};

