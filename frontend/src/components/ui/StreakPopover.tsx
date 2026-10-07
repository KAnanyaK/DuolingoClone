"use client";

import React, { useRef, useEffect } from "react";
import { Lock } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { StreakFreezeIcon } from "@/components/ui/StreakFreezeIcon";

interface StreakPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
}

export const StreakPopover: React.FC<StreakPopoverProps> = ({
  isOpen,
  onClose,
  streakCount,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { gems, streakFreezeActive, equipStreakFreeze, unequipStreakFreeze } = useUserStore();

  // Close when clicking elsewhere on the screen
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Use mousedown so it registers before other focus events
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Week Tracker: Sunday (0) to Saturday (6).
  // Resets at end of Saturday 11:59:59 PM (i.e. start of Sunday midnight).
  const getWeeklyCompletedDays = (): number[] => {
    if (typeof window === "undefined") return [];

    const now = new Date();
    // Calculate the start of the current week (Sunday at 00:00:00:000)
    const currentSunday = new Date(now);
    currentSunday.setDate(now.getDate() - now.getDay());
    currentSunday.setHours(0, 0, 0, 0);
    const weekKey = `duo_week_${currentSunday.getTime()}`;

    // Check if we have stored progress for this week
    const stored = localStorage.getItem("duo_weekly_completed_data");
    let activeDays: number[] = [];

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.weekKey === weekKey && Array.isArray(parsed.days)) {
          activeDays = parsed.days;
        }
      } catch {
        activeDays = [];
      }
    }

    const todayDay = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat

    // If streakCount is 0, no days completed
    if (streakCount <= 0) {
      return [];
    }

    // Determine the consecutive streak days ending on the active day.
    const calculatedDays: number[] = [];
    for (let i = 0; i < streakCount && i < 7; i++) {
      const d = todayDay - i;
      if (d >= 0) {
        calculatedDays.push(d);
      }
    }

    // Save updated days for this week
    localStorage.setItem(
      "duo_weekly_completed_data",
      JSON.stringify({ weekKey, days: calculatedDays })
    );

    return calculatedDays;
  };

  const completedDays = getWeeklyCompletedDays();

  // Days of week: Sunday (0) to Saturday (6)
  const daysOfWeek = [
    { label: "S", dayIdx: 0 },
    { label: "M", dayIdx: 1 },
    { label: "T", dayIdx: 2 },
    { label: "W", dayIdx: 3 },
    { label: "T", dayIdx: 4 },
    { label: "F", dayIdx: 5 },
    { label: "S", dayIdx: 6 },
  ].map((d) => ({
    label: d.label,
    active: completedDays.includes(d.dayIdx),
  }));

  return (
    <div
      ref={popoverRef}
      className="absolute top-14 sm:top-16 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] shadow-2xl border-2 border-[#E5E5E5] dark:border-[#263E4B] p-6 select-none font-nunito animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top pointer arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#E5E5E5] dark:border-b-[#263E4B]" />
      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-white dark:border-b-[#131F24]" />

      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-black text-[#4B4B4B] dark:text-white leading-tight">
            {streakCount} day streak
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] mt-1 leading-snug">
            You’ve earned your longest streak ever!
          </p>
        </div>
        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
          {streakFreezeActive ? (
            <StreakFreezeIcon width={52} height={52} className="filter drop-shadow-sm" />
          ) : (
            <svg
              className="w-14 h-14 filter drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 4C55 4 82 28 82 56C82 74 68 90 50 90C32 90 18 74 18 56C18 36 34 20 44 10C44 20 50 26 56 26C56 26 58 14 50 4Z"
                fill="#FFFFFF"
                stroke="#E5E5E5"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M50 8C54 8 78 30 78 56C78 72 65 86 50 86C35 86 22 72 22 56C22 38 36 24 45 14C45 22 50 28 55 28C55 28 57 16 50 8Z"
                fill="#FF9600"
              />
              <path
                d="M50 44C51 44 63 54 63 64C63 72 57 78 50 78C43 78 37 72 37 64C37 54 49 44 50 44Z"
                fill="#FFC800"
              />
              <ellipse cx="49" cy="67" rx="5" ry="6" fill="#FFF275" opacity="0.85" />
            </svg>
          )}
        </div>
      </div>

      {/* Days of week row */}
      <div className="mb-4 bg-gray-100 dark:bg-[#18272E] border border-[#E5E5E5] dark:border-[#263740] rounded-2xl p-3 flex items-center justify-between">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
            <span
              className={`text-xs font-black ${
                day.active
                  ? "text-[#FF9600]"
                  : "text-[#AFAFAF] dark:text-[#6A7E88]"
              }`}
            >
              {day.label}
            </span>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
                day.active
                  ? "bg-[#FF9600] text-white shadow-xs border-2 border-white dark:border-[#18272E]"
                  : "bg-gray-200 dark:bg-[#25333A] text-transparent"
              }`}
            >
              {day.active ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>

      {/* Streak Freeze Section */}
      <div className="rounded-2xl bg-gray-50 dark:bg-[#18272E] border-2 border-[#E5E5E5] dark:border-[#263740] p-4 flex flex-col gap-3 mb-3">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#131F24] border border-[#E5E5E5] dark:border-[#23353E] flex items-center justify-center flex-shrink-0 shadow-xs">
            <StreakFreezeIcon width={28} height={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-[#4B4B4B] dark:text-white leading-tight">
                Streak Freeze
              </h4>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  streakFreezeActive
                    ? "bg-[#1CB0F6]/20 text-[#1CB0F6]"
                    : "bg-gray-200 dark:bg-white/10 text-[#777777] dark:text-white/60"
                }`}
              >
                {streakFreezeActive ? "1 / 1 Equipped" : "0 / 1 Equipped"}
              </span>
            </div>
            <p className="text-xs font-bold text-[#777777] dark:text-[#8FA2AC] leading-snug mt-0.5">
              Protects your streak for 1 full day of inactivity.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#E5E5E5] dark:border-[#23353E]">
          {!streakFreezeActive ? (
            <button
              type="button"
              disabled={gems < 100}
              onClick={() => equipStreakFreeze()}
              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all select-none ${
                gems >= 100
                  ? "bg-[#1CB0F6] text-white shadow-[0_3px_0_#1899D6] hover:brightness-105 active:translate-y-0.5 active:shadow-none cursor-pointer"
                  : "bg-gray-200 dark:bg-[#25333A] text-gray-400 dark:text-[#6A7E88] cursor-not-allowed border border-gray-300 dark:border-[#37464F]"
              }`}
            >
              Equip (100 Gems)
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 w-full">
              <button
                disabled
                type="button"
                className="flex-1 py-2.5 px-3 rounded-xl border border-gray-300 dark:border-[#37464F] bg-gray-100 dark:bg-[#202F36] text-[#1CB0F6] font-black text-xs uppercase tracking-wider cursor-not-allowed select-none flex items-center justify-center gap-1.5"
              >
                <span>✓</span> Equipped
              </button>
              <button
                type="button"
                onClick={() => unequipStreakFreeze()}
                className="py-2 px-3 text-xs font-bold text-[#777777] dark:text-[#8FA2AC] hover:text-[#FF4B4B] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer select-none underline"
                title="Demo: Unequip and refund 100 gems"
              >
                [Demo] Unequip
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Friend Streaks Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF4B00] to-[#FF8000] p-4 text-white shadow-sm flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 12C50 12 70 32 70 54C70 68 60 78 50 78C40 78 30 68 30 54C30 32 50 12 50 12Z"
                fill="#FFC800"
              />
              <path
                d="M50 44C50 44 58 52 58 60C58 65 54 69 50 69C46 69 42 65 42 60C42 52 50 44 50 44Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-black text-sm text-white leading-tight">Friend Streaks</h4>
            <p className="text-xs font-bold text-white/90">0 active Friend Streaks</p>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 bg-white text-[#FF4B00] font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_2px_0_#d93d00] hover:bg-gray-50 active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0 cursor-pointer"
        >
          VIEW LIST
        </button>
      </div>

      {/* Streak Society Card */}
      <div className="rounded-2xl bg-gray-50 dark:bg-[#18272E] border-2 border-[#E5E5E5] dark:border-[#263740] p-3.5 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#23353E] text-gray-500 dark:text-[#6A7E88] flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex-1">
          <h4 className="font-black text-sm text-[#4B4B4B] dark:text-white leading-tight mb-0.5">
            Streak Society
          </h4>
          <p className="text-xs font-bold text-[#777777] dark:text-[#8FA2AC] leading-snug">
            Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
          </p>
        </div>
      </div>

      {/* View More / Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#1899D6] active:translate-y-1 active:border-b-0 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-sm select-none"
      >
        VIEW MORE
      </button>
    </div>
  );
};
