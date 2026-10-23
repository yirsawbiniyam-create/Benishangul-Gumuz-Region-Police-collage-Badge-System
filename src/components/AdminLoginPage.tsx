import React, { useState, useEffect } from "react";
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Zap,
  CheckCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { DEFAULT_COMMISSION_LOGO, DEFAULT_ETHIOPIA_FLAG, DEFAULT_REGION_FLAG } from "../data/defaults";

interface AdminLoginPageProps {
  loginLogo?: string;
  onLogin: (username: string, pass: string) => boolean;
  onOpenPublicVerify?: () => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  loginLogo,
  onLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  // Security / Anti-Brute Force Protection State
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem("bgrpc_login_failed_count");
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem("bgrpc_login_lockout_until");
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [remainingLockoutSecs, setRemainingLockoutSecs] = useState<number>(0);

  // Countdown timer for lockout
  useEffect(() => {
    const checkLockout = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        setRemainingLockoutSecs(remaining);
      } else {
        if (remainingLockoutSecs > 0) {
          setRemainingLockoutSecs(0);
          setFailedAttempts(0);
          try {
            sessionStorage.removeItem("bgrpc_login_failed_count");
            sessionStorage.removeItem("bgrpc_login_lockout_until");
          } catch {
            // ignore
          }
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil, remainingLockoutSecs]);

  const isLockedOut = remainingLockoutSecs > 0;
  const activeLogo = loginLogo || DEFAULT_COMMISSION_LOGO;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    // Input sanitization & security checks
    const sanitizedUser = username.trim().slice(0, 60);
    const sanitizedPass = password.trim().slice(0, 100);

    if (!sanitizedUser || !sanitizedPass) {
      setErrorMessage("እባክዎ ዩሰርኔም እና የይለፍ ቃል ያስገቡ!");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    // Fast 0-lag execution with a micro-frame for smooth button animation
    requestAnimationFrame(() => {
      const success = onLogin(sanitizedUser, sanitizedPass);
      if (!success) {
        const newFailed = failedAttempts + 1;
        setFailedAttempts(newFailed);
        try {
          sessionStorage.setItem("bgrpc_login_failed_count", String(newFailed));
        } catch {
          // ignore
        }

        if (newFailed >= MAX_FAILED_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
          setLockoutUntil(lockoutTime);
          try {
            sessionStorage.setItem("bgrpc_login_lockout_until", String(lockoutTime));
          } catch {
            // ignore
          }
          setErrorMessage(
            `የደህንነት ማስጠንቀቂያ፡ በተደጋጋሚ 5 ጊዜ የተሳሳተ ሙከራ ተደርጓል! ሲስተሙ ለደህንነት ሲባል ለ30 ሰከንድ ታግዷል::`
          );
        } else {
          setErrorMessage(
            `የተሳሳተ ዩሰርኔም ወይም የይለፍ ቃል አስገብተዋል! (የቀረው ሙከራ: ${
              MAX_FAILED_ATTEMPTS - newFailed
            })`
          );
        }
        setLoading(false);
      } else {
        // Reset security counters on success
        setFailedAttempts(0);
        try {
          sessionStorage.removeItem("bgrpc_login_failed_count");
          sessionStorage.removeItem("bgrpc_login_lockout_until");
        } catch {
          // ignore
        }
      }
    });
  };

  const handleUseDefaultCreds = () => {
    setUsername("admincollage");
    setPassword("collage1234");
    setErrorMessage("");
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col justify-between p-4 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Banner Flags & Header */}
      <div className="max-w-md w-full mx-auto pt-4 flex items-center justify-between px-3 relative z-10">
        <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
          <img
            src={DEFAULT_ETHIOPIA_FLAG}
            alt="Ethiopia Flag"
            className="w-7 h-4.5 object-cover rounded shadow"
          />
          <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase hidden sm:inline">
            የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
          <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase hidden sm:inline">
            ቤኒሻንጉል ጉሙዝ ክልል
          </span>
          <img
            src={DEFAULT_REGION_FLAG}
            alt="Region Flag"
            className="w-7 h-4.5 object-cover rounded shadow"
          />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6 relative z-10">
        <div className="bg-[#0f1d33]/90 backdrop-blur-2xl border border-blue-900/40 hover:border-blue-700/50 transition-colors rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-5 relative overflow-hidden ring-1 ring-white/10">
          {/* Subtle Accent Glow Line on top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-indigo-600" />

          {/* Logo & College Identity Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative group">
              <div className="w-24 h-24 p-1.5 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-xl ring-4 ring-amber-400/20 flex items-center justify-center bg-slate-900 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={activeLogo}
                  alt="College Login Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-slate-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow font-bold text-white"
                title="ይፋዊ የኮሌጁ አርማ"
              >
                ✓
              </div>
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-sans drop-shadow-sm">
                የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
              </h1>
              <p className="text-[11px] font-bold text-amber-300 tracking-wider mt-0.5">
                Benishangul-Gumuz-Region-Police-collage-Badge-System
              </p>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[10px] font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                የባጅ ሲስተም አድሚን ፖርታል (Admin Portal)
              </div>
            </div>
          </div>

          {/* Brute Force Lockout Notice */}
          {isLockedOut && (
            <div className="bg-rose-950/90 border-2 border-rose-500/80 text-rose-200 p-4 rounded-2xl flex items-start gap-3 shadow-lg animate-pulse">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-extrabold text-rose-100">
                  የደህንነት ጥበቃ ገደብ (Security Lockout Active)
                </p>
                <p className="text-rose-200 leading-relaxed">
                  ተደጋጋሚ የተሳሳተ ሙከራ በመደረጉ ሲስተሙ በጊዜያዊነት ተዘግቷል:: እባክዎ ይጠብቁ:
                </p>
                <div className="inline-flex items-center gap-1.5 bg-rose-900/70 border border-rose-500/50 px-2.5 py-1 rounded-lg font-mono font-bold text-amber-300 mt-1">
                  <span>የቀረው ጊዜ: {remainingLockoutSecs} ሰከንድ</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {!isLockedOut && errorMessage && (
            <div className="bg-rose-950/80 border border-rose-600/70 text-rose-200 text-xs font-bold p-3 rounded-xl flex items-center gap-2.5 shadow-md">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                የአድሚን ዩሰርኔም / Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  disabled={isLockedOut}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="admincollage"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 text-slate-100 font-mono text-sm border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  የይለፍ ቃል / Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLockedOut}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-950/80 text-slate-100 font-mono text-sm border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={isLockedOut}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  title={showPassword ? "ደብቅ" : "አሳይ"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button - Elevated High-End Police Blue & Gold */}
            <button
              type="submit"
              disabled={loading || isLockedOut}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:from-blue-600 hover:via-indigo-500 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/50 border border-blue-400/40 hover:border-amber-400/60 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>በማረጋገጥ ላይ...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span className="tracking-wide">ወደ ዳሽቦርድ ግባ / Login</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Default Credential Helper with Ultra-Professional "Auto Fill" Button */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 rounded-2xl border border-blue-950/80 shadow-md space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-slate-800/80 pb-1.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                የመነሻ ነባሪ መለያ (Default Credentials):
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/70 border border-emerald-600/40 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="text-xs font-mono text-amber-300 font-bold flex items-center justify-center gap-3 py-1 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="flex items-center gap-1">
                <span className="text-slate-400 font-sans font-medium">user:</span>{" "}
                <span className="text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">admincollage</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1">
                <span className="text-slate-400 font-sans font-medium">pass:</span>{" "}
                <span className="text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">collage1234</span>
              </span>
            </div>

            {/* Professional "በአንድ ጠቅታ ምላው (Auto Fill)" Button */}
            <button
              type="button"
              onClick={handleUseDefaultCreds}
              className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md active:scale-[0.98] ${
                autoFilled
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-emerald-900/40"
                  : "bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-amber-200 border-amber-500/40 hover:border-amber-400/80 shadow-amber-950/30"
              }`}
            >
              {autoFilled ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white animate-bounce" />
                  <span>በስኬት ተሞልቷል! (Auto Filled Successfully)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>በአንድ ጠቅታ ምላው (Auto Fill)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Golden Footer Text Requested by User */}
      <footer className="text-center py-4 relative z-10 px-4">
        <div className="inline-flex flex-col items-center gap-1 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <p className="text-xs sm:text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)] select-all">
              በቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሚሽን ቴክኖሎጂ ማስፋፊያ የተዘጋጀ ( D.INS. B.Y) ብኅ
            </p>
            <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">
            Secured Firestore DB • Real-Time Anti-Tamper Badge Architecture
          </span>
        </div>
      </footer>
    </div>
  );
};
