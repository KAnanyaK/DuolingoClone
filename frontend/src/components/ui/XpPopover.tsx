"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Trophy, Zap } from "lucide-react";

export interface XpPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  xpCount: number;
}

export const XpPopover: React.FC<XpPopoverProps> = ({
  isOpen,
  onClose,
  xpCount,
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-14 sm:top-16 -right-12 sm:-right-8 z-50 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-3xl bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] shadow-2xl border-2 border-[#E5E5E5] dark:border-[#263E4B] p-5 sm:p-6 select-none font-nunito animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top pointer arrow directly aligned over XP button */}
      <div className="absolute -top-2 right-18 sm:right-16 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#E5E5E5] dark:border-b-[#263E4B]" />
      <div className="absolute -top-[6px] right-18 sm:right-16 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-white dark:border-b-[#131F24]" />

      <div className="flex flex-col items-center text-center">
        {/* Golden Trophy with Green Lightning XP Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2.5 flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-md" fill="none">
            {/* Soft glowing ambient circle */}
            <circle cx="50" cy="50" r="42" fill="#58CC02" fillOpacity="0.12" />
            
            {/* Golden Trophy Cup */}
            <path
              d="M32 24H68V44C68 53.9411 59.9411 62 50 62C40.0589 62 32 53.9411 32 44V24Z"
              fill="#FFC800"
              stroke="#E5A800"
              strokeWidth="3"
            />
            {/* Trophy Handles */}
            <path
              d="M32 28H24C20.6863 28 18 30.6863 18 34V38C18 43.5228 22.4772 48 28 48H33"
              stroke="#E5A800"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M68 28H76C79.3137 28 82 30.6863 82 34V38C82 43.5228 77.5228 48 72 48H67"
              stroke="#E5A800"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Trophy Stem & Base */}
            <path d="M50 62V72" stroke="#E5A800" strokeWidth="4" strokeLinecap="round" />
            <path d="M34 78H66" stroke="#E5A800" strokeWidth="5" strokeLinecap="round" />
            
            {/* Center Vibrant Green Lightning Bolt badge */}
            <path
              d="M52 30L42 46H50L46 56L58 42H50L52 30Z"
              fill="#58CC02"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title & XP Badge */}
        <h3 className="text-lg sm:text-xl font-black text-[#4B4B4B] dark:text-white leading-tight mb-1">
          Experience Points
        </h3>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58CC02]/15 text-[#58CC02] font-black text-xs mb-2.5">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{xpCount} Total XP</span>
        </div>

        {/* User-Requested Message */}
        <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-snug mb-4 max-w-[240px]">
          Collect more XP as you complete lessons and rise up the leaderboard!
        </p>

        {/* Leaderboard Direct Link Button */}
        <Link
          href="/leaderboard"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 text-white font-black text-xs sm:text-sm uppercase tracking-wider text-center transition-all shadow-sm select-none flex items-center justify-center gap-2"
        >
          <Trophy className="w-4 h-4 stroke-[3]" />
          <span>Leaderboard</span>
        </Link>
      </div>
    </div>
  );
};
