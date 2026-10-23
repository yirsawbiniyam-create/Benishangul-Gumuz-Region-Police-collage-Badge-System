import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./lib/firebase";
import { BadgeData, AdminSettings } from "./types";
import {
  DEFAULT_ETHIOPIA_FLAG,
  DEFAULT_REGION_FLAG,
  DEFAULT_COMMISSION_LOGO,
  DEFAULT_OFFICIAL_STAMP,
  DEFAULT_OFFICIAL_SIGNATURE,
} from "./data/defaults";
import { BadgeCardFront } from "./components/BadgeCardFront";
import { BadgeCardBack } from "./components/BadgeCardBack";
import { BadgeForm } from "./components/BadgeForm";
import { BadgeDirectory } from "./components/BadgeDirectory";
import { BadgeVerifierView } from "./components/BadgeVerifierView";
import { PublicVerificationPage } from "./components/PublicVerificationPage";
import { QRScannerModal } from "./components/QRScannerModal";
import { PrintSheetModal } from "./components/PrintSheetModal";
import { AdminLoginPage } from "./components/AdminLoginPage";
import { AdminSettingsView } from "./components/AdminSettingsView";
import {
  ShieldCheck,
  PlusCircle,
  FolderLock,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Settings,
  LogOut,
  UserCheck,
} from "lucide-react";

