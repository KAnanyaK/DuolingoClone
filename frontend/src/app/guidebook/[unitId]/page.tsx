"use client";

import React, { use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ArrowLeft, Volume2 } from "lucide-react";

interface GuidebookPageProps {
  params: Promise<{
    unitId: string;
  }>;
}

export default function GuidebookPage({ params }: GuidebookPageProps) {
  const resolvedParams = use(params);
  const unitNumber = resolvedParams.unitId || "1";

  const keyPhrases = [
    {
      german: "Hallo, Kaffee oder Tee?",
      english: "Hello, coffee or tea?",
    },
    {
      german: "Kaffee mit Milch, bitte.",
      english: "Coffee with milk, please.",
    },
    {
      german: "Tee mit Zucker, bitte!",
      english: "Tea with sugar, please!",
    },
    {
      german: "Kekse und Kaffee, bitte!",
      english: "Cookies and coffee, please!",
    },
    {
      german: "Danke, tschüss!",
      english: "Thanks, bye!",
    },
  ];

  const vocabTable = [
    { german: "und", english: "and" },
    { german: "oder", english: "or" },
    { german: "mit", english: "with" },
  ];

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AppLayout showTopBar={false}>
      <div className="min-h-screen bg-white dark:bg-[#131F24] font-nunito transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Top Back Navigation Button */}
          <div className="pb-4 mb-4 border-b border-[#E5E5E5] dark:border-[#202F36]">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-[#777777] dark:text-[#93A4AC] hover:text-[#4B4B4B] dark:hover:text-white font-black text-sm uppercase tracking-wider transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>
          </div>

          {/* Unit Header Section with Duo Owl Mascot */}
          <div className="flex items-center gap-6 mb-8">
            {/* Duo Owl Vector Mascot (Matching screenshot: green owl with wide sparkling eyes and orange beak) */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 filter drop-shadow-md">
              <svg
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Ground shadow */}
                <ellipse cx="60" cy="110" rx="36" ry="6" fill="#000000" opacity="0.15" />

                {/* Feet */}
                <path d="M 44 100 C 44 108, 32 109, 30 109 C 28 109, 26 107, 28 103 C 30 98, 38 97, 44 100 Z" fill="#FF9600" />
                <path d="M 76 100 C 76 108, 88 109, 90 109 C 92 109, 94 107, 92 103 C 90 98, 82 97, 76 100 Z" fill="#FF9600" />

                {/* Body */}
                <path
                  d="M 28 46 C 28 20, 92 20, 92 46 C 92 78, 86 104, 60 104 C 34 104, 28 78, 28 46 Z"
                  fill="#58CC02"
                />

                {/* Ear Tufts */}
                <path d="M 32 26 C 24 16, 24 6, 38 16 C 36 22, 34 24, 32 26 Z" fill="#46A302" />
                <path d="M 88 26 C 96 16, 96 6, 82 16 C 84 22, 86 24, 88 26 Z" fill="#46A302" />

                {/* Light Green Tummy */}
                <path
                  d="M 40 68 C 40 56, 80 56, 80 68 C 80 94, 74 102, 60 102 C 46 102, 40 94, 40 68 Z"
                  fill="#8EE000"
                />

                {/* Eyes */}
                <ellipse cx="44" cy="46" rx="14" ry="16" fill="#FFFFFF" />
                <ellipse cx="76" cy="46" rx="14" ry="16" fill="#FFFFFF" />

                <ellipse cx="46" cy="46" rx="8" ry="9" fill="#202F36" />
                <ellipse cx="74" cy="46" rx="8" ry="9" fill="#202F36" />

                <circle cx="49" cy="42" r="3.5" fill="#FFFFFF" />
                <circle cx="77" cy="42" r="3.5" fill="#FFFFFF" />

                {/* Orange Beak */}
                <path
                  d="M 53 50 C 53 48, 67 48, 67 50 C 67 60, 60 65, 60 65 C 60 65, 53 60, 53 50 Z"
                  fill="#FF9600"
                />
              </svg>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white tracking-tight mb-1">
                Unit {unitNumber} Guidebook
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#777777] dark:text-[#93A4AC]">
                Explore grammar tips and key phrases for this unit
              </p>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] dark:border-[#202F36] pt-6 pb-2" />

          {/* KEY PHRASES SECTION */}
          <div className="mb-10">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1CB0F6] mb-4">
              KEY PHRASES
            </h2>

            {/* List of Speech Bubble Dialogue Cards */}
            <div className="flex flex-col gap-3">
              {keyPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(phrase.german)}
                  className="relative group bg-white dark:bg-[#1A2C34] hover:bg-[#F0F8FF] dark:hover:bg-[#203742] border-2 border-[#E5E5E5] dark:border-[#263E4B] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 transition-all cursor-pointer shadow-xs active:scale-[0.99] max-w-md"
                >
                  {/* Left speech pointer triangle */}
                  <div className="absolute -left-2 top-5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-[#E5E5E5] dark:border-r-[#263E4B]" />
                  <div className="absolute -left-[6px] top-5 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-white dark:border-r-[#1A2C34]" />

                  {/* Audio Speaker Icon */}
                  <button
                    type="button"
                    className="text-[#1CB0F6] group-hover:scale-110 active:scale-95 transition-transform p-0.5 mt-0.5 flex-shrink-0"
                    title="Play pronunciation"
                    aria-label={`Listen to ${phrase.german}`}
                  >
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                  </button>

                  {/* German text with dotted underline + English translation */}
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base sm:text-lg text-[#4B4B4B] dark:text-white leading-snug border-b-2 border-dotted border-[#AFAFAF] dark:border-[#58646D] inline-block pb-0.5 w-fit">
                      {phrase.german}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] mt-1">
                      {phrase.english}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GRAMMAR TIP CARD (Light Blue #ddf4ff container in light mode, Dark Slate #1A2C34 in dark mode) */}
          <div className="bg-[#E7F6FD] dark:bg-[#1A2C34] border-2 border-[#B9E8FD] dark:border-[#263E4B] rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
            <span className="text-xs font-black uppercase tracking-wider text-[#1CB0F6] mb-2 block">
              TIP
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B] dark:text-white mb-3">
              Und, oder, and mit
            </h3>

            <p className="text-sm sm:text-base font-bold text-[#4B4B4B] dark:text-[#E5E5E5] mb-6">
              These words work just like their English equivalents:
            </p>

            {/* Table: German vs English */}
            <div className="rounded-2xl overflow-hidden border-2 border-[#B9E8FD] dark:border-[#263E4B] mb-6 bg-white dark:bg-[#131F24]">
              {/* Table Header */}
              <div className="grid grid-cols-2 bg-[#D3EFFF] dark:bg-[#203742] border-b-2 border-[#B9E8FD] dark:border-[#263E4B] font-black text-xs sm:text-sm text-[#4B4B4B] dark:text-white p-3.5">
                <div>German</div>
                <div>English</div>
              </div>

              {/* Table Rows */}
              {vocabTable.map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-2 p-3.5 text-sm sm:text-base font-extrabold ${
                    idx < vocabTable.length - 1
                      ? "border-b border-[#E5F5FD] dark:border-[#203742]"
                      : ""
                  }`}
                >
                  <div className="text-[#1CB0F6]">{row.german}</div>
                  <div className="text-[#4B4B4B] dark:text-white">{row.english}</div>
                </div>
              ))}
            </div>

            {/* Example sentence */}
            <div
              onClick={() => speakText("Kaffee oder Tee?")}
              className="flex items-start gap-3 cursor-pointer group w-fit"
            >
              <button
                type="button"
                className="text-[#1CB0F6] group-hover:scale-110 active:scale-95 transition-transform p-0.5 mt-0.5"
                aria-label="Listen to example"
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-[#4B4B4B] dark:text-white">
                  Kaffee <span className="text-[#1CB0F6]">oder</span> Tee?
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                  Coffee or tea?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
