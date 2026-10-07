"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface SuperSidebarCardProps {
  onUpgradeClick: () => void;
  className?: string;
}

export const SuperSidebarCard: React.FC<SuperSidebarCardProps> = ({
  onUpgradeClick,
  className = "",
}) => {
  return (
    <div
      className={`rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] p-5 shadow-xs flex flex-col relative overflow-hidden select-none transition-all ${className}`}
    >
      {/* Decorative top iridescent glow line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF4B4B] via-[#FF9600] via-[#58CC02] via-[#1CB0F6] to-[#CE82FF]" />

      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF4B4B]/10 via-[#58CC02]/10 to-[#CE82FF]/10 border border-[#CE82FF]/30 text-[11px] font-black uppercase tracking-wider text-[#CE82FF] dark:text-[#E9B7FF]">
          <Sparkles className="w-3.5 h-3.5" /> SUPER
        </span>
        <span className="text-[11px] font-black uppercase tracking-wider text-[#58CC02]">
          FREE TRIAL
        </span>
      </div>

      <h3 className="text-lg font-black text-[#4B4B4B] dark:text-white leading-tight mb-1.5">
        Try Super Free for 2 Weeks
      </h3>

      <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-snug mb-4">
        No ads, personalized practice, and unlimited hearts to power your learning!
      </p>

      {/* Upgrade to Super Interactive Button */}
      <button
        type="button"
        onClick={onUpgradeClick}
        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#CE82FF] via-[#1CB0F6] to-[#00CD9C] hover:opacity-95 active:translate-y-0.5 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Upgrade to Super</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
};
