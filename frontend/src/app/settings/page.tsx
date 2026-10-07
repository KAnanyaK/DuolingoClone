"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { useUserStore } from "@/store/useUserStore";
import { Sun, Moon, Check, ChevronDown } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useUserStore();

  // Settings states matching Duolingo screenshot
  const [soundEffects, setSoundEffects] = useState<boolean>(false);
  const [animations, setAnimations] = useState<boolean>(true);
  const [motivationalMessages, setMotivationalMessages] = useState<boolean>(true);
  const [listeningExercises, setListeningExercises] = useState<boolean>(false);

  // Appearance / Dark mode state
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("duo_dark_mode") === "true";
    setIsDark(stored || darkMode);
  }, [darkMode]);

  const handleToggleDarkMode = (dark: boolean) => {
    setIsDark(dark);
    toggleDarkMode(dark);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <AppLayout showTopBar={true}>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 font-nunito">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* ================= LEFT COLUMN: PREFERENCES ================= */}
          <div className="flex-1 w-full min-w-0">
            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mb-6">
              Preferences
            </h1>

            {/* SECTION 1: Lesson experience */}
            <div className="mb-8">
              <h2 className="text-sm sm:text-base font-black text-[#777777] dark:text-[#93A4AC] pb-3 border-b-2 border-[#E5E5E5] dark:border-[#263E4B] mb-5">
                Lesson experience
              </h2>

              <div className="flex flex-col gap-5">
                {/* 1. Sound effects */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-[#4B4B4B] dark:text-white">
                    Sound effects
                  </span>
                  <button
                    type="button"
                    onClick={() => setSoundEffects(!soundEffects)}
                    aria-label="Toggle Sound effects"
                    className={`relative w-13 h-7 rounded-full transition-colors cursor-pointer p-0.5 border-2 ${
                      soundEffects
                        ? "bg-[#1CB0F6] border-[#1CB0F6]"
                        : "bg-[#E5E5E5] dark:bg-[#37464F] border-[#E5E5E5] dark:border-[#37464F]"
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform ${
                        soundEffects ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Animations */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-[#4B4B4B] dark:text-white">
                    Animations
                  </span>
                  <button
                    type="button"
                    onClick={() => setAnimations(!animations)}
                    aria-label="Toggle Animations"
                    className={`relative w-13 h-7 rounded-full transition-colors cursor-pointer p-0.5 border-2 ${
                      animations
                        ? "bg-[#1CB0F6] border-[#1CB0F6]"
                        : "bg-[#E5E5E5] dark:bg-[#37464F] border-[#E5E5E5] dark:border-[#37464F]"
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform ${
                        animations ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Motivational messages */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-[#4B4B4B] dark:text-white">
                    Motivational messages
                  </span>
                  <button
                    type="button"
                    onClick={() => setMotivationalMessages(!motivationalMessages)}
                    aria-label="Toggle Motivational messages"
                    className={`relative w-13 h-7 rounded-full transition-colors cursor-pointer p-0.5 border-2 ${
                      motivationalMessages
                        ? "bg-[#1CB0F6] border-[#1CB0F6]"
                        : "bg-[#E5E5E5] dark:bg-[#37464F] border-[#E5E5E5] dark:border-[#37464F]"
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform ${
                        motivationalMessages ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Listening exercises */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-[#4B4B4B] dark:text-white">
                    Listening exercises
                  </span>
                  <button
                    type="button"
                    onClick={() => setListeningExercises(!listeningExercises)}
                    aria-label="Toggle Listening exercises"
                    className={`relative w-13 h-7 rounded-full transition-colors cursor-pointer p-0.5 border-2 ${
                      listeningExercises
                        ? "bg-[#1CB0F6] border-[#1CB0F6]"
                        : "bg-[#E5E5E5] dark:bg-[#37464F] border-[#E5E5E5] dark:border-[#37464F]"
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform ${
                        listeningExercises ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: Appearance */}
            <div className="mb-8">
              <h2 className="text-sm sm:text-base font-black text-[#777777] dark:text-[#93A4AC] pb-3 border-b-2 border-[#E5E5E5] dark:border-[#263E4B] mb-5">
                Appearance
              </h2>

              <div className="flex flex-col gap-4">
                <label className="font-extrabold text-sm sm:text-base text-[#4B4B4B] dark:text-white">
                  Dark mode
                </label>

                {/* Styled Dropdown Selector matching screenshot */}
                <div className="relative w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] text-xs sm:text-sm font-black uppercase tracking-wider text-[#4B4B4B] dark:text-white hover:border-[#CCCCCC] dark:hover:border-[#37464F] transition-all cursor-pointer shadow-xs"
                  >
                    <span>{isDark ? "ON" : "OFF"}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#777777] dark:text-[#93A4AC] transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Options */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-[#1A2C34] rounded-2xl border-2 border-[#E5E5E5] dark:border-[#263E4B] shadow-xl overflow-hidden divide-y-2 divide-[#f2f2f2] dark:divide-[#263E4B] animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => handleToggleDarkMode(false)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer transition-colors ${
                          !isDark
                            ? "bg-[#ddf4ff] dark:bg-[#1B3644] text-[#1CB0F6]"
                            : "text-[#4B4B4B] dark:text-white hover:bg-gray-50 dark:hover:bg-[#202F36]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-[#FFC800]" />
                          <span>OFF (Light)</span>
                        </div>
                        {!isDark && <Check className="w-4 h-4 text-[#1CB0F6]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleDarkMode(true)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer transition-colors ${
                          isDark
                            ? "bg-[#ddf4ff] dark:bg-[#1B3644] text-[#1CB0F6]"
                            : "text-[#4B4B4B] dark:text-white hover:bg-gray-50 dark:hover:bg-[#202F36]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-[#1CB0F6]" />
                          <span>ON (Dark)</span>
                        </div>
                        {isDark && <Check className="w-4 h-4 text-[#1CB0F6]" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile-style Light / Dark Segmented Buttons */}
                <div className="mt-2 flex items-center bg-[#f2f2f2] dark:bg-[#202F36] p-1.5 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#263E4B] w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => handleToggleDarkMode(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      !isDark
                        ? "bg-white text-[#4B4B4B] shadow-sm border border-[#e5e5e5]"
                        : "text-[#777777] dark:text-[#AFAFAF] hover:text-[#4B4B4B] dark:hover:text-white"
                    }`}
                  >
                    <Sun className="w-4 h-4 text-[#FFC800]" />
                    <span>Light</span>
                    {!isDark && <Check className="w-3.5 h-3.5 text-[#58CC02]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleDarkMode(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      isDark
                        ? "bg-[#131F24] text-white shadow-sm border border-[#37464F]"
                        : "text-[#777777] dark:text-[#AFAFAF] hover:text-[#4B4B4B] dark:hover:text-white"
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

          {/* ================= RIGHT COLUMN: SIDEBAR CARDS ================= */}
          <div className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0">
            {/* Card 1: Account */}
            <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] p-5 shadow-xs">
              <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white mb-3">
                Account
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-extrabold text-[#777777] dark:text-[#93A4AC]">
                <li>
                  <span className="text-[#1CB0F6] font-black cursor-pointer">
                    Preferences
                  </span>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <span className="hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer">
                    Notifications
                  </span>
                </li>
                <li>
                  <Link
                    href="/learn"
                    className="hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <span className="hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer">
                    Duolingo for Schools
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer">
                    Social accounts
                  </span>
                </li>
                <li>
                  <span className="hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer">
                    Privacy settings
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 2: Subscription */}
            <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] p-5 shadow-xs">
              <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white mb-3">
                Subscription
              </h3>
              <Link
                href="/shop"
                className="text-xs sm:text-sm font-extrabold text-[#777777] dark:text-[#93A4AC] hover:text-[#1CB0F6] transition-colors cursor-pointer"
              >
                Choose a plan
              </Link>
            </div>

            {/* Card 3: Support */}
            <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] p-5 shadow-xs">
              <h3 className="font-black text-base sm:text-lg text-[#4B4B4B] dark:text-white mb-3">
                Support
              </h3>
              <span className="text-xs sm:text-sm font-extrabold text-[#777777] dark:text-[#93A4AC] hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer">
                Help Center
              </span>
            </div>

            {/* Button: LOG OUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-white dark:bg-[#1A2C34] text-[#1CB0F6] font-black uppercase text-xs sm:text-sm tracking-widest hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:translate-y-0.5 transition-all cursor-pointer shadow-xs text-center"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
