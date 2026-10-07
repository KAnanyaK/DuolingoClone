"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useUserStore } from "@/store/useUserStore";
import { Sun, Moon, Flame, Zap, Heart, Gem, ShieldCheck, Check, Trophy } from "lucide-react";

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

        {/* SECTION: ALL ACHIEVEMENTS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-black text-[#4B4B4B] dark:text-white">
            All achievements
          </h2>

          <div className="rounded-3xl border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] overflow-hidden divide-y-2 divide-[#f2f2f2] dark:divide-[#263E4B] shadow-sm">
            {/* 1. Wildfire */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#FF4B4B] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center">
                  <Flame className="w-9 h-9 sm:w-10 sm:h-10 fill-[#FFC800] text-[#FFC800] drop-shadow-xs" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Wildfire
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    1/3
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "33%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Reach a 3 day streak
                </p>
              </div>
            </div>

            {/* 2. Sage */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#58CC02] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🧙‍♂️
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Sage
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    5/100
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "5%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Earn 100 XP
                </p>
              </div>
            </div>

            {/* 3. Champion */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#B86BFF] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🛡️
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Champion
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Unlock Leaderboards by completing 10 lessons
                </p>
              </div>
            </div>

            {/* 4. Sharpshooter */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#58CC02] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🏹
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Sharpshooter
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Complete 1 lesson with no mistakes
                </p>
              </div>
            </div>

            {/* 5. Winner */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#B86BFF] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center">
                  <Trophy className="w-9 h-9 sm:w-10 sm:h-10 fill-[#FFC800] text-[#FFC800] drop-shadow-xs" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Winner
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Finish #1 in the leaderboard
                </p>
              </div>
            </div>

            {/* 6. Friendly */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#B86BFF] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🧑‍🤝‍🧑
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Friendly
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/3
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Follow 3 friends
                </p>
              </div>
            </div>

            {/* 7. Weekend Warrior */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#58CC02] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🪖
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Weekend Warrior
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/2
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Complete a lesson on Saturday and Sunday
                </p>
              </div>
            </div>

            {/* 8. Photogenic */}
            <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
              <div className="w-[84px] h-[92px] sm:w-[92px] sm:h-[100px] rounded-2xl bg-[#1CB0F6] p-2 flex flex-col items-center justify-between shadow-xs flex-shrink-0">
                <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl select-none">
                  🖼️
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md whitespace-nowrap text-center">
                  LEVEL 1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white">
                    Photogenic
                  </h3>
                  <span className="font-extrabold text-xs sm:text-sm text-[#AFAFAF] dark:text-[#8898A1]">
                    0/1
                  </span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5 mb-2">
                  <div className="h-full bg-[#FFC800] rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Add a profile picture
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