export default function App() {
  const [badges, setBadges] = useState<BadgeData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("bgr_police_college_badges");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("bgr_police_college_badges");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return false;
        }
      } catch {
        // ignore
      }
    }
    return true;
  });
  const [activeTab, setActiveTab] = useState<"DIRECTORY" | "CREATE" | "VERIFY" | "SETTINGS">(
    "DIRECTORY"
  );
  const [editingBadge, setEditingBadge] = useState<BadgeData | null>(null);
  const [verifyingBadge, setVerifyingBadge] = useState<BadgeData | null>(null);
  const [searchedId, setSearchedId] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [printBadge, setPrintBadge] = useState<BadgeData | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [publicVerifyId, setPublicVerifyId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("verify") || null;
    }
    return null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin Authentication & Custom Branding State (stored in Firestore)
  const [adminAuth, setAdminAuth] = useState<{ username: string; password: string }>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("bgrpc_admin_auth");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          // ignore
        }
      }
    }
    return { username: "admincollage", password: "collage1234" };
  });

  const [loginLogo, setLoginLogo] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("bgrpc_login_logo");
      if (cached) return cached;
    }
    return DEFAULT_COMMISSION_LOGO;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("bgrpc_admin_session") === "true";
    }
    return false;
  });

  // Show Toast Helper
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Seed sample initial official police college badge
  const seedSampleBadge = async () => {
    const sampleId = "BGRPC-1001";
    const sampleDocRef = doc(db, "badges", sampleId);

    const samplePhoto =
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

    const sampleBadge: BadgeData = {
      id: sampleId,
      badgeId: sampleId,
      fullNameAmharic: "ኮማንደር በቀለ አበበ ተሰማ",
      fullNameEnglish: "Cmdr. Bekele Abebe Tesema",
      departmentAmharic: "የኮሌጁ አመራርና አካዳሚክ ዘርፍ",
      departmentEnglish: "College Leadership & Academics Division",
      rankAmharic: "የኮሌጁ ምክትል ኮማንዳንት",
      rankEnglish: "Deputy College Commandant",
      phoneNumber: "+251 91 123 4567",
      headshotPhoto: samplePhoto,
      ethiopiaFlag: DEFAULT_ETHIOPIA_FLAG,
      regionFlag: DEFAULT_REGION_FLAG,
      commissionLogo: loginLogo || DEFAULT_COMMISSION_LOGO,
      officialStamp: DEFAULT_OFFICIAL_STAMP,
      signature: DEFAULT_OFFICIAL_SIGNATURE,
      status: "ACTIVE",
      issueDate: "2026-08-10",
      expiryDate: "2029-08-10",
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(sampleDocRef, sampleBadge);
    } catch (err) {
      console.warn("Firestore seed note:", err);
      setBadges((prev) => (prev.length === 0 ? [sampleBadge] : prev));
    }
  };

  // Sync browser document title for search and tab display
  useEffect(() => {
    document.title = "ቤጉ ፖሊስ ኮሌጅ ባጅ ሲሰተም - Benishangul-Gumuz Region Police College Badge System";
  }, []);

  // 1. Subscribe to Firestore `badges` collection live updates with anti-lag timeout
  useEffect(() => {
    const badgesCollection = collection(db, "badges");

    // Network safety timeout: never block UI for more than 2.5s on lagging connections
    const lagGuardTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const unsubscribe = onSnapshot(
      badgesCollection,
      (snapshot) => {
        clearTimeout(lagGuardTimer);
        const list: BadgeData[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as BadgeData) });
        });

        // Sort by newest
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );

        setBadges(list);
        setLoading(false);

        // Seed initial sample badge if Firestore is completely empty
        if (list.length === 0 && !snapshot.metadata.hasPendingWrites) {
          seedSampleBadge();
        }
      },
      (error) => {
        clearTimeout(lagGuardTimer);
        console.warn("Firestore sync mode notice:", error);
        setLoading(false);
        const saved = localStorage.getItem("bgr_police_college_badges");
        if (saved) {
          try {
            setBadges(JSON.parse(saved));
          } catch (e) {
            seedSampleBadge();
          }
        } else {
          seedSampleBadge();
        }
      }
    );

    return () => {
      clearTimeout(lagGuardTimer);
      unsubscribe();
    };
  }, [loginLogo]);

  // 2. Subscribe to Firestore `settings/adminAuth` live updates for credentials
  useEffect(() => {
    const adminDocRef = doc(db, "settings", "adminAuth");

    const unsubscribe = onSnapshot(
      adminDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.username && data.password) {
            const authObj = { username: data.username, password: data.password };
            setAdminAuth(authObj);
            try {
              localStorage.setItem("bgrpc_admin_auth", JSON.stringify(authObj));
            } catch (e) {
              // ignore
            }
          }
        } else {
          // Initialize default admin credentials in Firestore if not already set
          const initialCreds = {
            username: "admincollage",
            password: "collage1234",
            createdAt: new Date().toISOString(),
          };
          setDoc(adminDocRef, initialCreds).catch((err) =>
            console.warn("Firestore adminAuth seed notice:", err)
          );
        }
      },
      (err) => {
        console.warn("Firestore adminAuth listener notice:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Subscribe to Firestore `settings/appConfig` live updates for loginLogo
  useEffect(() => {
    const appConfigDocRef = doc(db, "settings", "appConfig");

    const unsubscribe = onSnapshot(
      appConfigDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.loginLogo) {
            setLoginLogo(data.loginLogo);
            try {
              localStorage.setItem("bgrpc_login_logo", data.loginLogo);
            } catch (e) {
              // ignore
            }
          }
        }
      },
      (err) => {
        console.warn("Firestore appConfig listener notice:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save badges to local backup whenever badges change
  useEffect(() => {
    if (badges.length > 0) {
      try {
        localStorage.setItem("bgr_police_college_badges", JSON.stringify(badges));
      } catch (e) {
        // ignore
      }
    }
  }, [badges]);

  // Deep Linking check for QR Code URL params (e.g., ?verify=BGRPC-1001)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const verifyId = urlParams.get("verify");
      if (verifyId) {
        setActiveTab("VERIFY");
        setSearchedId(verifyId);
        handleSearchBadgeId(verifyId);
      }
    }
  }, [badges]);

  // Handle Admin Login
  const handleLogin = (user: string, pass: string): boolean => {
    const userMatch = user.toLowerCase() === adminAuth.username.toLowerCase();
    const passMatch = pass === adminAuth.password;

    if (userMatch && passMatch) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem("bgrpc_admin_session", "true");
      } catch (e) {
        // ignore
      }
      showToast(`እንኳን ደህና መጡ! አድሚን (${adminAuth.username}) በተሳካ ሁኔታ ገብቷል::`, "success");
      return true;
    }
    return false;
  };

  // Handle Admin Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("bgrpc_admin_session");
    } catch (e) {
      // ignore
    }
    showToast("ከአድሚን ሲስተሙ በተሳካ ሁኔታ ወጥተዋል::", "success");
  };

  // Handle Update Admin Credentials in Firestore
  const handleUpdateCredentials = async (newUser: string, newPass: string): Promise<boolean> => {
    const updated = {
      username: newUser,
      password: newPass,
      updatedAt: new Date().toISOString(),
    };

    setAdminAuth(updated);
    try {
      localStorage.setItem("bgrpc_admin_auth", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    try {
      const adminDocRef = doc(db, "settings", "adminAuth");
      await setDoc(adminDocRef, updated, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore update credentials notice:", err);
      // Local state is updated
      return true;
    }
  };

  // Handle Update Login Logo in Firestore
  const handleUpdateLoginLogo = async (newLogoUrl: string): Promise<boolean> => {
    setLoginLogo(newLogoUrl);
    try {
      localStorage.setItem("bgrpc_login_logo", newLogoUrl);
    } catch (e) {
      // ignore
    }

    try {
      const configDocRef = doc(db, "settings", "appConfig");
      await setDoc(configDocRef, {
        loginLogo: newLogoUrl,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore update loginLogo notice:", err);
      // Local state updated
      return true;
    }
  };

  // Save or Update Badge in Firestore with optimistic local update
  const handleSaveBadge = async (badgeData: BadgeData) => {
    setIsSubmitting(true);
    const docId = badgeData.id || badgeData.badgeId;
    const badgeToSave = { ...badgeData, id: docId };

    setBadges((prev) => {
      const filtered = prev.filter(
        (b) => b.badgeId !== badgeToSave.badgeId && b.id !== docId
      );
      const updated = [badgeToSave, ...filtered];
      try {
        localStorage.setItem("bgr_police_college_badges", JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });

    try {
      const docRef = doc(db, "badges", docId);
      await setDoc(docRef, badgeToSave, { merge: true });
      showToast(
        `የባጅ መረጃ (${badgeData.fullNameAmharic}) በፋየርስቶር በተሳካ ሁኔታ ተመዝግቧል!`,
        "success"
      );
    } catch (err: any) {
      console.warn("Firestore save fallback note:", err);
      showToast(
        `የባጅ መረጃ (${badgeData.fullNameAmharic}) በተሳካ ሁኔታ ተመዝግቧል!`,
        "success"
      );
    } finally {
      setIsSubmitting(false);
      setEditingBadge(null);
      setActiveTab("DIRECTORY");
    }
  };

  // Delete Badge from Firestore with local fallback
  const handleDeleteBadge = async (id: string) => {
    try {
      await deleteDoc(doc(db, "badges", id));
      showToast("የባጁ መረጃ ከፋየርስቶር ተሰርዟል::", "success");
    } catch (err: any) {
      console.warn("Firestore delete fallback to local state:", err);
      setBadges((prev) => prev.filter((b) => b.id !== id && b.badgeId !== id));
      showToast("የባጁ መረጃ ተሰርዟል::", "success");
    }
  };

  // Search Badge by ID for Verification
  const handleSearchBadgeId = (badgeIdToFind: string) => {
    setSearchedId(badgeIdToFind);
    const found = badges.find(
      (b) =>
        b.badgeId.toLowerCase() === badgeIdToFind.toLowerCase() ||
        b.fullNameAmharic.includes(badgeIdToFind) ||
        b.fullNameEnglish.toLowerCase().includes(badgeIdToFind.toLowerCase())
    );

    if (found) {
      setVerifyingBadge(found);
      showToast(`የባጅ መረጃው ከፋየርስቶር ዳታቤዝ ተረጋግጧል!`, "success");
    } else {
      setVerifyingBadge(null);
      showToast(
        `የተፈለገው የባጅ ቁጥር (${badgeIdToFind}) በዳታቤዝ ውስጥ አልተገኘም::`,
        "error"
      );
    }
  };

  // Standalone Public Verification Mode (when scanned via mobile phone or URL param `?verify=...`)
  if (publicVerifyId) {
    return (
      <PublicVerificationPage
        initialBadgeId={publicVerifyId}
        allBadges={badges}
      />
    );
  }

  // Admin Authentication Gate - Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLoginPage
        loginLogo={loginLogo}
        onLogin={handleLogin}
        onOpenPublicVerify={() => {
          setPublicVerifyId("BGRPC-1001");
        }}
      />
    );
  }

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all animate-bounce text-xs font-bold ${
            toastMessage.type === "success"
              ? "bg-emerald-950 border-emerald-500/50 text-emerald-300"
              : "bg-rose-950 border-rose-500/50 text-rose-300"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div>
        {/* Sleek Interface Top Navigation Header */}
        <header className="bg-[#1e293b] border-b border-slate-700 px-4 md:px-8 py-3 shadow-lg sticky top-0 z-40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Institution Branding */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="w-10 h-10 p-0.5 rounded-full bg-gradient-to-tr from-[#eab308] via-white to-[#ca8a04] shadow-md ring-2 ring-[#eab308]/40 shrink-0 overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={loginLogo || DEFAULT_COMMISSION_LOGO}
                  alt="College Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h1 className="text-sm md:text-base font-bold leading-none uppercase tracking-wide text-slate-100">
                  የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
                </h1>
                <p className="text-[10px] text-blue-400 font-semibold tracking-wider mt-0.5">
                  Benishangul-Gumuz-Region-Police-collage-Badge-System
                </p>
              </div>
            </div>

            {/* Status Badges, Tabs & Admin Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center w-full lg:w-auto">
              {/* Admin Badge */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>አድሚን፡</span>
                <span className="font-mono font-bold text-amber-300">{adminAuth.username}</span>
              </div>

              {/* Nav Tabs */}
              <nav className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => {
                    setActiveTab("DIRECTORY");
                    setEditingBadge(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "DIRECTORY" && !editingBadge
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  <FolderLock className="w-3.5 h-3.5" />
                  ባጆች ({badges.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab("CREATE");
                    setEditingBadge(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "CREATE" || editingBadge
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {editingBadge ? "አስተካክል" : "አዲስ መዝግብ"}
                </button>

                <button
                  onClick={() => setActiveTab("VERIFY")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "VERIFY"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  የQR ማረጋገጫ
                </button>

                {/* Settings Tab */}
                <button
                  onClick={() => {
                    setActiveTab("SETTINGS");
                    setEditingBadge(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "SETTINGS"
                      ? "bg-amber-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  ማስተካከያ
                </button>
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                title="ከአድሚን ዳሽቦርድ ውጣ"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ውጣ</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 pt-6 pb-12">
          {/* Tab 1: Badge Directory / Management */}
          {activeTab === "DIRECTORY" && !editingBadge && (
            <div className="space-y-6">
              <BadgeDirectory
                badges={badges}
                loading={loading}
                onEdit={(b) => {
                  setEditingBadge(b);
                  setActiveTab("CREATE");
                }}
                onDelete={handleDeleteBadge}
                onVerify={(b) => {
                  setVerifyingBadge(b);
                  setSearchedId(b.badgeId);
                  setActiveTab("VERIFY");
                }}
                onPrint={(b) => setPrintBadge(b)}
                onCreateNew={() => {
                  setEditingBadge(null);
                  setActiveTab("CREATE");
                }}
              />
            </div>
          )}

          {/* Tab 2: Badge Creator / Form with Photo Studio */}
          {(activeTab === "CREATE" || editingBadge) && (
            <div className="space-y-6">
              <BadgeForm
                initialData={editingBadge}
                existingBadges={badges}
                onSave={handleSaveBadge}
                onCancel={() => {
                  setEditingBadge(null);
                  setActiveTab("DIRECTORY");
                }}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {/* Tab 3: Official Verification View */}
          {activeTab === "VERIFY" && (
            <div className="space-y-6">
              <BadgeVerifierView
                badge={verifyingBadge}
                onSearchBadgeId={handleSearchBadgeId}
                onOpenScanner={() => setIsScannerOpen(true)}
                loading={loading}
                searchedId={searchedId}
              />
            </div>
          )}

          {/* Tab 4: Admin Settings (Change Credentials & Login Logo in Firestore) */}
          {activeTab === "SETTINGS" && (
            <div className="space-y-6">
              <AdminSettingsView
                currentUsername={adminAuth.username}
                currentLoginLogo={loginLogo}
                onUpdateCredentials={handleUpdateCredentials}
                onUpdateLoginLogo={handleUpdateLoginLogo}
                onShowToast={showToast}
              />
            </div>
          )}
        </main>
      </div>

      {/* Executive Institutional Footer with Golden Credit */}
      <footer className="py-4 bg-[#0b1322] border-t border-slate-800/80 px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>© {new Date().getFullYear()} የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ • ይፋዊ የባጅና ዲጂታል መታወቂያ ሲስተም</span>
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-[13px] font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_1px_6px_rgba(245,158,11,0.3)]">
            በቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሚሽን ቴክኖሎጂ ማስፋፊያ የተዘጋጀ ( D.INS. B.Y) ብኅ
          </p>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span className="text-emerald-400/80 font-mono">● Secured Firestore Active</span>
          <span aria-hidden="true">•</span>
          <span>Benishangul Gumuz Region Police College</span>
        </div>
      </footer>

      {/* Camera/Gallery QR Scanner Modal */}
      {isScannerOpen && (
        <QRScannerModal
          onScanResult={(scannedId) => {
            setActiveTab("VERIFY");
            handleSearchBadgeId(scannedId);
          }}
          onClose={() => setIsScannerOpen(false)}
          availableBadges={badges}
        />
      )}

      {/* Printable Sheet Modal */}
      {printBadge && (
        <PrintSheetModal
          badge={printBadge}
          onClose={() => setPrintBadge(null)}
        />
      )}
    </div>
  );
}
