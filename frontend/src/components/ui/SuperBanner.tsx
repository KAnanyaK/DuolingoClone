"use client";

import React from "react";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

interface SuperBannerProps {
  onUpgradeClick: () => void;
  className?: string;
}

export const SuperBanner: React.FC<SuperBannerProps> = ({
  onUpgradeClick,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full rounded-3xl p-6 sm:p-7 border-2 sm:border-3 border-[#CE82FF]/40 dark:border-[#CE82FF]/30 bg-gradient-to-br from-white via-[#FAF5FF] to-white dark:from-[#1A2C34] dark:via-[#22213A] dark:to-[#1A2C34] shadow-md overflow-hidden select-none transition-all ${className}`}
    >
      {/* Decorative top iridescent glow line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF4B4B] via-[#FF9600] via-[#FFC800] via-[#58CC02] via-[#1CB0F6] to-[#CE82FF]" />

      {/* Background soft ambient glow */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-br from-[#CE82FF]/20 to-[#1CB0F6]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        {/* Left Content */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF4B4B]/15 via-[#58CC02]/15 to-[#CE82FF]/15 border border-[#CE82FF]/30 text-xs font-black uppercase tracking-wider text-[#CE82FF] dark:text-[#E9B7FF]">
              <Sparkles className="w-3.5 h-3.5" /> SUPER DUOLINGO
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#58CC02]/15 text-[#58CC02] text-xs font-black uppercase tracking-wider">
              2 WEEKS FREE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            <span className="bg-gradient-to-r from-[#FF4B4B] via-[#FF9600] via-[#FFC800] via-[#58CC02] via-[#1CB0F6] to-[#CE82FF] bg-clip-text text-transparent">
              Super duolingo
            </span>
            <span className="text-[#4B4B4B] dark:text-white ml-2">— Learn faster</span>
          </h2>

          <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-relaxed">
            Fast-track your language learning with unlimited hearts, zero ads, tailored mistake practice, and smart reminders!
          </p>
        </div>

        {/* Right CTA Button */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#CE82FF] via-[#1CB0F6] to-[#00CD9C] hover:opacity-95 active:translate-y-0.5 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <span>Upgrade to Super</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
