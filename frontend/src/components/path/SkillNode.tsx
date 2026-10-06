"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
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

  const { hearts, setIsHeartsModalOpen } = useUserStore();

  const [showLockedTooltip, setShowLockedTooltip] = React.useState(false);

  const handleClick = () => {
    if (isLocked) {
      setShowLockedTooltip(true);
      return;
    }

    // If hearts are at 0 and user attempts to start/resume lesson, show out of hearts popup
    if (hearts <= 0) {
      setIsHeartsModalOpen(true);
      return;
    }

    router.push("/lesson");
  };

  // Auto-dismiss tooltip after 3 seconds or on outside click
  React.useEffect(() => {
    if (!showLockedTooltip) return;
    const timer = setTimeout(() => {
      setShowLockedTooltip(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showLockedTooltip]);

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
      {/* Floating Crown Badge for Completed skills: static golden glow right next to skill */}
      {isCompleted && (
        <div
          className="absolute -top-2 -right-2 z-10 p-2 rounded-full shadow-[0_0_15px_rgba(255,200,0,0.85)] border-2 bg-gradient-to-tr from-[#FFB800] to-[#FFE169] border-[#FFFFFF] text-white"
          title="Skill Mastered!"
        >
          <Crown className="w-5 h-5 fill-white filter drop-shadow-sm" />
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
          aria-label={`${name} - ${status}`}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-100 ease-out cursor-pointer ${
            isCompleted
              ? "bg-[#58CC02] text-white border-b-6 border-[#46a302] active:translate-y-1.5 active:border-b-0 hover:brightness-105 shadow-md"
              : isActive
              ? "bg-[#58CC02] text-white border-b-6 border-[#46a302] active:translate-y-1.5 active:border-b-0 hover:brightness-105 shadow-md"
              : "bg-[#e5e5e5] text-[#afafaf] border-b-6 border-[#cecece] hover:brightness-95 active:translate-y-1 active:border-b-4 opacity-95"
          }`}
        >
          {renderIcon()}
        </button>

        {/* Locked Click Tooltip Popover */}
        {showLockedTooltip && isLocked && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 bg-[#4B4B4B] text-white text-xs font-black py-2.5 px-4 rounded-2xl shadow-xl whitespace-nowrap animate-bounce flex items-center gap-1.5 border-2 border-[#333333]">
            <span>Clear the levels above to unlock this level</span>
            {/* Downward triangle pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#4B4B4B]" />
          </div>
        )}
      </div>
    </div>
  );
};
