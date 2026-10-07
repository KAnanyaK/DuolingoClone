"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Target, Check, ChevronDown } from "lucide-react";

interface DailyGoalWidgetProps {
  className?: string;
}

const GOAL_OPTIONS = [
  { label: "Casual", xp: 10, desc: "5 mins / day" },
  { label: "Regular", xp: 20, desc: "10 mins / day" },
  { label: "Serious", xp: 30, desc: "15 mins / day" },
  { label: "Intense", xp: 50, desc: "25 mins / day" },
];

export const DailyGoalWidget: React.FC<DailyGoalWidgetProps> = ({
  className = "",
}) => {
  const { dailyEarnedXp, selectedGoalXp, setSelectedGoalXp, isDailyGoalAchieved } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const goal = selectedGoalXp || 20;
  const isGoalReached = isDailyGoalAchieved || (dailyEarnedXp !== undefined && dailyEarnedXp >= goal);
  const current = isGoalReached
    ? Math.max(dailyEarnedXp !== undefined ? dailyEarnedXp : goal, goal)
    : (dailyEarnedXp !== undefined ? dailyEarnedXp : 10);
  const percent = isGoalReached ? 100 : Math.min(100, Math.round((current / goal) * 100));

  return (
    <div
      ref={widgetRef}
      className={`rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] p-6 shadow-sm select-none relative transition-all duration-300 min-h-[195px] flex flex-col justify-between ${className}`}
    >
      {/* Top Accent Line Container with strictly scoped rounded overflow */}
      <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden rounded-t-[22px] pointer-events-none">
        <div
          className={`w-full h-full transition-colors duration-500 ${
            isGoalReached
              ? "bg-[#58CC02]"
              : "bg-gradient-to-r from-[#FFC800] via-[#FF9600] to-[#58CC02]"
          }`}
        />
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-xs flex-shrink-0 ${
              isGoalReached
                ? "bg-[#58CC02]/15 text-[#58CC02]"
                : "bg-[#FF9600]/15 text-[#FF9600]"
            }`}
          >
            {isGoalReached ? (
              <Check className="w-6 h-6 stroke-[3]" />
            ) : (
              <Target className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white leading-tight">
              Daily Goal
            </h3>
            <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] mt-0.5">
              {isGoalReached ? "Daily goal reached!" : `${goal} XP target`}
            </p>
          </div>
        </div>

        {/* Goal Selector Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border shadow-xs active:scale-95 ${
            isMenuOpen
              ? "bg-[#58CC02]/15 text-[#58CC02] border-[#58CC02]/40"
              : "bg-gray-100 dark:bg-[#202F36] hover:bg-gray-200 dark:hover:bg-[#2B3E48] text-[#4B4B4B] dark:text-[#E5E5E5] border-[#E5E5E5] dark:border-[#37464F]"
          }`}
          title="Change daily XP goal"
          aria-expanded={isMenuOpen}
        >
          <span>{goal} XP</span>
          <ChevronDown
            className={`w-3.5 h-3.5 stroke-[3] transition-transform duration-200 ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Goal Selection Section - Lengthens the widget cleanly inside the box */}
      {isMenuOpen && (
        <div className="my-4 pt-3.5 pb-2 border-t border-b border-[#E5E5E5] dark:border-[#263E4B] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#777777] dark:text-[#8FA2AC]">
              Set Your Daily Goal
            </span>
            <span className="text-[11px] font-bold text-[#777777] dark:text-[#93A4AC]">
              XP / day
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {GOAL_OPTIONS.map((opt) => {
              const isSelected = goal === opt.xp;
              return (
                <button
                  key={opt.xp}
                  type="button"
                  onClick={() => {
                    setSelectedGoalXp(opt.xp);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-black flex items-center justify-between cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#58CC02]/15 text-[#58CC02] border-[#58CC02]/50 shadow-xs"
                      : "border-[#E5E5E5] dark:border-[#263E4B] text-[#4B4B4B] dark:text-[#E5E5E5] hover:bg-gray-50 dark:hover:bg-[#202F36] bg-white dark:bg-[#1A2C34]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-black leading-snug text-[#4B4B4B] dark:text-white">
                      {opt.label}
                    </span>
                    <span className="text-xs font-bold text-[#777777] dark:text-[#8FA2AC] leading-snug">
                      {opt.desc}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-xl transition-colors ${
                        isSelected
                          ? "bg-[#58CC02] text-white"
                          : "bg-gray-100 dark:bg-[#25333A] text-[#777777] dark:text-[#93A4AC]"
                      }`}
                    >
                      {opt.xp} XP
                    </span>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#58CC02] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Description & Fractional XP */}
      <div className="flex items-baseline justify-between mt-4 mb-2.5 pt-1">
        <div className="flex items-center gap-1.5">
          {isGoalReached ? (
            <span className="text-sm font-black text-[#58CC02] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#58CC02] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              </span>
              Daily Goal Reached!
            </span>
          ) : (
            <span className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
              Earn {Math.max(0, goal - current)} more XP today
            </span>
          )}
        </div>
        <span
          className={`font-black text-sm sm:text-base ${
            isGoalReached ? "text-[#58CC02]" : "text-[#4B4B4B] dark:text-white"
          }`}
        >
          {current} / {goal} XP
        </span>
      </div>

      {/* Progress Bar Track & Fill */}
      <div className="relative w-full h-6 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 ${
            isGoalReached
              ? "bg-[#58CC02] shadow-[#58CC02]/50"
              : "bg-[#FFC800] dark:bg-[#FFC800]"
          }`}
          style={{ width: `${percent}%` }}
        />

        {/* Centered Percentage Tag */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#4B4B4B] dark:text-white drop-shadow-xs">
          {percent}%
        </span>
      </div>
    </div>
  );
};
