"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useUserStore } from "@/store/useUserStore";
import { Sun, Moon, Flame, Zap, Heart, Gem, ShieldCheck, Check } from "lucide-react";

export default function ProfilePage() {
  const { xp, streak, hearts, gems, darkMode, toggleDarkMode } = useUserStore();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("duo_dark_mode") === "true";
    setIsDark(stored || darkMode);
  }, [darkMode]);

  const handleToggle = (dark: boolean) => {
    setIsDark(dark);
    toggleDarkMode(dark);
  };

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-3xl border-2 border-[#e5e5e5] bg-white shadow-sm">
          <div className="w-24 h-24 rounded-full bg-[#58CC02] flex items-center justify-center text-5xl shadow-md border-4 border-[#46a302]">
            🦉
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] flex items-center justify-center sm:justify-start gap-2">
              Duo Learner
              <ShieldCheck className="w-6 h-6 text-[#1CB0F6]" />
            </h1>
            <p className="text-sm font-bold text-[#777777] mb-3">@duo_learner • Joined Oct 2026</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#58CC02]/10 text-[#58CC02] font-black text-xs uppercase tracking-wider">
              German Learner 🇩🇪
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div>
          <h2 className="text-xl font-black text-[#4B4B4B] mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] bg-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FF9600]/10 text-[#FF9600]">
                <Flame className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B]">{streak}</p>
                <p className="text-xs font-bold text-[#777777] uppercase tracking-wide">Day Streak</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] bg-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFC800]/10 text-[#FFC800]">
                <Zap className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B]">{xp}</p>
                <p className="text-xs font-bold text-[#777777] uppercase tracking-wide">Total XP</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] bg-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#1CB0F6]/10 text-[#1CB0F6]">
                <Gem className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B]">{gems}</p>
                <p className="text-xs font-bold text-[#777777] uppercase tracking-wide">Gems</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-[#e5e5e5] bg-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B]">
                <Heart className="w-6 h-6 fill-current stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#4B4B4B]">{hearts}</p>
                <p className="text-xs font-bold text-[#777777] uppercase tracking-wide">Hearts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences / Settings: Dark Mode Toggle */}
        <div className="rounded-3xl border-2 border-[#e5e5e5] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#4B4B4B] mb-2">Preferences</h2>
          <p className="text-sm font-bold text-[#777777] mb-6">
            Customize your app appearance and learning environment.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-t-2 border-[#e5e5e5]">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isDark ? "bg-[#1CB0F6]/15 text-[#1CB0F6]" : "bg-[#FFC800]/15 text-[#FFC800]"}`}>
                {isDark ? <Moon className="w-6 h-6 stroke-[2.5]" /> : <Sun className="w-6 h-6 stroke-[2.5]" />}
              </div>
              <div>
                <p className="font-extrabold text-[#4B4B4B] text-base">Appearance</p>
                <p className="text-xs font-bold text-[#777777]">
                  {isDark ? "Dark theme active" : "Light theme active"}
                </p>
              </div>
            </div>

            {/* Light / Dark Mode Segmented Buttons */}
            <div className="flex items-center bg-[#f2f2f2] p-1.5 rounded-2xl border-2 border-[#e5e5e5] w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleToggle(false)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  !isDark
                    ? "bg-white text-[#4B4B4B] shadow-sm border border-[#e5e5e5]"
                    : "text-[#777777] hover:text-[#4B4B4B]"
                }`}
              >
                <Sun className="w-4 h-4 text-[#FFC800]" />
                <span>Light</span>
                {!isDark && <Check className="w-3.5 h-3.5 text-[#58CC02]" />}
              </button>

              <button
                type="button"
                onClick={() => handleToggle(true)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isDark
                    ? "bg-[#131F24] text-white shadow-sm border border-[#37464F]"
                    : "text-[#777777] hover:text-[#4B4B4B]"
                }`}
              >
                <Moon className="w-4 h-4 text-[#1CB0F6]" />
                <span>Dark</span>
                {isDark && <Check className="w-3.5 h-3.5 text-[#58CC02]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
