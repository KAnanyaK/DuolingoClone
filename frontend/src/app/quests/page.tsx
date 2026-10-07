"use client";

import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Clock, Zap, Lock } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function QuestsPage() {
  const { xp } = useUserStore();

  // Progress for "Earn 10 XP" quest
  // Caps at 10, current is min(10, xp % 10 === 0 && xp > 0 ? 10 : (xp % 10 || 5))
  // Or standard demo progress: 5/10 (50%)
  const questTarget = 10;
  const currentQuestXp = 5;
  const progressPercent = Math.min(100, Math.round((currentQuestXp / questTarget) * 100));

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 font-nunito">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Main Left Column: Welcome Banner & Daily Quests */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Welcome Banner (Vibrant Purple Background #854CE6 / #7F42E3 with Duo Mascot & Chest) */}
            <div className="relative overflow-hidden rounded-3xl bg-[#854CE6] p-6 sm:p-8 text-white shadow-sm flex items-center justify-between min-h-[170px]">
              <div className="max-w-[65%] z-10">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                  Welcome!
                </h1>
                <p className="text-xs sm:text-sm font-bold text-white/90 leading-snug">
                  Complete quests to earn rewards! Quests refresh every day.
                </p>
              </div>

              {/* Duo Owl Mascot holding golden treasure chest */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 z-10 flex items-center justify-center">
                {/* Sparkles */}
                <div className="absolute top-2 -left-2 text-white/70 text-xs">✦</div>
                <div className="absolute top-0 right-4 text-white/70 text-sm">✦</div>

                {/* SVG Mascot + Chest */}
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full filter drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Ground Shadow */}
                  <ellipse cx="60" cy="112" rx="30" ry="5" fill="#000000" opacity="0.2" />

                  {/* Duo Owl Body */}
                  <rect x="25" y="38" width="70" height="70" rx="30" fill="#58CC02" />
                  <ellipse cx="60" cy="85" rx="22" ry="18" fill="#8EE000" />

                  {/* Feet */}
                  <ellipse cx="44" cy="108" rx="7" ry="3" fill="#FF9600" />
                  <ellipse cx="76" cy="108" rx="7" ry="3" fill="#FF9600" />

                  {/* Owl Eyes */}
                  <ellipse cx="45" cy="62" rx="11" ry="13" fill="#FFFFFF" />
                  <ellipse cx="75" cy="62" rx="11" ry="13" fill="#FFFFFF" />
                  <circle cx="47" cy="62" r="6" fill="#202F36" />
                  <circle cx="73" cy="62" r="6" fill="#202F36" />
                  <circle cx="49" cy="59" r="2.5" fill="#FFFFFF" />
                  <circle cx="75" cy="59" r="2.5" fill="#FFFFFF" />

                  {/* Happy Beak */}
                  <polygon points="60,65 54,74 66,74" fill="#FF9600" />

                  {/* Raised Owl Left Wing holding Chest */}
                  <path
                    d="M 30 65 C 18 55 24 35 38 28 C 42 38 40 54 30 65 Z"
                    fill="#46A302"
                  />

                  {/* Golden Treasure Chest */}
                  <g transform="translate(26, 12)">
                    {/* Chest Base */}
                    <rect x="0" y="8" width="28" height="18" rx="3" fill="#FFC800" stroke="#E5A800" strokeWidth="1.5" />
                    {/* Chest Lid */}
                    <path d="M 0 8 Q 14 0 28 8 Z" fill="#FFC800" stroke="#E5A800" strokeWidth="1.5" />
                    {/* Chest Lock */}
                    <rect x="11" y="9" width="6" height="6" rx="1.5" fill="#FFFFFF" />
                    <circle cx="14" cy="12" r="1" fill="#777777" />
                    {/* Gem accent */}
                    <polygon points="14,2 18,5 14,8 10,5" fill="#1CB0F6" opacity="0.9" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Daily Quests Header */}
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#4B4B4B] dark:text-white">
                Daily Quests
              </h2>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#FF9600] uppercase tracking-wider">
                <Clock className="w-4 h-4 stroke-[2.5]" />
                <span>12 HOURS</span>
              </div>
            </div>

            {/* Quest Card 1: Earn 10 XP */}
            <div className="p-5 sm:p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] flex items-center gap-4 sm:gap-6 shadow-xs transition-colors">
              {/* Lightning Icon Badge */}
              <div className="flex-shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF9E6] dark:bg-transparent flex items-center justify-center">
                  <svg
                    className="w-8 h-8 filter drop-shadow-sm"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M56 6L20 54h26l-6 40 40-52H52l8-36z"
                      fill="#FFC800"
                    />
                  </svg>
                </div>
              </div>

              {/* Quest Details & Progress Bar */}
              <div className="flex-1">
                <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white mb-2.5">
                  Earn 10 XP
                </h3>

                <div className="flex items-center gap-3">
                  {/* Chunky rounded progress bar: light mode clean light-gray track #E5E5E5, dark mode #2B3E48 */}
                  <div className="relative flex-1 h-5 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#FFC800] rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${progressPercent}%` }}
                    />
                    {/* Centered fraction overlay */}
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-black text-[#6F6F6F] dark:text-[#E5E5E5]">
                      {currentQuestXp} / {questTarget}
                    </span>
                  </div>

                  {/* Treasure Chest Icon at the end of progress */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#FFF4D0] dark:bg-[#FFC800] border-2 border-[#FFC800] dark:border-[#E5A800] flex items-center justify-center shadow-xs">
                    <span className="text-sm">📦</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quest Card 2: More quests unlock soon */}
            <div className="p-5 sm:p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] flex items-center gap-4 sm:gap-6 shadow-xs transition-colors">
              {/* Lock Icon */}
              <div className="w-11 h-11 rounded-2xl bg-[#F4F4F4] dark:bg-[#24353E] text-[#AFAFAF] flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#AFAFAF] dark:text-[#677782]">
                  More quests unlock soon
                </h3>
              </div>
            </div>
          </div>

          {/* Right Column: Monthly Challenges Card */}
          <div className="flex flex-col gap-6">
            <div className="p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] shadow-xs flex flex-col gap-5 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white leading-tight mb-2">
                    Monthly challenges unlock soon!
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-snug">
                    Complete each month’s challenge to earn exclusive badges
                  </p>
                </div>

                {/* Golden Challenge Badge Illustration */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                  {/* Green decorative leaf/circle backdrop */}
                  <div className="absolute right-0 top-1 w-10 h-10 rounded-full bg-[#58CC02] opacity-85" />
                  {/* Golden Coin Badge */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFC800] border-4 border-[#FFAE00] flex items-center justify-center shadow-md">
                    <Zap className="w-7 h-7 sm:w-8 sm:h-8 fill-[#FF9600] text-[#FF9600]" />
                  </div>
                </div>
              </div>

              {/* Start a Lesson Button - Brings user directly to learning home as requested */}
              <Link
                href="/learn"
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#DDF4FF] active:scale-[0.98] font-black text-xs sm:text-sm uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs block select-none"
              >
                START A LESSON
              </Link>
            </div>

            {/* Footer Navigation Links */}
            <div className="px-2 flex flex-wrap gap-x-3 gap-y-2 text-[11px] font-black uppercase tracking-wider text-[#AFAFAF]">
              <span className="hover:text-[#777777] cursor-pointer">ABOUT</span>
              <span className="hover:text-[#777777] cursor-pointer">BLOG</span>
              <span className="hover:text-[#777777] cursor-pointer">STORE</span>
              <span className="hover:text-[#777777] cursor-pointer">EFFICACY</span>
              <span className="hover:text-[#777777] cursor-pointer">CAREERS</span>
              <span className="hover:text-[#777777] cursor-pointer">INVESTORS</span>
              <span className="hover:text-[#777777] cursor-pointer">TERMS</span>
              <span className="hover:text-[#777777] cursor-pointer">PRIVACY</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
