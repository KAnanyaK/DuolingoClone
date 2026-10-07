"use client";

import React, { use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkillNode } from "@/components/path/SkillNode";
import { DancingOwl } from "@/components/mascots/DancingOwl";
import { EatingPanda } from "@/components/mascots/EatingPanda";
import { PainterMascot } from "@/components/mascots/PainterMascot";
import { Sparkles, ArrowLeft, Lock } from "lucide-react";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

const COURSE_INFO: Record<string, { title: string; flag: string; nativeName: string }> = {
  french: { title: "French", flag: "🇫🇷", nativeName: "Français" },
  spanish: { title: "Spanish", flag: "🇪🇸", nativeName: "Español" },
};

export default function CourseComingSoonPage({ params }: CoursePageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId.toLowerCase();
  const info = COURSE_INFO[courseId] || {
    title: courseId.charAt(0).toUpperCase() + courseId.slice(1),
    flag: "🌍",
    nativeName: courseId,
  };

  const zigzagOffsets = [
    "translate-x-12 sm:translate-x-16",
    "-translate-x-12 sm:-translate-x-16",
    "translate-x-12 sm:translate-x-16",
  ];

  const renderRealFlag = () => {
    if (courseId === "french") {
      return (
        <svg
          viewBox="0 0 60 42"
          className="w-16 h-11 rounded-xl overflow-hidden shadow-md border-2 border-white/80"
        >
          <rect width="60" height="42" fill="#FFFFFF" />
          <rect x="0" y="0" width="20" height="42" fill="#0055A4" />
          <rect x="20" y="0" width="20" height="42" fill="#FFFFFF" />
          <rect x="40" y="0" width="20" height="42" fill="#EF4135" />
        </svg>
      );
    }

    if (courseId === "spanish") {
      return (
        <svg
          viewBox="0 0 60 42"
          className="w-16 h-11 rounded-xl overflow-hidden shadow-md border-2 border-white/80"
        >
          <rect width="60" height="42" fill="#FFFFFF" />
          {/* Top Red stripe */}
          <rect x="0" y="0" width="60" height="10.5" fill="#AA151B" />
          {/* Middle Gold stripe */}
          <rect x="0" y="10.5" width="60" height="21" fill="#F1BF00" />
          {/* Bottom Red stripe */}
          <rect x="0" y="31.5" width="60" height="10.5" fill="#AA151B" />

          {/* Spanish Coat of Arms emblem */}
          <g transform="translate(14, 15) scale(0.65)">
            <rect x="0" y="0" width="12" height="14" rx="2" fill="#AA151B" />
            <rect x="2" y="2" width="8" height="10" rx="1" fill="#FFFFFF" />
            <circle cx="6" cy="7" r="2.5" fill="#F1BF00" />
            {/* Crown on top */}
            <path d="M 0 0 L 3 -3 L 6 -1 L 9 -3 L 12 0 Z" fill="#F1BF00" />
          </g>
        </svg>
      );
    }

    // Default German flag
    return (
      <svg
        viewBox="0 0 60 42"
        className="w-16 h-11 rounded-xl overflow-hidden shadow-md border-2 border-white/80"
      >
        <rect width="60" height="42" fill="#FFFFFF" />
        <rect y="0" width="60" height="14" fill="#202F36" />
        <rect y="14" width="60" height="14" fill="#FF4B4B" />
        <rect y="28" width="60" height="14" fill="#FFC800" />
      </svg>
    );
  };

  return (
    <AppLayout showTopBar={true}>
      <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden font-nunito">
        {/* Background layer: Identical to German path layout */}
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 flex flex-col items-center select-none pointer-events-none">
          {/* Unit 1 Simulated Banner */}
          <div className="w-full bg-[#58CC02] rounded-3xl p-6 text-white mb-12 shadow-sm flex items-center justify-between opacity-80">
            <div>
              <div className="uppercase tracking-widest text-xs font-black opacity-85 mb-1">
                Unit 1
              </div>
              <h1 className="text-xl sm:text-2xl font-black mb-1">
                {info.title}: Introduction & Basics
              </h1>
              <p className="text-xs sm:text-sm font-semibold opacity-95">
                Say hello and introduce yourself in {info.title}
              </p>
            </div>
          </div>

          {/* Zigzag Nodes with Mascots */}
          <div className="relative flex flex-col items-center gap-10 sm:gap-14 py-4 w-full opacity-60">
            <div className="absolute right-2 sm:right-4 md:right-12 top-[30%] -translate-y-1/2 z-0 scale-75 sm:scale-90 md:scale-100">
              <DancingOwl />
            </div>

            <div className={`relative z-10 ${zigzagOffsets[0]}`}>
              <SkillNode
                id={101}
                name="Basics"
                status="locked"
                progress={0}
                totalLessons={4}
                icon="star"
              />
            </div>
            <div className={`relative z-10 ${zigzagOffsets[1]}`}>
              <SkillNode
                id={102}
                name="Phrases"
                status="locked"
                progress={0}
                totalLessons={4}
                icon="book"
              />
            </div>
            <div className={`relative z-10 ${zigzagOffsets[2]}`}>
              <SkillNode
                id={103}
                name="Travel"
                status="locked"
                progress={0}
                totalLessons={4}
                icon="message"
              />
            </div>
          </div>

          {/* Unit 2 Simulated Banner */}
          <div className="w-full bg-[#1CB0F6] rounded-3xl p-6 text-white my-12 shadow-sm opacity-50">
            <div className="uppercase tracking-widest text-xs font-black opacity-85 mb-1">
              Unit 2
            </div>
            <h2 className="text-xl sm:text-2xl font-black mb-1">
              {info.title}: Everyday Life
            </h2>
          </div>

          <div className="relative flex flex-col items-center gap-10 sm:gap-14 py-4 w-full opacity-50">
            <div className="absolute left-2 sm:left-4 md:left-12 top-[50%] -translate-y-1/2 z-0 scale-75 sm:scale-90 md:scale-100">
              <EatingPanda />
            </div>
            <div className={`relative z-10 ${zigzagOffsets[0]}`}>
              <SkillNode
                id={104}
                name="Family"
                status="locked"
                progress={0}
                totalLessons={4}
                icon="star"
              />
            </div>
          </div>
        </div>

        {/* HAZY GHOST OVERLAY across the entire screen */}
        <div className="absolute inset-0 z-40 bg-white/70 dark:bg-[#131F24]/80 backdrop-blur-md transition-all flex items-center justify-center p-4">
          {/* Clear Green Front Card (Duolingo green #58CC02 theme) */}
          <div className="max-w-md w-full bg-white dark:bg-[#1A2C34] rounded-3xl p-8 text-center border-4 border-[#58CC02] shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Real Flag Badge with Sparkling accent */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-24 h-20 rounded-3xl bg-[#d7ffb8] dark:bg-[#203D2A] border-2 border-[#58CC02] flex items-center justify-center p-2 shadow-inner">
                {renderRealFlag()}
              </div>
              <div className="absolute -top-2 -right-2 bg-[#58CC02] text-white p-1.5 rounded-full shadow-md animate-bounce">
                <Sparkles className="w-5 h-5 fill-white stroke-[2.5]" />
              </div>
            </div>

            {/* Clear Green Front Heading */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#58CC02] mb-3 leading-tight tracking-tight">
              Coming Soon
            </h2>

            {/* Prompt text as requested */}
            <p className="text-base sm:text-lg font-extrabold text-[#4B4B4B] dark:text-[#E5E5E5] mb-2 leading-relaxed">
              Till then, practice more German lessons with us...
            </p>

            <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC] mb-8">
              We are working hard to craft comprehensive {info.title} lessons with vocabulary, speech exercises, and culture guides!
            </p>

            {/* Action Return Button */}
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#58CC02] hover:bg-[#46a302] active:translate-y-1 text-white font-black uppercase tracking-wider text-base border-b-4 border-b-[#46a302] shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[3]" />
              Return to German Path
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
