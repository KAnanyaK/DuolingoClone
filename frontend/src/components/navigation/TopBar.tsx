"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { HeartsModal } from "@/components/ui/HeartsModal";
import { HeartsPopover } from "@/components/ui/HeartsPopover";
import { StreakPopover } from "@/components/ui/StreakPopover";
import { GemsPopover } from "@/components/ui/GemsPopover";
import { CourseSelectorPopover } from "@/components/navigation/CourseSelectorPopover";

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
  const [isHeartsPopoverOpen, setIsHeartsPopoverOpen] = useState(false);
  const [isGemsPopoverOpen, setIsGemsPopoverOpen] = useState(false);
  const [isCoursePopoverOpen, setIsCoursePopoverOpen] = useState(false);
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

        const apiXp = typeof data.total_xp === "number" ? data.total_xp : 50;
        localStorage.setItem("duo_user_xp", apiXp.toString());
        const effectiveXp = apiXp;

        const storedGems = localStorage.getItem("duo_user_gems");
        const effectiveGems =
          typeof data.gems === "number"
            ? data.gems
            : storedGems !== null
            ? parseInt(storedGems, 10)
            : 500;

        const apiStreak = typeof data.streak_days === "number" ? data.streak_days : (data.streak || 1);
        localStorage.setItem("duo_user_streak", apiStreak.toString());

        setStats({
          hearts: parsedHearts,
          xp: effectiveXp,
          streak: apiStreak,
          gems: effectiveGems,
          heartsCooldownEndTime: activeCooldown,
        });
      })
      .catch(() => {
        const storedGems = localStorage.getItem("duo_user_gems");
        const fallbackGems = storedGems !== null ? parseInt(storedGems, 10) : 500;
        const storedStreakVal = localStorage.getItem("duo_user_streak");
        const fallbackStreak = storedStreakVal ? parseInt(storedStreakVal, 10) : 1;
        setStats({
          gems: fallbackGems,
          hearts: activeCooldown ? 0 : 5,
          streak: fallbackStreak,
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
      className={`sticky top-0 z-30 flex items-center justify-between border-b border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] px-4 py-3 sm:px-8 font-nunito transition-colors duration-200 ${className}`}
    >
      {/* Current Course Selector */}
      <div className="flex items-center gap-3 relative">
        {showCourse && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCoursePopoverOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-2xl border-2 border-transparent hover:border-[#e5e5e5] dark:hover:border-[#37464F] px-3 py-1.5 transition-all hover:bg-gray-100 dark:hover:bg-[#202F36] cursor-pointer active:scale-95"
              title="Select language course"
              aria-label="Course selector"
            >
              {/* German Flag Badge (Chunky vector with rounded corners, dark-red-gold stripes, and white outline) */}
              <div className="relative w-9 h-6.5 rounded-lg overflow-hidden border-2 border-white dark:border-[#37464F] shadow-sm flex flex-col flex-shrink-0">
                <div className="w-full h-1/3 bg-[#202F36]" />
                <div className="w-full h-1/3 bg-[#FF4B4B]" />
                <div className="w-full h-1/3 bg-[#FFC800]" />
              </div>
              <span className="hidden sm:inline font-black text-sm uppercase tracking-wider text-[#2A2A2A] dark:text-[#E5E5E5]">
                {currentCourse.title}
              </span>
            </button>

            {/* Course Selector Floating Popover */}
            <CourseSelectorPopover
              isOpen={isCoursePopoverOpen}
              onClose={() => setIsCoursePopoverOpen(false)}
              activeCourseId="german"
            />
          </div>
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
            {/* Duolingo Flame Fire Symbol from screenshot (white badge outline, plump curled flame, bright yellow core teardrop) */}
            <svg
              className="w-8 h-8 filter drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Thick white rounded border outline from screenshot */}
              <path
                d="M50 4C55 4 82 28 82 56C82 74 68 90 50 90C32 90 18 74 18 56C18 36 34 20 44 10C44 20 50 26 56 26C56 26 58 14 50 4Z"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Vibrant orange main fiery flame */}
              <path
                d="M50 8C54 8 78 30 78 56C78 72 65 86 50 86C35 86 22 72 22 56C22 38 36 24 45 14C45 22 50 28 55 28C55 28 57 16 50 8Z"
                fill="#FF9600"
              />
              {/* Bright yellow energetic teardrop core */}
              <path
                d="M50 44C51 44 63 54 63 64C63 72 57 78 50 78C43 78 37 72 37 64C37 54 49 44 50 44Z"
                fill="#FFC800"
              />
              {/* Tiny luminous inner glimmer */}
              <ellipse cx="49" cy="67" rx="5" ry="6" fill="#FFF275" opacity="0.85" />
            </svg>
            <span suppressHydrationWarning className="text-base sm:text-lg text-[#FF9600] font-black">{streak}</span>
          </button>

          {/* Floating Streak Popover Dialog */}
          <StreakPopover
            isOpen={isStreakPopoverOpen}
            onClose={() => setIsStreakPopoverOpen(false)}
            streakCount={streak}
          />
        </div>

        {/* Gems Counter - Blue Hexagonal Gem SVG from screenshot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsGemsPopoverOpen((prev) => !prev)}
            className="flex items-center gap-1.5 font-black text-[#1CB0F6] cursor-pointer hover:opacity-85 active:scale-95 transition-all p-1 rounded-2xl"
            title="Gems count"
            aria-label="Gems details"
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
          </button>

          {/* Floating Gems Popover Dialog */}
          <GemsPopover
            isOpen={isGemsPopoverOpen}
            onClose={() => setIsGemsPopoverOpen(false)}
            gemsCount={gems}
          />
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
        <div className="relative flex items-center gap-2">
          {hearts === 0 && (
            <span className="text-xs sm:text-sm font-black text-[#e5a800] bg-[#fff8e1] px-2.5 py-1 rounded-full border border-[#ffe082] whitespace-nowrap animate-pulse">
              {timeLeftText}
            </span>
          )}

          <div
            onClick={() => setIsHeartsPopoverOpen((prev) => !prev)}
            className="flex items-center gap-1.5 font-black text-[#FF4B4B] cursor-pointer hover:opacity-85 transition-opacity active:scale-95 p-1 rounded-2xl"
            title="Click to view Hearts"
            aria-label="Hearts details"
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

          {/* Floating Dialogue Box anchored directly to the heart icon */}
          <HeartsPopover
            isOpen={isHeartsPopoverOpen}
            onClose={() => setIsHeartsPopoverOpen(false)}
          />
        </div>
      </div>

      {/* Out of Hearts Modal (Used when user runs out of hearts or clicks locked action) */}
      <HeartsModal
        isOpen={isHeartsModalOpen}
        onClose={() => setIsHeartsModalOpen(false)}
        isInLesson={false}
      />
    </header>
  );
};
