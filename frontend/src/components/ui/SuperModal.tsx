"use client";

import React, { useState, useEffect } from "react";
import { X, Heart, Target, Sparkles, Bell, Check, Shield } from "lucide-react";
import { RainbowOwlWithGlasses } from "@/components/mascots/RainbowOwlWithGlasses";

interface SuperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuperModal: React.FC<SuperModalProps> = ({ isOpen, onClose }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleButtonClick = () => {
    setIsClicked(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3200);
  };

  const perks = [
    {
      title: "Unlimited Hearts",
      desc: "Never run out of lives and learn at your own pace without pause",
      iconBg: "bg-gradient-to-br from-[#FF4B4B] to-[#FF8080]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-white" strokeWidth="0">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
    {
      title: "Personalized Practice",
      desc: "Target your mistakes with tailored, AI-crafted review sessions",
      iconBg: "bg-gradient-to-br from-[#1CB0F6] to-[#0D86CA]",
      icon: <Target className="w-5 h-5 text-white stroke-[2.5]" />,
    },
    {
      title: "Zero Ads",
      desc: "Enjoy completely uninterrupted, 100% distraction-free study sessions",
      iconBg: "bg-gradient-to-br from-[#58CC02] to-[#46A302]",
      icon: <Shield className="w-5 h-5 text-white stroke-[2.5]" />,
    },
    {
      title: "Customised Reminders",
      desc: "Smart notifications dynamically timed to protect your daily streak",
      iconBg: "bg-gradient-to-br from-[#CE82FF] to-[#A435F0]",
      icon: <Bell className="w-5 h-5 text-white stroke-[2.5]" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-white/70 dark:bg-[#131F24]/80 backdrop-blur-md transition-all select-none font-nunito animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#1A2C34] rounded-3xl p-6 sm:p-8 border-4 border-[#CE82FF]/40 dark:border-[#CE82FF]/30 shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Iridescent Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF4B4B] via-[#FF9600] via-[#FFC800] via-[#58CC02] via-[#1CB0F6] to-[#CE82FF]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#E5E5E5]/60 hover:bg-[#E5E5E5] dark:bg-[#2B353D] dark:hover:bg-[#37464F] flex items-center justify-center text-[#777777] dark:text-[#93A4AC] hover:text-[#4B4B4B] dark:hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Rainbow Jumping Mascot with Glasses */}
        <div className="mb-2 flex items-center justify-center">
          <RainbowOwlWithGlasses width={130} height={125} />
        </div>

        {/* Super Duolingo Brand Title in Big Centered Rainbow Gradient */}
        <div className="flex flex-col items-center mb-5 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#FF4B4B]/15 via-[#58CC02]/15 to-[#CE82FF]/15 border border-[#CE82FF]/30 text-[11px] font-black uppercase tracking-widest text-[#CE82FF] dark:text-[#E9B7FF] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> SUPER PLAN
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-[#FF4B4B] via-[#FF9600] via-[#FFC800] via-[#58CC02] via-[#1CB0F6] to-[#CE82FF] bg-clip-text text-transparent drop-shadow-xs">
            super duolingo
          </h2>
          <p className="text-xs sm:text-sm font-extrabold text-[#777777] dark:text-[#93A4AC] mt-1.5">
            Level up your learning journey with premium superpowers
          </p>
        </div>

        {/* Perks Grid / List */}
        <div className="w-full flex flex-col gap-2.5 mb-6">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50 dark:bg-[#131F24] border border-[#E5E5E5] dark:border-[#263E4B] hover:border-[#CE82FF]/40 dark:hover:border-[#CE82FF]/40 transition-all shadow-xs"
            >
              <div
                className={`w-10 h-10 rounded-xl ${perk.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                {perk.icon}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-black text-[#4B4B4B] dark:text-white leading-tight">
                  {perk.title}
                </span>
                <span className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] leading-snug truncate sm:whitespace-normal">
                  {perk.desc}
                </span>
              </div>
              <div className="flex-shrink-0 text-[#58CC02]">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>

        {/* "Coming Soon..." Small Interactive Button with Rainbow Glow Gradient on hover or click */}
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            type="button"
            onClick={handleButtonClick}
            className={`group relative inline-flex items-center justify-center px-7 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer select-none active:scale-95 ${
              isClicked
                ? "bg-gradient-to-r from-[#FF4B4B] via-[#FF9600] via-[#58CC02] via-[#1CB0F6] to-[#CE82FF] text-white border-2 border-transparent shadow-[0_0_25px_rgba(206,130,255,0.7),0_0_15px_rgba(28,176,246,0.6)] scale-105"
                : "bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] border-2 border-[#E5E5E5] dark:border-[#263E4B] hover:border-transparent hover:text-white hover:bg-gradient-to-r hover:from-[#FF4B4B] hover:via-[#FF9600] hover:via-[#58CC02] hover:via-[#1CB0F6] hover:to-[#CE82FF] hover:shadow-[0_0_25px_rgba(206,130,255,0.7),0_0_15px_rgba(28,176,246,0.6)] hover:scale-105"
            }`}
          >
            {/* Sparkle icon on hover/active */}
            <Sparkles className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
            Coming Soon...
          </button>

          {/* Interactive feedback toast note */}
          {showToast && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs font-black text-[#CE82FF] dark:text-[#E9B7FF] flex items-center gap-1.5 mt-1 bg-[#CE82FF]/10 dark:bg-[#CE82FF]/20 px-3 py-1 rounded-full border border-[#CE82FF]/30">
              <Sparkles className="w-3 h-3" /> Super Duolingo is launching soon! Get ready! 🌈✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
