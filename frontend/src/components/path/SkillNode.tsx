"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Crown, Star, BookOpen, MessageCircle, PawPrint, Utensils, Trophy, Lock } from "lucide-react";

export type SkillStatus = "completed" | "active" | "locked";

export interface SkillNodeProps {
  id: number;
  name: string;
  status: SkillStatus;
  progress?: number;
  totalLessons?: number;
  icon?: string;
  className?: string;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  id,
  name,
  status,
  progress = 0,
  totalLessons = 4,
  icon = "star",
  className = "",
}) => {
  const router = useRouter();

  const isLocked = status === "locked";
  const isActive = status === "active";
  const isCompleted = status === "completed";

  // Calculate progress circle stroke dasharray
  // Radius = 48, Circumference = 2 * PI * 48 ≈ 301.6
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progressFraction = totalLessons > 0 ? Math.min(1, Math.max(0, progress / totalLessons)) : 0;
  const strokeDashoffset = circumference - progressFraction * circumference;

  const handleClick = () => {
    if (isLocked) return;
    router.push("/lesson");
  };

  // Render appropriate inner icon
  const renderIcon = () => {
    if (isLocked) {
      return <Lock className="w-8 h-8 stroke-[2.5]" />;
    }
    switch (icon) {
      case "book":
        return <BookOpen className="w-9 h-9 stroke-[2.5]" />;
      case "message":
        return <MessageCircle className="w-9 h-9 stroke-[2.5]" />;
      case "paw":
        return <PawPrint className="w-9 h-9 stroke-[2.5]" />;
      case "utensils":
        return <Utensils className="w-9 h-9 stroke-[2.5]" />;
      case "trophy":
        return <Trophy className="w-9 h-9 stroke-[2.5]" />;
      case "star":
      default:
        return <Star className="w-9 h-9 fill-current stroke-[2]" />;
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Floating Crown Badge for Completed or Active skills */}
      {(isCompleted || isActive) && (
        <div
          className={`absolute -top-3 right-0 z-10 p-1.5 rounded-full shadow-md border-2 ${
            isCompleted
              ? "bg-[#FFC800] border-[#e5a800] text-white animate-pulse"
              : "bg-[#FFC800] border-[#e5a800] text-white"
          }`}
          title={isCompleted ? "Skill Mastered!" : "In Progress"}
        >
          <Crown className="w-4 h-4 fill-white" />
        </div>
      )}

      {/* Node Container with optional SVG Progress Ring */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* SVG Progress Ring (for Active Skill) */}
        {isActive && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 112 112"
          >
            {/* Background tracking track */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="#e5e5e5"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Active animated stroke progress */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="#58CC02"
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
        )}

        {/* Circular 3D Button */}
        <button
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`${name} - ${status}`}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-100 ease-out cursor-pointer ${
            isCompleted
              ? "bg-[#58CC02] text-white border-b-6 border-[#46a302] active:translate-y-1.5 active:border-b-0 hover:brightness-105 shadow-md"
              : isActive
              ? "bg-[#58CC02] text-white border-b-6 border-[#46a302] active:translate-y-1.5 active:border-b-0 hover:brightness-105 shadow-md"
              : "bg-[#e5e5e5] text-[#afafaf] border-b-6 border-[#cecece] cursor-not-allowed opacity-90"
          }`}
        >
          {renderIcon()}
        </button>
      </div>

      {/* Skill Label */}
      <span
        className={`mt-2 font-black text-sm uppercase tracking-wider text-center max-w-28 leading-tight ${
          isLocked ? "text-[#afafaf]" : "text-[#4B4B4B]"
        }`}
      >
        {name}
      </span>
    </div>
  );
};
