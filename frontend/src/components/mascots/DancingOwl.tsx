"use client";

import React from "react";

interface DancingOwlProps {
  className?: string;
  width?: number;
  height?: number;
}

export const DancingOwl: React.FC<DancingOwlProps> = ({
  className = "",
  width = 120,
  height = 120,
}) => {
  return (
    <div
      className={`inline-block filter drop-shadow-md select-none pointer-events-none ${className}`}
      style={{ width, height }}
      aria-label="Dancing Duo Owl Mascot"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible animate-owl-dance"
      >
        <defs>
          <radialGradient
            id="owlShadow"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ground shadow beneath feet */}
        <ellipse cx="60" cy="114" rx="36" ry="6" fill="url(#owlShadow)" />

        {/* Feet (Orange Chunky Duolingo Paws) */}
        <path
          d="M 44 104 C 44 112, 32 113, 30 113 C 28 113, 26 111, 28 107 C 30 102, 38 101, 44 104 Z"
          fill="#FF9600"
        />
        <path
          d="M 45 106 C 45 113, 39 114, 37 114 C 35 114, 34 112, 36 109 C 39 104, 43 103, 45 106 Z"
          fill="#E07A00"
        />
        <path
          d="M 76 104 C 76 112, 88 113, 90 113 C 92 113, 94 111, 92 107 C 90 102, 82 101, 76 104 Z"
          fill="#FF9600"
        />
        <path
          d="M 75 106 C 75 113, 81 114, 83 114 C 85 114, 86 112, 84 109 C 81 104, 77 103, 75 106 Z"
          fill="#E07A00"
        />

        {/* Left Wing (Flapping) */}
        <g className="animate-owl-wing-l">
          <path
            d="M 32 58 C 18 64, 8 78, 14 90 C 18 97, 27 94, 34 84 C 36 76, 35 66, 32 58 Z"
            fill="#58CC02"
            stroke="#46A302"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner Wing Feather Highlight */}
          <path
            d="M 22 74 C 18 80, 20 86, 26 84 C 30 78, 30 72, 28 68"
            stroke="#8EE000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Right Wing (Flapping) */}
        <g className="animate-owl-wing-r">
          <path
            d="M 88 58 C 102 64, 112 78, 106 90 C 102 97, 93 94, 86 84 C 84 76, 85 66, 88 58 Z"
            fill="#58CC02"
            stroke="#46A302"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner Wing Feather Highlight */}
          <path
            d="M 98 74 C 102 80, 100 86, 94 84 C 90 78, 90 72, 92 68"
            stroke="#8EE000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Main Body (Chunky Pill Shape) */}
        <path
          d="M 28 50 C 28 22, 92 22, 92 50 C 92 82, 86 108, 60 108 C 34 108, 28 82, 28 50 Z"
          fill="#58CC02"
          stroke="#46A302"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Tuft / Ear Feathers */}
        <path
          d="M 32 30 C 24 20, 24 8, 38 18 C 36 24, 34 28, 32 30 Z"
          fill="#46A302"
        />
        <path
          d="M 88 30 C 96 20, 96 8, 82 18 C 84 24, 86 28, 88 30 Z"
          fill="#46A302"
        />

        {/* Light Green Belly Patch */}
        <path
          d="M 40 70 C 40 58, 80 58, 80 70 C 80 96, 74 104, 60 104 C 46 104, 40 96, 40 70 Z"
          fill="#8EE000"
        />

        {/* Belly Feather Chevrons */}
        <path
          d="M 52 76 L 60 82 L 68 76"
          stroke="#58CC02"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 54 88 L 60 93 L 66 88"
          stroke="#58CC02"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Big Characteristic Duo Eyes */}
        {/* Eye Outlines (White Pill-Circles) */}
        <ellipse
          cx="45"
          cy="48"
          rx="15"
          ry="17"
          fill="#FFFFFF"
          stroke="#46A302"
          strokeWidth="3.5"
        />
        <ellipse
          cx="75"
          cy="48"
          rx="15"
          ry="17"
          fill="#FFFFFF"
          stroke="#46A302"
          strokeWidth="3.5"
        />

        {/* Iris / Pupils (Black with joyful glint) */}
        <ellipse cx="48" cy="48" rx="8" ry="9" fill="#202F36" />
        <ellipse cx="72" cy="48" rx="8" ry="9" fill="#202F36" />

        {/* White Eye Sparkles (Gleams) */}
        <circle cx="51" cy="44" r="3.5" fill="#FFFFFF" />
        <circle cx="46" cy="51" r="1.5" fill="#FFFFFF" />
        <circle cx="75" cy="44" r="3.5" fill="#FFFFFF" />
        <circle cx="70" cy="51" r="1.5" fill="#FFFFFF" />

        {/* Cheerful Curved Beak (Orange) */}
        <path
          d="M 53 52 C 53 50, 67 50, 67 52 C 67 62, 60 67, 60 67 C 60 67, 53 62, 53 52 Z"
          fill="#FF9600"
          stroke="#E07A00"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Beak Highlight */}
        <path
          d="M 57 53 C 58 52, 62 52, 63 53 C 62 56, 58 56, 57 53 Z"
          fill="#FFB84D"
        />

        {/* Cheerful Pink Blush */}
        <ellipse cx="32" cy="62" rx="4" ry="2.5" fill="#FF86A5" opacity="0.6" />
        <ellipse cx="88" cy="62" rx="4" ry="2.5" fill="#FF86A5" opacity="0.6" />
      </svg>
    </div>
  );
};
export default DancingOwl;
