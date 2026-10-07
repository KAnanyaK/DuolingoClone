"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { Flame, Zap } from "lucide-react";

export interface LessonCompleteProps {
  xpGained?: number;
  completedLessonId?: number;
  skillId?: number;
}

export const LessonComplete: React.FC<LessonCompleteProps> = ({
  xpGained = 10,
  completedLessonId = 1,
  skillId,
}) => {
  const router = useRouter();
  const { streak, xp, setStats } = useUserStore();

  const [displayXp, setDisplayXp] = useState<number>(xp);
  const [displayStreak, setDisplayStreak] = useState<number>(streak);

  // Strict guard to ensure the API call only runs once on mount
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    // Persist progress to SQLite database backend
    fetch("http://localhost:8000/api/users/1/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        xp_gained: xpGained,
        completed_lesson_id: completedLessonId,
        skill_id: skillId || null,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Progress API error");
        return res.json();
      })
      .then((data: { total_xp: number; streak_days: number }) => {
        const targetXp = data.total_xp;
        const targetStreak = data.streak_days;

        // Animate smoothly to target XP and strictly stop
        const startXp = xp;
        const diffXp = targetXp - startXp;
        const steps = 15;
        let step = 0;

        const interval = setInterval(() => {
          step++;
          if (step >= steps) {
            setDisplayXp(targetXp);
            clearInterval(interval);
          } else {
            setDisplayXp(Math.round(startXp + (diffXp * step) / steps));
          }
        }, 40);

        setDisplayStreak(targetStreak);

        // Update global Zustand store
        setStats({
          xp: targetXp,
          streak: targetStreak,
        });
      })
      .catch(() => {
        // Fallback calculation if backend unreachable (preserve current streak)
        const targetXp = xp + xpGained;
        const targetStreak = streak;
        setDisplayXp(targetXp);
        setDisplayStreak(targetStreak);
        setStats({
          xp: targetXp,
          streak: targetStreak,
        });
      });
  }, []); // Empty dependency array: strictly once on mount

  const handleContinue = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white font-nunito select-none">
      {/* Empty Top Space */}
      <div className="h-10" />

      {/* Main Celebratory Content Area */}
      <div className="flex-1 max-w-lg w-full mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        {/* Happy Duo Owl Mascot SVG */}
        <div className="w-36 h-44 sm:w-44 sm:h-52 mb-6 relative animate-bounce">
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Owl Body */}
            <rect x="15" y="15" width="70" height="90" rx="35" fill="#58CC02" />
            {/* White/Sky Belly with party vibes */}
            <ellipse cx="50" cy="75" rx="24" ry="26" fill="#84D8FF" opacity="0.35" />
            {/* Cheerful Closed Happy Eyes */}
            <path
              d="M 26 46 Q 36 34 46 46"
              stroke="#4B4B4B"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 54 46 Q 64 34 74 46"
              stroke="#4B4B4B"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Rosy Cheeks */}
            <circle cx="24" cy="54" r="5" fill="#FF4B4B" opacity="0.4" />
            <circle cx="76" cy="54" r="5" fill="#FF4B4B" opacity="0.4" />
            {/* Wide Open Happy Beak */}
            <polygon points="50,47 42,60 58,60" fill="#FF9600" />
            <polygon points="50,53 45,59 55,59" fill="#ea2b2b" />
            {/* Cheerful Wings Raised */}
            <path
              d="M 15 50 C 5 40 5 25 18 25 C 22 35 20 45 15 50 Z"
              fill="#46a302"
            />
            <path
              d="M 85 50 C 95 40 95 25 82 25 C 78 35 80 45 85 50 Z"
              fill="#46a302"
            />
            {/* Feet */}
            <ellipse cx="38" cy="108" rx="10" ry="4" fill="#FF9600" />
            <ellipse cx="62" cy="108" rx="10" ry="4" fill="#FF9600" />
          </svg>
        </div>

        {/* Celebratory Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#58CC02] mb-2 tracking-tight">
          Lesson Complete!
        </h1>
        <p className="text-base sm:text-lg font-bold text-[#777777] mb-8">
          You made great progress today. Keep it up!
        </p>

        {/* 3D Stat Cards Row */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Card 1: XP Reward (#FFC800 Yellow) */}
          <div className="bg-[#FFC800] rounded-2xl p-1 text-white shadow-sm border-b-4 border-[#e5a800]">
            <div className="px-3 py-1.5 uppercase tracking-widest text-[11px] font-black text-center opacity-90">
              Total XP
            </div>
            <div className="bg-white rounded-xl py-4 px-3 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 text-[#FFC800] mb-1">
                <Zap className="w-7 h-7 fill-[#FFC800] stroke-none" />
                <span className="text-2xl sm:text-3xl font-black">{displayXp}</span>
              </div>
              <span className="text-xs font-black text-[#e5a800] uppercase tracking-wider">
                +{xpGained} XP
              </span>
            </div>
          </div>

          {/* Card 2: Streak Days (#FF9600 Flame Orange) */}
          <div className="bg-[#FF9600] rounded-2xl p-1 text-white shadow-sm border-b-4 border-[#e07f00]">
            <div className="px-3 py-1.5 uppercase tracking-widest text-[11px] font-black text-center opacity-90">
              Streak
            </div>
            <div className="bg-white rounded-xl py-4 px-3 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 text-[#FF9600] mb-1">
                <Flame className="w-7 h-7 fill-[#FF9600] stroke-none" />
                <span className="text-2xl sm:text-3xl font-black">{displayStreak}</span>
              </div>
              <span className="text-xs font-black text-[#e07f00] uppercase tracking-wider">
                Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Footer */}
      <footer className="w-full border-t-2 border-[#e5e5e5] bg-white py-5 px-6 sm:px-12">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
            className="font-black tracking-widest text-lg py-4"
          >
            Continue
          </Button>
        </div>
      </footer>
    </div>
  );
};
