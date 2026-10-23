import React, { useState, useEffect } from "react";
import { BadgeData, PhotoEnhancementOptions } from "../types";
import { processHeadshotPhoto, compressPhotoForStorage } from "../utils/imageProcessing";
import {
  DEFAULT_ETHIOPIA_FLAG,
  DEFAULT_REGION_FLAG,
  DEFAULT_COMMISSION_LOGO,
  DEFAULT_OFFICIAL_STAMP,
  DEFAULT_OFFICIAL_SIGNATURE,
} from "../data/defaults";
import {
  Sparkles,
  Upload,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Image,
  Sliders,
  Camera,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Hash,
} from "lucide-react";

// Helper function to generate auto-sequential non-repeating Badge IDs
export function generateNextSequentialBadgeId(existingBadges: BadgeData[] = []): string {
  const prefix = "BGRPC-";
  let maxNumber = 1000; // base starting index (first is 1001)

  existingBadges.forEach((badge) => {
    if (badge.badgeId) {
      const matches = badge.badgeId.match(/\d+/g);
      if (matches) {
        const num = parseInt(matches[matches.length - 1], 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    }
  });

  let nextNum = maxNumber + 1;
  let candidateId = `${prefix}${nextNum}`;

  // Ensure strict uniqueness in case numbers were created manually or out of order
  const existingSet = new Set(
    existingBadges.map((b) => b.badgeId?.toLowerCase().trim())
  );
  while (existingSet.has(candidateId.toLowerCase())) {
    nextNum++;
    candidateId = `${prefix}${nextNum}`;
  }

  return candidateId;
}

interface BadgeFormProps {
  initialData?: BadgeData | null;
  existingBadges?: BadgeData[];
  onSave: (badge: BadgeData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const BadgeForm: React.FC<BadgeFormProps> = ({
  initialData,
  existingBadges = [],
  onSave,
  onCancel,
  isSubmitting = false,
}) => {
  // Form State
  const [badgeId, setBadgeId] = useState<string>(() =>
    initialData?.badgeId || generateNextSequentialBadgeId(existingBadges)
  );

  // Automatically sync/generate sequential ID when creating a new badge
  useEffect(() => {
    if (initialData?.badgeId) {
      setBadgeId(initialData.badgeId);
    } else if (!badgeId) {
      setBadgeId(generateNextSequentialBadgeId(existingBadges));
    }
  }, [initialData, existingBadges]);
  const [fullNameAmharic, setFullNameAmharic] = useState(
    initialData?.fullNameAmharic || ""
  );
  const [fullNameEnglish, setFullNameEnglish] = useState(
    initialData?.fullNameEnglish || ""
  );
  const [departmentAmharic, setDepartmentAmharic] = useState(
    initialData?.departmentAmharic || "የፖሊስ ዕጩ መኮንኖች ማሰልጠኛ ክፍል"
  );
  const [departmentEnglish, setDepartmentEnglish] = useState(
    initialData?.departmentEnglish || "Police Cadet Training Division"
  );
  const [rankAmharic, setRankAmharic] = useState(
    initialData?.rankAmharic || "ዋና አሰልጣኝ / መምህር"
  );
  const [rankEnglish, setRankEnglish] = useState(
    initialData?.rankEnglish || "Chief Instructor / Trainer"
  );
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber || "+251 91 123 4567"
  );
  const [status, setStatus] = useState<"ACTIVE" | "REVOKED" | "EXPIRED">(
    initialData?.status || "ACTIVE"
  );
  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate || new Date().toISOString().split("T")[0]
  );
  const [expiryDate, setExpiryDate] = useState(
    initialData?.expiryDate ||
      new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
  );

  // Asset States
  const [rawHeadshotPhoto, setRawHeadshotPhoto] = useState<string>(
    initialData?.rawHeadshotPhoto || initialData?.headshotPhoto || ""
  );
  const [processedHeadshot, setProcessedHeadshot] = useState<string>(
    initialData?.headshotPhoto || ""
  );
  const [ethiopiaFlag, setEthiopiaFlag] = useState<string>(
    initialData?.ethiopiaFlag || DEFAULT_ETHIOPIA_FLAG
  );
  const [regionFlag, setRegionFlag] = useState<string>(
    initialData?.regionFlag || DEFAULT_REGION_FLAG
  );
  const [commissionLogo, setCommissionLogo] = useState<string>(
    initialData?.commissionLogo || DEFAULT_COMMISSION_LOGO
  );
  const [officialStamp, setOfficialStamp] = useState<string>(
    initialData?.officialStamp || DEFAULT_OFFICIAL_STAMP
  );
  const [signature, setSignature] = useState<string>(
    initialData?.signature || DEFAULT_OFFICIAL_SIGNATURE
  );

  // Auto Image Enhancement Options State
  const [enhancementOptions, setEnhancementOptions] =
    useState<PhotoEnhancementOptions>({
      autoWhiteBackground: true,
      glareReduction: true,
      autoBrightnessContrast: true,
      brightness: 10,
      contrast: 15,
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
    });

  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // Trigger automatic photo processing whenever photo or enhancement settings change
  useEffect(() => {
    if (!rawHeadshotPhoto) return;

    let isMounted = true;
    const runProcessing = async () => {
      setIsProcessingPhoto(true);
      try {
        const result = await processHeadshotPhoto(
          rawHeadshotPhoto,
          enhancementOptions
        );
        if (isMounted) {
          setProcessedHeadshot(result);
        }
      } catch (err) {
        console.error("Auto photo processing failed:", err);
      } finally {
        if (isMounted) {
          setIsProcessingPhoto(false);
        }
      }
    };

    runProcessing();
    return () => {
      isMounted = false;
    };
  }, [rawHeadshotPhoto, enhancementOptions]);

  // Handle image upload from gallery for any image slot
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    isHeadshot: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isHeadshot) {
        setRawHeadshotPhoto(dataUrl);
      } else {
        setter(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawPhotoCompressed = rawHeadshotPhoto
      ? await compressPhotoForStorage(rawHeadshotPhoto, 320, 400, 0.8)
      : "";
    const finalHeadshot = processedHeadshot || rawPhotoCompressed;

    const badgePayload: BadgeData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      badgeId,
      fullNameAmharic,
      fullNameEnglish,
      departmentAmharic,
      departmentEnglish,
      rankAmharic,
      rankEnglish,
      phoneNumber,
      headshotPhoto: finalHeadshot,
      rawHeadshotPhoto: rawPhotoCompressed,
      ethiopiaFlag,
      regionFlag,
      commissionLogo,
      officialStamp,
      signature,
      status,
      issueDate,
      expiryDate,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(badgePayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header Section */}
      <div className="bg-[#1e293b] text-slate-100 p-5 rounded-xl shadow-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-slate-100 tracking-wide">
              {initialData ? "የባጅ መረጃ ማስተካከያ" : "አዲስ የፖሊስ ባጅ መመዝገቢያ"}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ የባጅ መረጃዎችን መመዝገቢያና የፋየርስቶር ማከማቻ
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition cursor-pointer"
            >
              ሰርዝ / Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !fullNameAmharic}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg border border-blue-500 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                በመመዝገብ ላይ...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                ባጁን በፋየርስቶር መዝግብ / Save Badge
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Personnel Data Inputs */}
        <div className="space-y-5 bg-[#1e293b] p-5 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-700 flex items-center gap-2">
            <span className="w-2 h-4 bg-blue-500 rounded-sm"></span>
            የባለባጁ ግላዊና የሙያ መረጃዎች / Personnel Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Badge ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  የባጅ ቁጥር / Badge ID
                </label>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Hash className="w-3 h-3 text-emerald-400" />
                  አውቶማቲክ ተከታታይ
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                {!initialData && (
                  <button
                    type="button"
                    onClick={() =>
                      setBadgeId(generateNextSequentialBadgeId(existingBadges))
                    }
                    className="absolute right-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-blue-400 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="ቀጣዩን ተከታታይ ቁጥር በድጋሚ አስላ"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                ሲስተሙ በቅደምተከተል የመደበው የማይደገም አውቶማቲክ የባጅ ቁጥር
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የባጁ ሁኔታ / Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm font-bold bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ACTIVE">ኦፊሴላዊ/አገልግሎት ላይ (ACTIVE)</option>
                <option value="REVOKED">የተሰረዘ (REVOKED)</option>
                <option value="EXPIRED">ጊዜው ያለፈበት (EXPIRED)</option>
              </select>
            </div>

            {/* Full Name Amharic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ሙሉ ስም (በአማርኛ) *
              </label>
              <input
                type="text"
                value={fullNameAmharic}
                onChange={(e) => setFullNameAmharic(e.target.value)}
                placeholder="ምሳሌ፡ ኮማንደር በቀለ አበበ"
                required
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Full Name English */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name (English) *
              </label>
              <input
                type="text"
                value={fullNameEnglish}
                onChange={(e) => setFullNameEnglish(e.target.value)}
                placeholder="e.g. Commander Bekele Abebe"
                required
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Department Amharic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የሚሰራበት ክፍል/ትምህርት ዘርፍ (በአማርኛ)
              </label>
              <input
                type="text"
                value={departmentAmharic}
                onChange={(e) => setDepartmentAmharic(e.target.value)}
                placeholder="ምሳሌ፡ የፖሊስ ዕጩ መኮንኖች ማሰልጠኛ ክፍል"
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Department English */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department / Faculty (English)
              </label>
              <input
                type="text"
                value={departmentEnglish}
                onChange={(e) => setDepartmentEnglish(e.target.value)}
                placeholder="e.g. Police Cadet Training Division"
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Rank/Responsibility Amharic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ኃላፊነት/ማዕረግ (በአማርኛ)
              </label>
              <input
                type="text"
                value={rankAmharic}
                onChange={(e) => setRankAmharic(e.target.value)}
                placeholder="ምሳሌ፡ ዋና አሰልጣኝ / መምህር"
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Rank/Responsibility English */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rank / Role (English)
              </label>
              <input
                type="text"
                value={rankEnglish}
                onChange={(e) => setRankEnglish(e.target.value)}
                placeholder="e.g. Chief Instructor / Trainer"
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ስልክ ቁጥር / Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+251 91 123 4567"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የተሰጠበት ቀን / Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የሚያበቃበት ቀን / Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Official Seals, Logos & Flags Gallery Selector */}
          <div className="pt-4 border-t border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase">
              <Image className="w-4 h-4 text-blue-400" />
              የባጁ ሰንደቅ ዓላማዎች፣ ሎጎ፣ ማህተምና ፊርማ ማስገቢያ (ከጋለሪ)
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Ethiopian Flag Upload */}
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <label className="block font-bold text-slate-200 mb-1">
                  የኢትዮጵያ ሰንደቅ ዓላማ
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={ethiopiaFlag}
                    alt="Ethiopia Flag"
                    className="w-10 h-7 object-cover rounded border border-slate-600 bg-black"
                  />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-[10px] flex items-center gap-1 transition">
                    <Upload className="w-3 h-3" />
                    ከጋለሪ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setEthiopiaFlag)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Benishangul Gumuz Regional Flag Upload */}
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <label className="block font-bold text-slate-200 mb-1">
                  የክልሉ ሰንደቅ ዓላማ
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={regionFlag}
                    alt="Region Flag"
                    className="w-10 h-7 object-cover rounded border border-slate-600 bg-black"
                  />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-[10px] flex items-center gap-1 transition">
                    <Upload className="w-3 h-3" />
                    ከጋለሪ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setRegionFlag)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Commission Logo Upload */}
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <label className="block font-bold text-slate-200 mb-1">
                  የፖሊስ ኮሌጁ ሎጎ
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={commissionLogo}
                    alt="Commission Logo"
                    className="w-8 h-8 object-contain rounded-full border border-slate-600 bg-slate-900 p-0.5"
                  />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-[10px] flex items-center gap-1 transition">
                    <Upload className="w-3 h-3" />
                    ከጋለሪ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setCommissionLogo)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Circular Stamp Upload */}
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <label className="block font-bold text-slate-200 mb-1">
                  የተቋሙ ክብ ማህተም
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={officialStamp}
                    alt="Stamp Preview"
                    className="w-8 h-8 object-contain rounded border border-slate-600 bg-white p-0.5"
                  />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-[10px] flex items-center gap-1 transition">
                    <Upload className="w-3 h-3" />
                    ከጋለሪ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setOfficialStamp)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Signature Upload */}
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 col-span-2 sm:col-span-1">
                <label className="block font-bold text-slate-200 mb-1">
                  የኃላፊው ፊርማ
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={signature}
                    alt="Signature Preview"
                    className="w-12 h-7 object-contain rounded border border-slate-600 bg-white p-0.5"
                  />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-[10px] flex items-center gap-1 transition">
                    <Upload className="w-3 h-3" />
                    ከጋለሪ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setSignature)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Headshot Photo Upload & Automatic Image Enhencer Studio */}
        <div className="space-y-5 bg-[#1e293b] p-5 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-700 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            የባለባጁ ጉርድ ፎቶ ማስገቢያና አውቶማቲክ ማስተካከያ (Photo Studio)
          </h3>

          {/* Upload Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-800 rounded-lg border border-dashed border-slate-600 hover:border-blue-500 transition">
            <div className="w-24 h-32 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-md flex items-center justify-center shrink-0">
              {processedHeadshot ? (
                <img
                  src={processedHeadshot}
                  alt="Headshot"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-slate-500">
                  <Camera className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                  <span className="text-[10px] font-bold">ፎቶ አልተመረጠም</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <label className="inline-flex cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition items-center gap-2">
                <Upload className="w-4 h-4 text-white" />
                ጉርድ ፎቶ ከጋለሪ/ካሜራ ይምረጡ
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setRawHeadshotPhoto, true)}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 font-medium">
                ፎቶውን ሲመርጡ ሲስተሙ አውቶማቲክ ባክግራውንዱን ነጭ ያደርጋል፣ ብጅታ ያስወግዳል እንዲሁም ብራይትነስ ያስተካክላል::
              </p>
            </div>
          </div>

          {/* Automatic Photo Enhancement Features Control Panel */}
          <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                የሲስተሙ አውቶማቲክ ፎቶ ማስተካከያ (Auto Enhance)
              </span>
              {isProcessingPhoto && (
                <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  በማስተካከል ላይ...
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {/* 1. Auto White Background Toggle */}
              <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-600">
                <span className="font-bold text-slate-200">
                  1. ንፁህ ነጭ ባክግራውንድ ማድረግ (Auto White Background)
                </span>
                <input
                  type="checkbox"
                  checked={enhancementOptions.autoWhiteBackground}
                  onChange={(e) =>
                    setEnhancementOptions({
                      ...enhancementOptions,
                      autoWhiteBackground: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              {/* 2. Glare & Reflection Reduction */}
              <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-600">
                <span className="font-bold text-slate-200">
                  2. የፎቶ ብጅታና ነጸብራቅ መቀነስ (Glare Reduction Filter)
                </span>
                <input
                  type="checkbox"
                  checked={enhancementOptions.glareReduction}
                  onChange={(e) =>
                    setEnhancementOptions({
                      ...enhancementOptions,
                      glareReduction: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              {/* 3. Auto Brightness / Contrast */}
              <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-600">
                <span className="font-bold text-slate-200">
                  3. አውቶማቲክ ብራይትነስና ኮንትራስት ማስተካከያ (Auto Brightness & Contrast)
                </span>
                <input
                  type="checkbox"
                  checked={enhancementOptions.autoBrightnessContrast}
                  onChange={(e) =>
                    setEnhancementOptions({
                      ...enhancementOptions,
                      autoBrightnessContrast: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="pt-2 border-t border-slate-700 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>ብራይትነስ / Brightness:</span>
                  <span className="font-mono text-blue-400">{enhancementOptions.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={enhancementOptions.brightness}
                  onChange={(e) =>
                    setEnhancementOptions({
                      ...enhancementOptions,
                      brightness: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>ኮንትራስት / Contrast:</span>
                  <span className="font-mono text-blue-400">{enhancementOptions.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={enhancementOptions.contrast}
                  onChange={(e) =>
                    setEnhancementOptions({
                      ...enhancementOptions,
                      contrast: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Photo Position & Zoom Nudge Controls (ወደ ላይ፣ ወደ ታች፣ ወደ ግራ፣ ወደ ቀኝ እና መመላሻ) */}
            <div className="pt-3 border-t border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase">
                  <Move className="w-4 h-4 text-amber-400" />
                  የፎቶው አቀማመጥ ማስተካከያ (Position & Zoom)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEnhancementOptions({
                      ...enhancementOptions,
                      offsetX: 0,
                      offsetY: 0,
                      zoom: 1,
                      brightness: 10,
                      contrast: 15,
                    })
                  }
                  className="px-2.5 py-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-md transition flex items-center gap-1 cursor-pointer"
                  title="ወደ ነበረበት መልስ / Reset Position"
                >
                  <RotateCcw className="w-3 h-3" />
                  መመላሻ / Reset
                </button>
              </div>

              {/* D-Pad Arrow Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700">
                {/* Arrow Pad */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {/* Up */}
                  <button
                    type="button"
                    onClick={() =>
                      setEnhancementOptions((prev) => ({
                        ...prev,
                        offsetY: prev.offsetY - 10,
                      }))
                    }
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-600 transition shadow cursor-pointer active:scale-95"
                    title="ወደ ላይ / Up"
                  >
                    <ArrowUp className="w-4 h-4 text-blue-400" />
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Left */}
                    <button
                      type="button"
                      onClick={() =>
                        setEnhancementOptions((prev) => ({
                          ...prev,
                          offsetX: prev.offsetX - 10,
                        }))
                      }
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-600 transition shadow cursor-pointer active:scale-95"
                      title="ወደ ግራ / Left"
                    >
                      <ArrowLeft className="w-4 h-4 text-blue-400" />
                    </button>

                    {/* Offset values display */}
                    <span className="text-[10px] font-bold text-slate-400 px-1 font-mono">
                      {enhancementOptions.offsetX},{enhancementOptions.offsetY}
                    </span>

                    {/* Right */}
                    <button
                      type="button"
                      onClick={() =>
                        setEnhancementOptions((prev) => ({
                          ...prev,
                          offsetX: prev.offsetX + 10,
                        }))
                      }
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-600 transition shadow cursor-pointer active:scale-95"
                      title="ወደ ቀኝ / Right"
                    >
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>

                  {/* Down */}
                  <button
                    type="button"
                    onClick={() =>
                      setEnhancementOptions((prev) => ({
                        ...prev,
                        offsetY: prev.offsetY + 10,
                      }))
                    }
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-600 transition shadow cursor-pointer active:scale-95"
                    title="ወደ ታች / Down"
                  >
                    <ArrowDown className="w-4 h-4 text-blue-400" />
                  </button>
                </div>

                {/* Direct Control Sliders for Position X, Y and Zoom */}
                <div className="flex-1 w-full space-y-2 text-xs">
                  {/* Position X */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 mb-0.5">
                      <span>ወደ ግራ / ወደ ቀኝ (Left / Right):</span>
                      <span className="font-mono text-blue-400">{enhancementOptions.offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={enhancementOptions.offsetX}
                      onChange={(e) =>
                        setEnhancementOptions({
                          ...enhancementOptions,
                          offsetX: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Position Y */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 mb-0.5">
                      <span>ወደ ላይ / ወደ ታች (Up / Down):</span>
                      <span className="font-mono text-blue-400">{enhancementOptions.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={enhancementOptions.offsetY}
                      onChange={(e) =>
                        setEnhancementOptions({
                          ...enhancementOptions,
                          offsetY: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Zoom */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 mb-0.5">
                      <span>የፎቶ መጠን / ማጉያ (Zoom):</span>
                      <span className="font-mono text-blue-400">{Math.round((enhancementOptions.zoom || 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={enhancementOptions.zoom || 1}
                      onChange={(e) =>
                        setEnhancementOptions({
                          ...enhancementOptions,
                          zoom: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
