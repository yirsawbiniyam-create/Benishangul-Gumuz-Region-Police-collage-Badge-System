import React, { useState } from "react";
import {
  ShieldCheck,
  Key,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  User,
  RotateCcw,
} from "lucide-react";
import { DEFAULT_COMMISSION_LOGO } from "../data/defaults";
import { compressPhotoForStorage } from "../utils/imageProcessing";

interface AdminSettingsViewProps {
  currentUsername: string;
  currentLoginLogo: string;
  onUpdateCredentials: (newUsername: string, newPassword: string) => Promise<boolean>;
  onUpdateLoginLogo: (newLogo: string) => Promise<boolean>;
  onShowToast: (text: string, type: "success" | "error") => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  currentUsername,
  currentLoginLogo,
  onUpdateCredentials,
  onUpdateLoginLogo,
  onShowToast,
}) => {
  // Logo State
  const [logoPreview, setLogoPreview] = useState<string>(
    currentLoginLogo || DEFAULT_COMMISSION_LOGO
  );
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  // Credentials State
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [credError, setCredError] = useState("");

  // Handle Logo file upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onShowToast("እባክዎን ትክክለኛ የፎቶ/ምስል ፋይል ይምረጡ!", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      try {
        const compressed = await compressPhotoForStorage(rawDataUrl, 400, 400, 0.88);
        setLogoPreview(compressed);
        onShowToast("አዲሱ ሎጎ ተመርጧል! ለማጽናት 'ሎጎውን መዝግብ' የሚለውን ይጫኑ::", "success");
      } catch (err) {
        setLogoPreview(rawDataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Logo to Firestore
  const handleSaveLogo = async () => {
    setIsSavingLogo(true);
    try {
      const ok = await onUpdateLoginLogo(logoPreview);
      if (ok) {
        onShowToast("የሎጊን ገጽ ሎጎ በፋየርስቶር ዳታቤዝ በተሳካ ሁኔታ ተመዝግቧል!", "success");
      } else {
        onShowToast("ሎጎውን በፋየርስቶር መመዝገብ አልተቻለም::", "error");
      }
    } finally {
      setIsSavingLogo(false);
    }
  };

  // Reset Logo to Default
  const handleResetDefaultLogo = () => {
    setLogoPreview(DEFAULT_COMMISSION_LOGO);
  };

  // Handle Update Credentials
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");

    if (!newUsername.trim()) {
      setCredError("እባክዎ ትክክለኛ ዩሰርኔም ያስገቡ!");
      return;
    }

    if (newPassword.length < 4) {
      setCredError("አዲሱ የይለፍ ቃል ቢያንስ 4 ፊደላት/ቁጥሮች መሆን አለበት!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setCredError("አዲሱ የይለፍ ቃል እና ማረጋገጫው አይመሳሰሉም!");
      return;
    }

    setIsSavingCreds(true);
    try {
      const ok = await onUpdateCredentials(newUsername.trim(), newPassword.trim());
      if (ok) {
        onShowToast("የአድሚን ዩሰርኔም እና የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setCredError("የይለፍ ቃሉን መቀየር አልተቻለም:: እባክዎ እንደገና ይሞክሩ::");
      }
    } finally {
      setIsSavingCreds(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Executive Settings Header */}
      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-slate-100 tracking-wide font-sans">
              የኮሌጁ ሲስተም ማስተካከያ
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            የሎጊን ገጽ ይፋዊ ሎጎ ማስተካከል እና የአድሚን መለያ ደህንነት ማስተዳደሪያ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-700 px-3.5 py-1.5 rounded-xl">
          <User className="w-3.5 h-3.5 text-blue-400" />
          <span>የገባው አድሚን፡</span>
          <span className="font-mono font-bold text-amber-300">{currentUsername}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CARD 1: Login Page Logo Management */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700/80 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-700/80 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  የሎጊን ገጽ ይፋዊ ሎጎ
                </h3>
                <p className="text-[11px] text-slate-400">
                  በሎጊን ገጹ አናት ላይ የሚታየውን ይፋዊ የኮሌጅ ሎጎ እዚህ ይቀይሩ
                </p>
              </div>
            </div>

            {/* Live Logo Preview Box */}
            <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="relative group">
                <div className="w-28 h-28 p-1.5 rounded-full bg-gradient-to-tr from-[#eab308] via-white to-[#ca8a04] shadow-2xl ring-4 ring-[#eab308]/30 flex items-center justify-center bg-slate-950 overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Login Logo Preview"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs font-bold text-slate-200 block">
                  የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium tracking-wide uppercase">
                  ይፋዊ የሎጊን ገጽ ራስጌ እይታ
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <label className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md border border-blue-400/30 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-blue-200" />
                አዲስ ሎጎ ምረጥ
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleResetDefaultLogo}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 shadow-sm active:scale-[0.98] transition flex items-center gap-1.5 cursor-pointer"
                title="ወደ ነባሪው የኮሌጁ ሎጎ መልስ"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                ነባሪ
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveLogo}
            disabled={isSavingLogo}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/40 border border-amber-300/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSavingLogo ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                በማስቀመጥ ላይ...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                ሎጎውን በፋየርስቶር መዝግብ / Save Logo
              </>
            )}
          </button>
        </div>

        {/* CARD 2: Admin Security & Credentials */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700/80 flex flex-col justify-between space-y-6">
          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div className="pb-3 border-b border-slate-700/80 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  የአድሚን መለያና የይለፍ ቃል
                </h3>
                <p className="text-[11px] text-slate-400">
                  ወደ ዳሽቦርዱ ለመግባት የሚያገለግለውን ዩሰርኔምና ፓስዎርድ እዚህ ይቀይሩ
                </p>
              </div>
            </div>

            {credError && (
              <div className="bg-rose-950/80 border border-rose-600/70 text-rose-200 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{credError}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                የአድሚን ዩሰርኔም / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    setCredError("");
                  }}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-slate-100 text-sm font-mono font-bold border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                አዲስ የይለፍ ቃል / New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setCredError("");
                  }}
                  required
                  placeholder="ቢያንስ 4 ፊደላት ወይም ቁጥሮች"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 text-slate-100 text-sm font-mono border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                አዲሱን የይለፍ ቃል ያረጋግጡ / Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setCredError("");
                  }}
                  required
                  placeholder="የይለፍ ቃሉን በድጋሚ ያስገቡ"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-slate-100 text-sm font-mono border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingCreds}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:from-blue-600 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-950/50 border border-blue-400/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isSavingCreds ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  በማስቀመጥ ላይ...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  መለያውን በፋየርስቶር ቀይር / Update Credentials
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
