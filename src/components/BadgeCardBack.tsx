import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { BadgeData } from "../types";
import {
  DEFAULT_COMMISSION_LOGO,
  DEFAULT_OFFICIAL_SIGNATURE,
} from "../data/defaults";

interface BadgeCardBackProps {
  data: BadgeData;
  scale?: number;
  className?: string;
  onClick?: () => void;
  verificationUrlOverride?: string;
}

export const BadgeCardBack: React.FC<BadgeCardBackProps> = ({
  data,
  scale = 1,
  className = "",
  onClick,
  verificationUrlOverride,
}) => {
  const logo = data.commissionLogo || DEFAULT_COMMISSION_LOGO;
  const signature = data.signature || DEFAULT_OFFICIAL_SIGNATURE;

  // Build full verification URL or JSON string for QR Code
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const qrVerificationPayload =
    verificationUrlOverride ||
    `${origin}/?verify=${encodeURIComponent(data.badgeId)}`;

  return (
    <div
      onClick={onClick}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
      className={`relative w-[385px] h-[245px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#eab308] bg-gradient-to-b from-[#0f2d5e] via-[#163a75] to-[#0b1b3b] text-white flex flex-col justify-between p-2.5 select-none print:shadow-none ${className}`}
    >
      {/* 1. Large Watermark of Police Commission Logo in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src={logo}
          alt="Watermark Logo"
          className="w-[180px] h-[180px] object-contain opacity-20 filter brightness-125 contrast-125"
        />
      </div>

      {/* Security Pattern Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:10px_10px]" />

      {/* Top Header Label */}
      <div className="relative text-center pb-1 border-b-2 border-[#eab308] flex items-center justify-between">
        <h2 className="text-[9px] font-black text-[#facc15] tracking-wider uppercase font-sans drop-shadow-md">
          ቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
        </h2>
        <div className="inline-block bg-[#facc15] text-[#0b1c3a] text-[6.5px] font-black px-1.5 py-0.5 rounded shadow uppercase">
          የደረት ባጅ ማረጋገጫ (COLLEGE BADGE VERIFICATION)
        </div>
      </div>

      {/* Main Body: QR Code (Left) & Legal Terms + Signature (Right) */}
      <div className="relative my-1 flex-1 flex gap-2.5 items-center justify-between min-h-0">
        {/* Left: High-res QR Code & Scanner Instructions */}
        <div className="flex flex-col items-center justify-center bg-[#0b1c3a]/80 backdrop-blur-md rounded-xl p-1.5 border border-[#facc15]/60 shadow-lg shrink-0">
          <div className="p-1 bg-white rounded-lg shadow-xl border border-[#eab308]">
            <QRCodeSVG
              value={qrVerificationPayload}
              size={92}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: logo,
                x: undefined,
                y: undefined,
                height: 18,
                width: 18,
                excavate: true,
              }}
            />
          </div>

          <div className="mt-1 inline-flex items-center gap-0.5 bg-[#facc15] text-[#0b1c3a] text-[6px] font-black px-1 py-0.2 rounded shadow uppercase">
            <svg
              className="w-2 h-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            ስካን አድርገው ያረጋግጡ
          </div>
        </div>

        {/* Right: Property Notice & Official Authentication */}
        <div className="flex-1 flex flex-col justify-between h-full space-y-1 text-left min-w-0">
          {/* Terms & Legal Notice */}
          <div className="text-[6px] text-gray-100 bg-[#0b1c3a]/90 p-1.5 rounded-lg border border-amber-400/40 leading-snug space-y-0.5 shadow-sm">
            <p className="font-bold font-sans text-amber-200">
              • ይህ ባጅ የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ ንብረት ነው::
            </p>
            <p className="text-gray-200 font-semibold">
              • ባጁ ቢጠፋ ወይም ሌላ ሰው ቢያገኘው በአቅራቢያው ለሚገኝ ፖሊስ ጣቢያ ወይም ለኮሌጁ አስተዳደር ያስረክቡ ወይም በ
              <strong className="text-[#facc15] font-mono ml-0.5 font-black">9991</strong> ይደውሉ::
            </p>
            <p className="text-[5px] text-amber-300 font-bold uppercase font-mono tracking-tighter pt-0.5 border-t border-amber-400/20">
              PROPERTY OF BENISHANGUL GUMUZ REGION POLICE COLLEGE.
            </p>
          </div>

          {/* Authorized Signature & DB Auth Serial */}
          <div className="pt-1 border-t border-[#eab308] flex items-end justify-between gap-1">
            <div className="flex flex-col text-left">
              <span className="text-[5.5px] font-black text-amber-300 uppercase leading-none">
                የፍቃድ ቁጥር / AUTH:
              </span>
              <span className="text-[7.5px] font-black text-white font-mono mt-0.5">
                {data.badgeId ? `AUTH-${data.badgeId}` : "AUTH-0000"}
              </span>
              <span className="text-[5px] text-emerald-300 font-black flex items-center gap-0.5 mt-0.5">
                ● SECURED FIRESTORE DB
              </span>
            </div>

            <div className="flex flex-col items-center">
              {/* Commandant Signature Graphic */}
              <div className="w-24 h-7 border-b border-[#facc15] flex items-center justify-center p-0.5 bg-white/10 rounded">
                <img
                  src={signature}
                  alt="Official Signature"
                  className="max-w-full max-h-full object-contain filter invert contrast-200 brightness-200"
                />
              </div>
              <span className="text-[5.5px] font-black text-[#facc15] uppercase mt-0.5">
                የኮሌጁ ኮማንዳንት ፊርማ / COMMANDANT SIGNATURE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
