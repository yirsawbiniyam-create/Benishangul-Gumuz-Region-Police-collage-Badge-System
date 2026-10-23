import React from "react";
import { BadgeData } from "../types";
import {
  DEFAULT_ETHIOPIA_FLAG,
  DEFAULT_REGION_FLAG,
  DEFAULT_COMMISSION_LOGO,
  DEFAULT_CHEST_BADGE,
  DEFAULT_OFFICIAL_STAMP,
} from "../data/defaults";

interface BadgeCardFrontProps {
  data: BadgeData;
  scale?: number;
  className?: string;
  onClick?: () => void;
}

export const BadgeCardFront: React.FC<BadgeCardFrontProps> = ({
  data,
  scale = 1,
  className = "",
  onClick,
}) => {
  const ethiopianFlag = data.ethiopiaFlag || DEFAULT_ETHIOPIA_FLAG;
  const regionalFlag = data.regionFlag || DEFAULT_REGION_FLAG;
  const logo = data.commissionLogo || DEFAULT_COMMISSION_LOGO;
  const stamp = data.officialStamp || DEFAULT_OFFICIAL_STAMP;

  const scaledWidth = Math.round(385 * scale);
  const scaledHeight = Math.round(245 * scale);

  return (
    <div
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
      }}
      className="shrink-0 relative overflow-visible flex items-start justify-start select-none"
    >
      <div
        onClick={onClick}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className={`relative w-[385px] h-[245px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#eab308] bg-gradient-to-b from-[#0f2d5e] via-[#163a75] to-[#0b1b3b] text-white flex flex-col justify-between select-none print:shadow-none ${className}`}
      >
      {/* Background Security Pattern & Gold Radial Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:10px_10px]" />
      <div className="absolute -top-14 -left-14 w-36 h-36 bg-[#facc15]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-14 -right-14 w-36 h-36 bg-[#2563eb]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Section: Flags & Commission Logo with Titles (Horizontal Banner) */}
      <div className="relative pt-1 px-2.5 pb-1 bg-gradient-to-r from-[#0b1c3a] via-[#133261] to-[#0b1c3a] border-b-2 border-[#eab308]">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Ethiopian National Flag */}
          <div className="w-8 h-5 rounded border border-[#facc15] overflow-hidden shadow-md bg-black shrink-0">
            <img
              src={ethiopianFlag}
              alt="Ethiopia Flag"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center: Commission Logo + Titles */}
          <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
            <div className="w-8 h-8 p-0.5 rounded-full bg-gradient-to-tr from-[#facc15] via-white to-[#eab308] shadow-lg ring-1 ring-[#facc15]/60 shrink-0">
              <img
                src={logo}
                alt="Police Logo"
                className="w-full h-full object-contain rounded-full bg-white filter contrast-[1.08] brightness-[1.05]"
              />
            </div>

            <div className="text-center min-w-0">
              <h1 className="text-[9.5px] font-black leading-tight text-white tracking-tight drop-shadow-md font-sans truncate">
                ቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
              </h1>
              <p className="text-[5.5px] font-extrabold text-[#fef08a] tracking-tight uppercase leading-none mt-0.5 truncate">
                BENISHANGUL GUMUZ REGION POLICE COLLEGE
              </p>
            </div>

            <div className="inline-block bg-[#facc15] text-[#0b1c3a] text-[7px] font-black px-1.5 py-0.5 rounded shadow uppercase tracking-wider shrink-0">
              የደረት ባጅ
            </div>
          </div>

          {/* Right: Benishangul Gumuz Regional Flag */}
          <div className="w-8 h-5 rounded border border-[#facc15] overflow-hidden shadow-md bg-black shrink-0">
            <img
              src={regionalFlag}
              alt="Benishangul Flag"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Body: Photo (Left) & Officer Data (Right) */}
      <div className="relative px-2.5 py-1.5 flex-1 flex gap-2.5 items-center justify-between min-h-0">
        {/* Left Column: Headshot Photo with Frame */}
        <div className="relative w-[92px] h-[126px] rounded-xl border-2 border-[#facc15] bg-white overflow-hidden shadow-xl ring-2 ring-[#facc15]/30 shrink-0">
          {data.headshotPhoto ? (
            <img
              src={data.headshotPhoto}
              alt="Personnel Headshot"
              className="w-full h-full object-cover object-top filter brightness-[1.08] contrast-[1.08] saturate-[1.12]"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-[7px] font-bold mt-0.5 text-gray-600">
                ጉርድ ፎቶ
              </span>
            </div>
          )}

          {/* Micro Hologram Security Label on Photo */}
          <div className="absolute top-0.5 right-0.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-[5px] font-black text-gray-900 px-1 py-0.2 rounded shadow opacity-90 uppercase">
            HOLOGRAM
          </div>
        </div>

        {/* Right Column: Personnel Information & Chest Shield */}
        <div className="flex-1 flex flex-col justify-between h-full space-y-1 text-left min-w-0 pr-0.5">
          {/* Badge ID, Status & Shield Crest Row */}
          <div className="flex items-center justify-between gap-1">
            <div className="inline-flex items-center gap-1 bg-[#0b1c3a]/90 border border-[#facc15]/60 rounded px-1.5 py-0.5 shadow-sm">
              <span className="text-[6.5px] text-gray-200 font-bold uppercase">ባጅ ቁጥር:</span>
              <span className="text-[8.5px] font-black text-[#fef08a] tracking-wider font-mono">
                {data.badgeId || "BGRP-0000"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-[#facc15] text-[#0b1c3a] text-[6.5px] font-black uppercase tracking-wider shadow">
                {data.status === "ACTIVE" ? "ኦፊሴላዊ" : data.status}
              </span>
              <div className="w-6 h-5 object-contain">
                <img
                  src={DEFAULT_CHEST_BADGE}
                  alt="Badge Shield"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <span className="text-[6px] font-black text-[#facc15] uppercase block leading-none">
              ሙሉ ስም / Full Name:
            </span>
            <h3 className="text-[11px] font-black text-white leading-tight font-sans truncate mt-0.5">
              {data.fullNameAmharic || "ያልተሞላ ስም"}
            </h3>
            <p className="text-[8px] font-extrabold text-amber-200 uppercase leading-none truncate mt-0.5">
              {data.fullNameEnglish || "Full Name Placeholder"}
            </p>
          </div>

          {/* Department & Rank in 2-column horizontal grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Department */}
            <div className="min-w-0">
              <span className="text-[5.5px] font-black text-[#facc15] uppercase block leading-none">
                ክፍል / Department:
              </span>
              <p className="text-[8px] font-black text-white leading-tight font-sans truncate mt-0.5">
                {data.departmentAmharic || "ቴክኖሎጂ ማስፋፊያ"}
              </p>
              <p className="text-[6.5px] font-bold text-amber-200 uppercase leading-none truncate">
                {data.departmentEnglish || "Tech Expansion"}
              </p>
            </div>

            {/* Rank */}
            <div className="min-w-0">
              <span className="text-[5.5px] font-black text-[#facc15] uppercase block leading-none">
                ኃላፊነት / Rank:
              </span>
              <p className="text-[8px] font-black text-[#fef08a] leading-tight font-sans truncate mt-0.5">
                {data.rankAmharic || "ኦፊሰር / Officer"}
              </p>
              <p className="text-[6.5px] font-bold text-amber-200 uppercase leading-none truncate">
                {data.rankEnglish || "Police Officer"}
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="pt-0.5 border-t border-amber-400/30 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[6px] font-black text-[#facc15] uppercase leading-none">
                ስልክ ቁጥር / Phone:
              </span>
              <span className="text-[8px] font-black text-white font-mono leading-none">
                {data.phoneNumber || "+251 900 000000"}
              </span>
            </div>
            <span className="text-[5.5px] font-bold text-emerald-300 font-mono">
              ● SECURE ID
            </span>
          </div>
        </div>
      </div>

      {/* Footer Section: Validity & Security Holographic Band */}
      <div className="relative bg-gradient-to-r from-[#eab308] via-[#fef9c3] to-[#eab308] text-[#0f2d5e] px-2.5 py-0.5 flex items-center justify-between border-t-2 border-[#ca8a04]">
        <div>
          <span className="text-[5.5px] font-black uppercase block leading-none text-[#0f2d5e]">
            የተሰጠበት / ISSUED:
          </span>
          <span className="text-[7px] font-black font-mono leading-tight">
            {data.issueDate || "2026-08-10"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[6px] font-black uppercase tracking-wider text-[#0f2d5e]">
            ★ BGR POLICE COLLEGE BADGE ★
          </span>
          <span className="text-[5.5px] font-black uppercase text-[#1e3a8a]">
            ቤኒሻንጉል ጉሙዝ ፖሊስ ኮሌጅ
          </span>
        </div>

        <div className="text-right">
          <span className="text-[5.5px] font-black uppercase block leading-none text-[#0f2d5e]">
            የሚያበቃበት / EXPIRES:
          </span>
          <span className="text-[7px] font-black font-mono leading-tight">
            {data.expiryDate || "2029-08-10"}
          </span>
        </div>
      </div>
    </div>
    </div>
  );
};
