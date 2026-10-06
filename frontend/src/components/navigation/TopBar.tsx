"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { HeartsModal } from "@/components/ui/HeartsModal";
import { StreakPopover } from "@/components/ui/StreakPopover";

export interface TopBarProps {
  className?: string;
  showCourse?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  className = "",
  showCourse = true,
}) => {
  const {
    hearts,
    xp,
    streak,
    gems,
    currentCourse,
    setStats,
    isHeartsModalOpen,
    setIsHeartsModalOpen,
    heartsCooldownEndTime,
    refillHearts,
  } = useUserStore();

  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = useState(false);
  const [timeLeftText, setTimeLeftText] = useState<string>("Wait to refill in 10 mins");

  // Rehydrate user state on mount
  useEffect(() => {
    // 1. Check local storage for persistent cooldown
    const storedCooldown = localStorage.getItem("duo_hearts_cooldown");
    const storedHearts = localStorage.getItem("duo_hearts_count");

    let activeCooldown: number | null = null;
    if (storedCooldown) {
      const parsed = parseInt(storedCooldown, 10);
      if (!isNaN(parsed) && parsed > Date.now()) {
        activeCooldown = parsed;
      }
    }

    fetch("http://localhost:8000/api/users/1")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user state");
        return res.json();
      })
      .then((data) => {
        // If cooldown is active, preserve hearts at 0
        const parsedHearts = activeCooldown
          ? 0
          : storedHearts !== null
          ? parseInt(storedHearts, 10)
          : typeof data.hearts === "number"
          ? data.hearts
          : 5;

        const storedXp = localStorage.getItem("duo_user_xp");
        const defaultCalculatedXp = 50; // 5 completed lessons * 10 XP
        const effectiveXp =
          typeof data.total_xp === "number" && data.total_xp > 0
            ? data.total_xp
            : storedXp !== null
            ? parseInt(storedXp, 10)
            : defaultCalculatedXp;

        const storedGems = localStorage.getItem("duo_user_gems");
        const effectiveGems =
          typeof data.gems === "number"
            ? data.gems
            : storedGems !== null
            ? parseInt(storedGems, 10)
            : 500;

        setStats({
          hearts: parsedHearts,
          xp: effectiveXp,
          streak: typeof data.streak_days === "number" ? data.streak_days : data.streak || 1,
          gems: effectiveGems,
          heartsCooldownEndTime: activeCooldown,
        });
      })
      .catch(() => {
        const storedGems = localStorage.getItem("duo_user_gems");
        const fallbackGems = storedGems !== null ? parseInt(storedGems, 10) : 500;
        setStats({
          gems: fallbackGems,
          hearts: activeCooldown ? 0 : 5,
          heartsCooldownEndTime: activeCooldown,
        });
      })
      .finally(() => {
        const isDark = localStorage.getItem("duo_dark_mode") === "true";
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      });
  }, [setStats]);

  // Plan B Cooldown Timer: 10 mins countdown when hearts === 0 (persists through refresh)
  useEffect(() => {
    if (hearts > 0 || !heartsCooldownEndTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const remainingMs = heartsCooldownEndTime - now;

      if (remainingMs <= 0) {
        // Cooldown reached 0! Refill hearts to 5
        localStorage.removeItem("duo_hearts_cooldown");
        localStorage.setItem("duo_hearts_count", "5");
        fetch("http://localhost:8000/api/users/1/refill-hearts", { method: "POST" })
          .catch(() => {});
        refillHearts();
      } else {
        const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
        setTimeLeftText(`Wait to refill in ${remainingMinutes} mins`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [hearts, heartsCooldownEndTime, refillHearts]);

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between border-b border-[#e5e5e5] bg-white px-4 py-3 sm:px-8 font-nunito ${className}`}
    >
      {/* Current Course Selector */}
      <div className="flex items-center gap-3">
        {showCourse && (
          <button className="flex items-center gap-2 rounded-2xl border border-transparent px-3 py-1.5 transition-colors hover:bg-gray-100 cursor-pointer">
            <span className="text-2xl leading-none">{currentCourse.flag}</span>
            <span className="hidden sm:inline font-extrabold text-sm uppercase tracking-wider text-[#4B4B4B]">
              {currentCourse.title}
            </span>
          </button>
        )}
      </div>

      {/* Stats Cluster: Streak, Gems Counter, XP, Hearts & Cooldown */}
      <div className="flex items-center gap-3 sm:gap-6 relative">
        {/* Streak Cluster with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStreakPopoverOpen((prev) => !prev)}
            className="flex items-center gap-1.5 font-black text-[#FF9600] cursor-pointer hover:opacity-90 active:scale-95 transition-all p-1 rounded-2xl"
            title="Streak count"
            aria-label="Streak details"
          >
            {/* Duolingo Flame Fire Symbol from screenshot */}
            <svg
              className="w-7 h-7 filter drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer white badge border */}
              <path
                d="M50 4C52 4 78 28 78 54C78 72 65 86 50 86C35 86 22 72 22 54C22 28 48 4 50 4Z"
                fill="#FFFFFF"
              />
              {/* Outer vibrant orange body */}
              <path
                d="M50 9C51.5 9 73 30 73 54C73 68 62 81 50 81C38 81 27 68 27 54C27 30 48.5 9 50 9Z"
                fill="#FF9600"
              />
              {/* Inner yellow teardrop core */}
              <path
                d="M50 42C50 42 60 52 60 62C60 68 55.5 73 50 73C44.5 73 40 68 40 62C40 52 50 42 50 42Z"
                fill="#FFC800"
              />
            </svg>
            <span className="text-base sm:text-lg text-[#FF9600] font-black">{streak}</span>
          </button>

          {/* Floating Streak Popover Dialog */}
          <StreakPopover
            isOpen={isStreakPopoverOpen}
            onClose={() => setIsStreakPopoverOpen(false)}
            streakCount={streak}
          />
        </div>

        {/* Gems Counter - Blue Hexagonal Gem SVG from screenshot */}
        <div
          className="flex items-center gap-1.5 font-black text-[#1CB0F6] cursor-pointer hover:opacity-85 transition-opacity"
          title="Gems count"
        >
          {/* Blue Hexagonal Gem Symbol */}
          <svg
            className="w-7 h-7 filter drop-shadow-sm"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White outline padding */}
            <polygon
              points="50,6 88,26 88,74 50,94 12,74 12,26"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            {/* Main hexagonal deep sky blue body */}
            <polygon
              points="50,10 84,28 84,72 50,90 16,72 16,28"
              fill="#1CB0F6"
            />
            {/* Upper light shine reflection polygon */}
            <polygon
              points="50,14 78,30 50,46 22,30"
              fill="#52C9FF"
              opacity="0.9"
            />
            {/* Glossy top-left highlight dot */}
            <circle cx="34" cy="32" r="5" fill="#FFFFFF" opacity="0.95" />
          </svg>
          <span className="text-base sm:text-lg text-[#1CB0F6] font-black">{gems}</span>
        </div>

        {/* XP - Green Power lightning bolt with crisp white border */}
        <div
          className="flex items-center gap-1.5 font-black text-[#58CC02] cursor-pointer hover:opacity-85 transition-opacity"
          title="Total XP"
        >
          <svg
            className="w-7 h-7 filter drop-shadow-sm"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White outline path */}
            <path
              d="M56 6L20 54h26l-6 40 40-52H52l8-36z"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            {/* Main vibrant green lightning power body */}
            <path
              d="M56 6L20 54h26l-6 40 40-52H52l8-36z"
              fill="#58CC02"
            />
            {/* Light inner accent */}
            <path
              d="M52 14L28 50h20l-4 28 28-36H48l6-28z"
              fill="#79E026"
              opacity="0.6"
            />
          </svg>
          <span className="text-base sm:text-lg text-[#58CC02] font-black">{xp} XP</span>
        </div>

        {/* Hearts & Plan B Cooldown Indicator - Red Heart with crisp white border */}
        <div className="flex items-center gap-2">
          {hearts === 0 && (
            <span className="text-xs sm:text-sm font-black text-[#e5a800] bg-[#fff8e1] px-2.5 py-1 rounded-full border border-[#ffe082] whitespace-nowrap animate-pulse">
              {timeLeftText}
            </span>
          )}

          <div
            onClick={() => setIsHeartsModalOpen(true)}
            className="flex items-center gap-1.5 font-black text-[#FF4B4B] cursor-pointer hover:opacity-85 transition-opacity active:scale-95"
            title="Click to view Hearts"
          >
            {/* Red Heart with crisp white border from screenshot */}
            <svg
              className="w-7 h-7 filter drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* White outline stroke */}
              <path
                d="M50 86S16 64 16 34c0-12 10-22 22-22 8 0 12 4 12 4s4-4 12-4c12 0 22 10 22 22 0 30-34 52-34 52z"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="10"
                strokeLinejoin="round"
              />
              {/* Main red heart fill */}
              <path
                d="M50 84S18 63 18 34c0-11 9-20 20-20 7 0 12 4 12 4s5-4 12-4c11 0 20 9 20 20 0 29-32 50-32 50z"
                fill="#FF4B4B"
              />
              {/* Top-left soft highlight shine dot */}
              <circle cx="32" cy="30" r="5" fill="#FFA5A5" opacity="0.9" />
            </svg>
            <span className="text-base sm:text-lg text-[#FF4B4B] font-black">{hearts}</span>
          </div>
        </div>
      </div>

      {/* Out of Hearts / Refill Modal */}
      <HeartsModal
        isOpen={isHeartsModalOpen}
        onClose={() => setIsHeartsModalOpen(false)}
        isInLesson={false}
      />
    </header>
  );
};
