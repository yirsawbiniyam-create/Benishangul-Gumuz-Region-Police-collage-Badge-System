// Public Verification Page for Police Badge QR Scanning
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { BadgeData } from "../types";
import { BadgeCardFront } from "./BadgeCardFront";
import { BadgeCardBack } from "./BadgeCardBack";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  User,
  Phone,
  Building,
  Award,
  Calendar,
  Lock,
  QrCode,
  RefreshCw,
  AlertOctagon,
} from "lucide-react";

interface PublicVerificationPageProps {
  initialBadgeId: string;
  allBadges?: BadgeData[];
}

export const PublicVerificationPage: React.FC<PublicVerificationPageProps> = ({
  initialBadgeId,
  allBadges = [],
}) => {
  const [badgeId, setBadgeId] = useState(initialBadgeId);
  const [searchInput, setSearchInput] = useState(initialBadgeId);
  const [badge, setBadge] = useState<BadgeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"DETAILS" | "FRONT" | "BACK">("DETAILS");
  const [verifiedAt, setVerifiedAt] = useState<string>("");

  useEffect(() => {
    fetchBadgeData(badgeId);
  }, [badgeId]);

  const fetchBadgeData = async (idToSearch: string) => {
    setLoading(true);
    setNotFound(false);
    setVerifiedAt(new Date().toLocaleTimeString());

    const cleanId = idToSearch.trim();
    if (!cleanId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    // 1. Check in passed badges array first
    const match = allBadges.find(
      (b) =>
        b.badgeId.toLowerCase() === cleanId.toLowerCase() ||
        b.id.toLowerCase() === cleanId.toLowerCase()
    );

    if (match) {
      setBadge(match);
      setLoading(false);
      return;
    }

    // 2. Fetch directly from Firestore doc
    try {
      const docRef = doc(db, "badges", cleanId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBadge({ id: docSnap.id, ...(docSnap.data() as BadgeData) });
        setNotFound(false);
      } else {
        // Fallback search locally stored badges
        const localSaved =
          localStorage.getItem("bgr_police_college_badges") ||
          localStorage.getItem("bgr_police_badges");
        if (localSaved) {
          try {
            const list: BadgeData[] = JSON.parse(localSaved);
            const localMatch = list.find(
              (b) =>
                b.badgeId.toLowerCase() === cleanId.toLowerCase() ||
                b.id.toLowerCase() === cleanId.toLowerCase()
            );
            if (localMatch) {
              setBadge(localMatch);
              setNotFound(false);
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        setBadge(null);
        setNotFound(true);
      }
    } catch (err) {
      console.warn("Firestore offline/fetch note on public verification:", err);
      // Fallback search locally stored badges if offline
      const localSaved = localStorage.getItem("bgr_police_badges");
      if (localSaved) {
        try {
          const list: BadgeData[] = JSON.parse(localSaved);
          const localMatch = list.find(
            (b) =>
              b.badgeId.toLowerCase() === cleanId.toLowerCase() ||
              b.id.toLowerCase() === cleanId.toLowerCase()
          );
          if (localMatch) {
            setBadge(localMatch);
            setNotFound(false);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      setBadge(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setBadgeId(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Public Header - Title banner without top header flags/logo */}
      <header className="bg-gradient-to-r from-[#0b1c3a] via-[#163a75] to-[#0b1c3a] border-b-2 border-[#eab308] py-3.5 px-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#facc15]" />
            <h1 className="text-xs sm:text-sm font-black text-white leading-tight font-sans tracking-tight">
              ቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
            </h1>
          </div>
          <p className="text-[9px] sm:text-[10px] font-extrabold text-[#fef08a] tracking-wider leading-none mt-1">
            Benishangul-Gumuz-Region-Police-collage-Badge-System
          </p>
          <div className="inline-block bg-[#facc15] text-[#0b1c3a] text-[9px] font-black px-2.5 py-0.5 rounded shadow uppercase tracking-wider mt-1.5">
            ኦፊሴላዊ የኮሌጅ ባጅ ማረጋገጫ ፖርታል
          </div>
        </div>
      </header>

      {/* Main Public Verification Body */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6 w-full flex-1 space-y-6">
        {/* Quick Search Bar hidden when scanned as requested: "ስካን ሲደረግ ይህን እንዳይመጣ አድርግ ሂድን አድርግ" */}

        {/* Loading State */}
        {loading ? (
          <div className="bg-slate-900 p-12 rounded-3xl text-center shadow-2xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-300">
              የባጁ መረጃ ከቤኒሻንጉል ጉሙዝ ፖሊስ ኮሌጅ ዳታቤዝ በመረጋገጥ ላይ ነው...
            </p>
          </div>
        ) : badge && !notFound ? (
          /* Verified Badge Container */
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 space-y-6">
            {/* Status Header Banner */}
            <div
              className={`p-4 rounded-2xl flex items-center gap-3.5 shadow-xl border ${
                badge.status === "ACTIVE"
                  ? "bg-emerald-950/90 text-emerald-100 border-emerald-500/60"
                  : "bg-rose-950/90 text-rose-100 border-rose-500/60"
              }`}
            >
              {badge.status === "ACTIVE" ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-rose-400 shrink-0" />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black tracking-wide">
                    {badge.status === "ACTIVE"
                      ? "✅ ኦፊሴላዊ የተረጋገጠ የኮሌጅ ባጅ"
                      : "⚠️ ያልተረጋገጠ ወይም የተሰረዘ ባጅ"}
                  </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-tight font-medium">
                  {badge.status === "ACTIVE"
                    ? "ይህ ባጅ በቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ ዳታቤዝ ውስጥ ኦፊሴላዊ ሆኖ የተመዘገበና የፀና ነው::"
                    : "ይህ ባጅ አገልግሎት የማይሰጥ ወይም የተሰረዘ ስለሆነ አያገልግልም::"}
                </p>
              </div>

              <div className="text-right hidden sm:block shrink-0">
                <span className="text-[9px] uppercase text-slate-400 block font-mono font-bold">
                  VERIFIED AT
                </span>
                <span className="text-xs font-mono font-black text-amber-400">
                  {verifiedAt}
                </span>
              </div>
            </div>

            {/* Mobile / Screen Navigation View Selector */}
            <div className="flex items-center justify-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveViewTab("DETAILS")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  activeViewTab === "DETAILS"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                የባለባጁ መረጃ
              </button>
              <button
                onClick={() => setActiveViewTab("FRONT")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  activeViewTab === "FRONT"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                የፊት ገፅ
              </button>
              <button
                onClick={() => setActiveViewTab("BACK")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  activeViewTab === "BACK"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                የኋላ ገፅ
              </button>
            </div>

            {/* View 1: Detailed Officer Identity */}
            {activeViewTab === "DETAILS" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                  {/* Photo & Badge ID */}
                  <div className="flex flex-col items-center bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
                    <div className="relative w-36 h-48 rounded-xl border-2 border-amber-400 bg-slate-900 overflow-hidden shadow-2xl ring-4 ring-amber-400/20">
                      <img
                        src={badge.headshotPhoto}
                        alt={badge.fullNameAmharic}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute top-1 right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow uppercase">
                        VERIFIED
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-100 font-sans">
                        {badge.fullNameAmharic}
                      </h3>
                      <p className="text-xs font-bold text-amber-300">
                        {badge.fullNameEnglish}
                      </p>
                    </div>

                    <div className="inline-block px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono font-black text-xs rounded-lg">
                      ባጅ ቁጥር: {badge.badgeId}
                    </div>
                  </div>

                  {/* Attribute Details Sheet */}
                  <div className="sm:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="font-black text-slate-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        የባለባጁ ኦፊሴላዊ መረጃዎች
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        ● FIRESTORE SECURED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">
                          የሚሰራበት ክፍል / Department:
                        </span>
                        <p className="text-sm font-black text-slate-100 font-sans">
                          {badge.departmentAmharic}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">
                          {badge.departmentEnglish}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">
                          ኃላፊነት/ማዕረግ / Rank & Role:
                        </span>
                        <p className="text-sm font-black text-amber-400 font-sans">
                          {badge.rankAmharic}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">
                          {badge.rankEnglish}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">
                          ስልክ ቁጥር / Phone:
                        </span>
                        <p className="text-sm font-mono font-black text-slate-100">
                          {badge.phoneNumber}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">
                          የባጁ ሁኔታ / Status:
                        </span>
                        <span className="inline-block px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black rounded-lg uppercase">
                          {badge.status === "ACTIVE" ? "ኦፊሴላዊ (ACTIVE)" : badge.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">
                          የተሰጠበት ቀን / Issued:
                        </span>
                        <p className="text-xs font-mono font-black text-slate-200">
                          {badge.issueDate}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">
                          የሚያበቃበት ቀን / Expiry:
                        </span>
                        <p className="text-xs font-mono font-black text-slate-200">
                          {badge.expiryDate}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>ተቋም፡ ቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ</span>
                      <span className="font-mono text-amber-400 font-bold">AUTH-{badge.badgeId}</span>
                    </div>
                  </div>
                </div>

                {/* Both Front and Back Cards - Fully visible without any cutoff */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-black text-slate-300 text-center uppercase tracking-wider mb-4">
                    የባጁ ዲጂታል የፊት እና የኋላ ገፅ (DIGITAL BADGE CARDS)
                  </h4>
                  <div className="flex flex-wrap items-center justify-center gap-6 py-2 overflow-visible">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                        የፊት ገፅ (FRONT SIDE)
                      </span>
                      <BadgeCardFront data={badge} scale={0.85} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                        የኋላ ገፅ (BACK SIDE)
                      </span>
                      <BadgeCardBack data={badge} scale={0.85} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Front Card Solo */}
            {activeViewTab === "FRONT" && (
              <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-fadeIn overflow-visible">
                <span className="text-xs font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  የኮሌጅ ባጁ የፊት ገፅ እይታ
                </span>
                <BadgeCardFront data={badge} scale={0.95} />
              </div>
            )}

            {/* View 3: Back Card Solo */}
            {activeViewTab === "BACK" && (
              <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-fadeIn overflow-visible">
                <span className="text-xs font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  የኮሌጅ ባጁ የኋላ ገፅ እይታ (ከQR ኮድ ጋር)
                </span>
                <BadgeCardBack data={badge} scale={0.95} />
              </div>
            )}
          </div>
        ) : (
          /* Not Found / Unverified State */
          <div className="bg-slate-900 p-8 sm:p-12 rounded-3xl text-center shadow-2xl border border-rose-950 space-y-4">
            <AlertOctagon className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
            <h2 className="text-lg font-black text-rose-400">
              የተፈለገው የባጅ ቁጥር ({badgeId}) በዳታቤዝ ውስጥ አልተገኘም!
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
              ይህ ባጅ በቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ ኦፊሴላዊ ሲስተም ውስጥ ያልተመዘገበ ወይም ውድቅ የተደረገ ሊሆን ስለሚችል እባክዎን የባጅ ቁጥሩን ያረጋግጡ::
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-slate-500">
              አስቸኳይ ጥቆማ ለማድረስ በስልክ ቁጥር <span className="text-amber-400">9991</span> ይደውሉ::
            </div>
          </div>
        )}
      </main>

      {/* Public Footer - Strictly No System Dashboard Links */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-4 text-center text-[10px] text-slate-500 space-y-1 font-mono">
        <p className="text-slate-400 font-bold">
          © {new Date().getFullYear()} ቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
        </p>
        <p className="text-slate-600">
          Official Digital Badge Verification System • Benishangul Gumuz Region Police College
        </p>
      </footer>
    </div>
  );
};
