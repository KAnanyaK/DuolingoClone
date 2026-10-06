"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";

export interface TopBarProps {
  className?: string;
  showCourse?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  className = "",
  showCourse = true,
}) => {
  const { hearts, xp, streak, currentCourse } = useUserStore();

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

      {/* Stats Cluster: Streak, XP / Gems, Hearts */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Streak: Sky Blue #1CB0F6 */}
        <div
          className="flex items-center gap-1.5 font-black text-[#1CB0F6] cursor-pointer hover:opacity-85 transition-opacity"
          title="Streak count"
        >
          {/* Flame icon SVG */}
          <svg
            className="w-6 h-6 fill-[#1CB0F6]"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2c.4 1.7-.2 3.3-1.3 4.5C9.2 8.2 8.7 9.8 9 11.4c.1.5.3 1 .6 1.4.3-1 .9-1.9 1.7-2.6 1.3-1.1 2.2-2.7 2.4-4.5 2.5 1.5 4.3 4.1 4.3 7.3 0 4.4-3.6 8-8 8s-8-3.6-8-8c0-3.5 2.2-6.5 5.4-7.6.2.9.8 1.8 1.6 2.4.6.4 1.2 1 1.6 1.6-.2-1.3-.4-2.8.4-4.4C10.7 3.7 11.3 2.8 12 2z" />
          </svg>
          <span className="text-base sm:text-lg">{streak}</span>
        </div>

        {/* XP: Feather Green #58CC02 */}
        <div
          className="flex items-center gap-1.5 font-black text-[#58CC02] cursor-pointer hover:opacity-85 transition-opacity"
          title="Total XP"
        >
          {/* Lightning / XP Star Icon */}
          <svg
            className="w-6 h-6 fill-[#58CC02]"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-base sm:text-lg">{xp} XP</span>
        </div>

        {/* Hearts: Incorrect Red #FF4B4B */}
        <div
          className="flex items-center gap-1.5 font-black text-[#FF4B4B] cursor-pointer hover:opacity-85 transition-opacity"
          title="Remaining Hearts"
        >
          {/* Duolingo Heart Icon */}
          <svg
            className="w-6 h-6 fill-[#FF4B4B]"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-base sm:text-lg">{hearts}</span>
        </div>
      </div>
    </header>
  );
};
