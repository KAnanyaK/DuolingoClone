"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useUserStore } from "@/store/useUserStore";
import { API_BASE_URL } from "@/config/api";
import { SuperBanner } from "@/components/ui/SuperBanner";
import { SuperModal } from "@/components/ui/SuperModal";
import { StreakFreezeIcon } from "@/components/ui/StreakFreezeIcon";

export default function ShopPage() {
  const {
    hearts,
    gems,
    refillHearts,
    setStats,
    streakFreezeActive,
    equipStreakFreeze,
    unequipStreakFreeze,
  } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuperModalOpen, setIsSuperModalOpen] = useState(false);

  const isFullHearts = hearts >= 5;
  const canAfford = gems >= 350;

  const handleRefill = () => {
    if (isFullHearts) return;
    if (!canAfford) {
      setErrorMessage("Not enough gems! (Requires 350 gems)");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    fetch(`${API_BASE_URL}/api/users/1/refill-hearts`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Refill API failed");
        return res.json();
      })
      .then((data) => {
        setStats({
          hearts: 5,
          gems: typeof data.gems === "number" ? data.gems : Math.max(0, gems - 350),
          heartsCooldownEndTime: null,
        });
        refillHearts();
      })
      .catch(() => {
        // Fallback local refill
        refillHearts();
        setStats({
          hearts: 5,
          gems: Math.max(0, gems - 350),
          heartsCooldownEndTime: null,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-nunito select-none flex flex-col gap-8 justify-center items-center">
        {/* Main Shop Column */}
        <div className="w-full">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FF4B4B]/10 border-2 border-[#FF4B4B] text-[#FF4B4B] font-bold text-sm text-center">
              {errorMessage}
            </div>
          )}

          {/* Super Duolingo Promotional Banner */}
          <div className="mb-8">
            <SuperBanner onUpgradeClick={() => setIsSuperModalOpen(true)} />
          </div>

          {/* SECTION 1: HEARTS */}
          <div className="mb-10">
          <h1 className="text-2xl font-black text-[#4B4B4B] dark:text-white mb-6">
            Hearts
          </h1>

          <div className="flex flex-col divide-y-2 divide-[#E5E5E5] dark:divide-[#263E4B] border-t-2 border-b-2 border-[#E5E5E5] dark:border-[#263E4B]">
            {/* ITEM 1: Refill Hearts */}
            <div className="py-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5 flex-1">
                {/* Heart Icon Badge with soft halo from screenshot */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm" fill="none">
                    {/* Soft peach/pink halo circle */}
                    <circle cx="50" cy="50" r="44" stroke="#FFD2D2" strokeWidth="4" fill="none" opacity="0.8" />
                    {/* Vibrant red heart */}
                    <path
                      d="M50 82C50 82 22 62 22 36C22 24 31 16 41 16C47 16 50 20 50 20C50 20 53 16 59 16C69 16 78 24 78 36C78 62 50 82 50 82Z"
                      fill="#FF4B4B"
                    />
                    {/* Glossy top-left dot */}
                    <circle cx="36" cy="30" r="4.5" fill="#FFA5A5" opacity="0.9" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-black text-[#4B4B4B] dark:text-white leading-tight mb-1">
                    Refill Hearts
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-snug">
                    Get full hearts so you can worry less about making mistakes in a lesson
                  </p>
                </div>
              </div>

              {/* Action Button: FULL (if 5 hearts) or REFILL for 350 Gems */}
              <div className="flex-shrink-0">
                {isFullHearts ? (
                  <button
                    disabled
                    type="button"
                    className="px-6 sm:px-8 py-3 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-transparent text-[#AFAFAF] dark:text-[#58646D] font-black text-xs sm:text-sm uppercase tracking-wider cursor-not-allowed select-none"
                  >
                    FULL
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRefill}
                    disabled={isSubmitting || !canAfford}
                    className="px-5 sm:px-7 py-3 rounded-2xl bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#1899D6] active:translate-y-1 active:border-b-0 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-sm select-none"
                  >
                    {isSubmitting ? "REFILLING..." : "REFILL (350 💎)"}
                  </button>
                )}
              </div>
            </div>

            {/* ITEM 2: Unlimited Hearts */}
            <div className="py-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5 flex-1">
                {/* Rainbow/Infinity Heart Mascot Badge from screenshot */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm" fill="none">
                    <defs>
                      <linearGradient id="superHeartGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00E785" />
                        <stop offset="50%" stopColor="#1CB0F6" />
                        <stop offset="100%" stopColor="#A435F0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M50 82C50 82 22 62 22 36C22 24 31 16 41 16C47 16 50 20 50 20C50 20 53 16 59 16C69 16 78 24 78 36C78 62 50 82 50 82Z"
                      fill="url(#superHeartGrad)"
                    />
                    {/* White Infinity symbol in center */}
                    <path
                      d="M38 42C34 42 32 45 32 48C32 51 34 54 38 54C43 54 47 48 50 48C53 48 57 54 62 54C66 54 68 51 68 48C68 45 66 42 62 42C57 42 53 48 50 48C47 48 43 42 38 42Z"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-black text-[#4B4B4B] dark:text-white leading-tight mb-1">
                    Unlimited Hearts
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-snug">
                    Never run out of hearts with Super!
                  </p>
                </div>
              </div>

              {/* Action Button: FREE TRIAL */}
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSuperModalOpen(true)}
                  className="px-5 sm:px-7 py-3 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-transparent text-[#A435F0] hover:bg-[#A435F0]/10 font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xs select-none"
                >
                  FREE TRIAL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: POWER-UPS */}
        <div>
          <h2 className="text-2xl font-black text-[#4B4B4B] dark:text-white mb-6">
            Power-Ups
          </h2>

          <div className="flex flex-col border-t-2 border-b-2 border-[#E5E5E5] dark:divide-[#263E4B] border-[#E5E5E5] dark:border-[#263E4B]">
            {/* Streak Freeze */}
            <div className="py-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5 flex-1">
                {/* Ice Crystal Mascot Badge using StreakFreezeIcon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <StreakFreezeIcon width={64} height={64} className="filter drop-shadow-sm" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-black text-[#4B4B4B] dark:text-white leading-tight">
                      Streak Freeze
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-[11px] tracking-wide uppercase ${
                        streakFreezeActive
                          ? "bg-[#D7FFB8] text-[#58CC02]"
                          : "bg-gray-100 dark:bg-[#202F36] text-[#AFAFAF] dark:text-[#6A7E88]"
                      }`}
                    >
                      {streakFreezeActive ? "1 / 1 EQUIPPED" : "0 / 1 EQUIPPED"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-snug">
                    Streak Freeze allows your streak to remain in place for one full day of inactivity.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Equip (100 Gems) / Equipped / [Demo] Unequip */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {!streakFreezeActive ? (
                  <button
                    type="button"
                    disabled={gems < 100}
                    onClick={() => equipStreakFreeze()}
                    className={`px-5 sm:px-7 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all select-none ${
                      gems >= 100
                        ? "bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#1899D6] active:translate-y-1 active:border-b-0 text-white cursor-pointer shadow-sm"
                        : "border-2 border-[#E5E5E5] dark:border-[#37464F] bg-gray-100 dark:bg-[#202F36] text-[#AFAFAF] dark:text-[#58646D] cursor-not-allowed"
                    }`}
                  >
                    EQUIP (100 💎)
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      type="button"
                      className="px-6 sm:px-8 py-3 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-transparent text-[#AFAFAF] dark:text-[#58646D] font-black text-xs sm:text-sm uppercase tracking-wider cursor-not-allowed select-none"
                    >
                      EQUIPPED
                    </button>
                    <button
                      type="button"
                      onClick={() => unequipStreakFreeze()}
                      className="px-3 py-2 text-xs font-bold text-[#777777] dark:text-[#93A4AC] hover:text-[#FF4B4B] dark:hover:text-[#FF4B4B] underline transition-all cursor-pointer select-none"
                      title="Demo: Unequip and refund 100 gems"
                    >
                      [Demo] Unequip
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: GEMS */}
        <div className="mt-10">
          <h2 className="text-2xl font-black text-[#4B4B4B] dark:text-white mb-6">
            Gems
          </h2>

          <div className="flex flex-col border-t-2 border-b-2 border-[#E5E5E5] dark:divide-[#263E4B] border-[#E5E5E5] dark:border-[#263E4B]">
            {/* Buy More Gems Card */}
            <div className="py-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5 flex-1">
                {/* Golden Chest Full of Blue Glowing Gems Graphic */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 90"
                    className="w-full h-full filter drop-shadow-sm"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Open Chest Lid */}
                    <path
                      d="M16 12C16 9 20 6 24 6H76C80 6 84 9 84 12V34H16V12Z"
                      fill="#964B00"
                    />
                    <rect x="14" y="4" width="72" height="6" rx="2" fill="#FFC800" />
                    <rect x="14" y="30" width="72" height="4" fill="#FFC800" />

                    {/* Glowing Blue Gems */}
                    <polygon points="32,24 44,14 56,22 48,34 32,32" fill="#1CB0F6" />
                    <polygon points="44,14 56,22 48,26 40,22" fill="#72D4FF" />
                    <polygon points="52,26 66,16 78,24 72,36 56,36" fill="#009BE5" />
                    <polygon points="66,16 78,24 70,26 62,22" fill="#72D4FF" />
                    <polygon points="26,30 42,20 54,32 46,46 28,44" fill="#00A7F5" />
                    <polygon points="42,20 54,32 44,34 34,26" fill="#A8E8FF" />
                    <polygon points="28,44 46,46 38,36" fill="#007EBA" />
                    <polygon points="48,32 64,22 76,32 66,46 50,44" fill="#1CB0F6" />
                    <polygon points="64,22 76,32 66,34 56,28" fill="#BDEEFF" />

                    {/* Chest Body */}
                    <rect x="14" y="34" width="72" height="44" rx="4" fill="#A0522D" />
                    <rect x="14" y="34" width="72" height="6" fill="#FFC800" />
                    <rect x="14" y="68" width="72" height="10" rx="3" fill="#FFC800" />
                    <rect x="14" y="34" width="10" height="44" fill="#FFC800" />
                    <rect x="76" y="34" width="10" height="44" fill="#FFC800" />

                    {/* Lock Plate */}
                    <rect x="42" y="38" width="16" height="20" rx="3" fill="#FFC800" stroke="#E5A800" strokeWidth="2" />
                    <circle cx="50" cy="45" r="2.5" fill="#5C2E00" />
                    <polygon points="49,45 51,45 52,53 48,53" fill="#5C2E00" />

                    {/* Rivet dots */}
                    <circle cx="19" cy="40" r="1.5" fill="#E5A800" />
                    <circle cx="19" cy="72" r="1.5" fill="#E5A800" />
                    <circle cx="81" cy="40" r="1.5" fill="#E5A800" />
                    <circle cx="81" cy="72" r="1.5" fill="#E5A800" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-black text-[#4B4B4B] dark:text-white leading-tight mb-1">
                    Buy More Gems
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] leading-snug">
                    Refill your pouch with 500 sparkling blue gems to keep learning!
                  </p>
                </div>
              </div>

              {/* Action Button: BUY GEMS (Sets back to 500) */}
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setStats({ gems: 500 });
                  }}
                  className="px-5 sm:px-7 py-3 rounded-2xl bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#1899D6] active:translate-y-1 active:border-b-0 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-sm select-none"
                >
                  BUY (500 💎)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Super Duolingo Interactive Modal */}
      <SuperModal
        isOpen={isSuperModalOpen}
        onClose={() => setIsSuperModalOpen(false)}
      />
    </AppLayout>
  );
}
