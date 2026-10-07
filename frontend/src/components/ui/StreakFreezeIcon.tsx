"use client";

import React from "react";

interface StreakFreezeIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const StreakFreezeIcon: React.FC<StreakFreezeIconProps> = ({
  className = "",
  width = 28,
  height = 28,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className={`inline-block select-none filter drop-shadow-xs overflow-visible ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Streak Freeze Equipped"
    >
      <defs>
        {/* Flame Gradient */}
        <linearGradient id="freezeFlameGrad" x1="50%" y1="15%" x2="50%" y2="95%">
          <stop offset="0%" stopColor="#FF9600" />
          <stop offset="60%" stopColor="#FF7700" />
          <stop offset="100%" stopColor="#E05300" />
        </linearGradient>

        <linearGradient id="freezeInnerFlame" x1="50%" y1="35%" x2="50%" y2="90%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="50%" stopColor="#FFC800" />
          <stop offset="100%" stopColor="#FFA600" />
        </linearGradient>

        {/* Ice Gradient */}
        <linearGradient id="iceBlockGrad" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#D4F6FF" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#99E6FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#55D0F5" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* ================= BASE LAYER: STANDARD DUOLINGO FLAME ================= */}
      {/* Outer Flame in bright orange */}
      <path
        d="M50 14 C40 32, 22 46, 22 66 C22 83, 34 93, 50 93 C66 93, 78 83, 78 66 C78 46, 60 32, 50 14 Z"
        fill="url(#freezeFlameGrad)"
      />

      {/* Secondary Flame Accent */}
      <path
        d="M50 24 C44 38, 29 50, 29 67 C29 80, 38 88, 50 88 C62 88, 71 80, 71 67 C71 50, 56 38, 50 24 Z"
        fill="#FF9600"
      />

      {/* Inner Flame in bright yellow */}
      <path
        d="M50 40 C43 51, 35 60, 35 71 C35 80, 41 86, 50 86 C59 86, 65 80, 65 71 C65 60, 57 51, 50 40 Z"
        fill="url(#freezeInnerFlame)"
      />

      {/* Core Hotspot Spark */}
      <ellipse cx="50" cy="74" rx="8" ry="10" fill="#FFFFFF" opacity="0.6" />

      {/* ================= ICE LAYER: TRANSLUCENT JAGGED ICE BLOCK ================= */}
      {/* Jagged Polygon encompassing the flame */}
      <polygon
        points="50,6 78,16 93,42 87,76 68,95 32,95 13,76 7,42 22,16"
        fill="url(#iceBlockGrad)"
        stroke="#70D8F8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Internal crystalline facets for realistic ice refraction */}
      <polygon
        points="50,6 78,16 63,44 50,26 37,44 22,16"
        fill="#B8EEFF"
        fillOpacity="0.35"
      />
      <polygon
        points="7,42 22,16 37,44 24,70 13,76"
        fill="#7BD8F5"
        fillOpacity="0.25"
      />
      <polygon
        points="93,42 78,16 63,44 76,70 87,76"
        fill="#8DE0FA"
        fillOpacity="0.25"
      />

      {/* ================= HIGHLIGHTS: SHARP ANGLED WHITE STROKE LINES ================= */}
      {/* Top peak and upper edge glints */}
      <polyline
        points="24,17 50,7 76,17"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* Top-left angled reflection stroke */}
      <line
        x1="12"
        y1="40"
        x2="22"
        y2="20"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Top-right sharp edge reflection */}
      <line
        x1="78"
        y1="20"
        x2="88"
        y2="38"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Left lower facet edge */}
      <line
        x1="9"
        y1="46"
        x2="14"
        y2="72"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Specular Glint Sparkle Star on top right ice corner */}
      <polygon
        points="76,28 78,32 82,33 78,34 76,38 74,34 70,33 74,32"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <circle cx="76" cy="33" r="1.5" fill="#FFFFFF" />
    </svg>
  );
};
