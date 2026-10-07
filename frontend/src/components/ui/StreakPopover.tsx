"use client";

import React, { useRef, useEffect } from "react";
import { Lock, Users } from "lucide-react";

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

  // Days of week: S M T W T F S
  // Let's mark Wednesday (or current day) as active with the check mark like in the screenshot
  const daysOfWeek = [
    { label: "S", active: false },
    { label: "M", active: false },
    { label: "T", active: false },
    { label: "W", active: true },
    { label: "T", active: false },
    { label: "F", active: false },
    { label: "S", active: false },
  ];

  return (
    <div
      ref={popoverRef}
      className="absolute top-14 sm:top-16 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-80 sm:w-96 rounded-3xl bg-[#131F24] text-white shadow-2xl border-2 border-[#202F36] overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-nunito"
    >
      {/* Top arrow pointer */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#E07A00]" />

      {/* Top Banner (Golden / Amber Orange) */}
      <div className="bg-[#E07A00] p-6 text-white relative">
        <div className="flex items-start justify-between">
          <div className="pr-4">
            <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">
              {streakCount} day streak
            </h3>
            <p className="text-xs sm:text-sm font-bold opacity-95 leading-snug">
              You’ve earned your longest streak ever!
            </p>
          </div>

          {/* Duolingo Flame Icon Badge */}
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 filter drop-shadow-md"
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
          </div>
        </div>

        {/* Days of the week row */}
        <div className="mt-6 bg-[#0E171B]/35 rounded-2xl p-3 flex items-center justify-between">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
              <span
                className={`text-xs font-black ${
                  day.active ? "text-[#FFC800]" : "text-white/60"
                }`}
              >
                {day.label}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                  day.active
                    ? "bg-[#FFC800] text-[#131F24] shadow-md border-2 border-white/20"
                    : "bg-[#25333A] text-transparent"
                }`}
              >
                {day.active ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popover Body Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3.5 bg-[#131F24]">
        {/* Friend Streaks Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF4B00] to-[#FF8000] p-4 text-white shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Flame mini mascot badge */}
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
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
            className="px-4 py-2 bg-white text-[#FF4B00] font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#d93d00] hover:bg-gray-50 active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0 cursor-pointer"
          >
            VIEW LIST
          </button>
        </div>

        {/* Streak Society Card */}
        <div className="rounded-2xl bg-[#18272E] border-2 border-[#263740] p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#23353E] text-[#6A7E88] flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-sm text-white leading-tight mb-0.5">Streak Society</h4>
            <p className="text-xs font-bold text-[#8FA2AC] leading-snug">
              Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
            </p>
          </div>
        </div>

        {/* View More Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-[#1CB0F6] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_0_#1899D6] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all cursor-pointer mt-1"
        >
          VIEW MORE
        </button>
      </div>
    </div>
  );
};
