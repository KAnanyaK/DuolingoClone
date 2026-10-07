"use client";

import React from "react";

interface EatingPandaProps {
  className?: string;
  width?: number;
  height?: number;
}

export const EatingPanda: React.FC<EatingPandaProps> = ({
  className = "",
  width = 125,
  height = 125,
}) => {
  return (
    <div
      className={`inline-block filter drop-shadow-md select-none pointer-events-none ${className}`}
      style={{ width, height }}
      aria-label="Eating Panda Mascot"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible animate-panda-munch"
      >
        <defs>
          <radialGradient
            id="pandaShadow"
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

        {/* Soft ground shadow */}
        <ellipse cx="60" cy="114" rx="38" ry="6" fill="url(#pandaShadow)" />

        {/* Panda Round Ears (Black Chunky) */}
        <circle cx="34" cy="30" r="13" fill="#202F36" stroke="#131F24" strokeWidth="2" />
        <circle cx="34" cy="30" r="7" fill="#37464F" />

        <circle cx="86" cy="30" r="13" fill="#202F36" stroke="#131F24" strokeWidth="2" />
        <circle cx="86" cy="30" r="7" fill="#37464F" />

        {/* Lower Body / Chunky White Tummy */}
        <ellipse
          cx="60"
          cy="85"
          rx="38"
          ry="30"
          fill="#FFFFFF"
          stroke="#E5E5E5"
          strokeWidth="3"
        />

        {/* Back Feet / Paws */}
        <ellipse cx="36" cy="110" rx="13" ry="7" fill="#202F36" stroke="#131F24" strokeWidth="2" />
        <circle cx="36" cy="109" r="4" fill="#37464F" />
        <ellipse cx="84" cy="110" rx="13" ry="7" fill="#202F36" stroke="#131F24" strokeWidth="2" />
        <circle cx="84" cy="109" r="4" fill="#37464F" />

        {/* Panda Head (Big round white face) */}
        <path
          d="M 24 55 C 24 32, 96 32, 96 55 C 96 78, 85 86, 60 86 C 35 86, 24 78, 24 55 Z"
          fill="#FFFFFF"
          stroke="#E5E5E5"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Characteristic Eye Patches (Angled dark ovals) */}
        <ellipse
          cx="42"
          cy="52"
          rx="12"
          ry="15"
          transform="rotate(-18 42 52)"
          fill="#202F36"
        />
        <ellipse
          cx="78"
          cy="52"
          rx="12"
          ry="15"
          transform="rotate(18 78 52)"
          fill="#202F36"
        />

        {/* Eyes (Cute twinkling white + pupil) */}
        <ellipse cx="44" cy="52" rx="4" ry="4.5" fill="#FFFFFF" />
        <ellipse cx="44.5" cy="52" rx="2.8" ry="3" fill="#000000" />
        <circle cx="45.5" cy="50" r="1.5" fill="#FFFFFF" />

        <ellipse cx="76" cy="52" rx="4" ry="4.5" fill="#FFFFFF" />
        <ellipse cx="75.5" cy="52" rx="2.8" ry="3" fill="#000000" />
        <circle cx="76.5" cy="50" r="1.5" fill="#FFFFFF" />

        {/* Snout Area */}
        {/* Soft Pink Cheek Blush */}
        <ellipse cx="29" cy="62" rx="4.5" ry="3" fill="#FF86A5" opacity="0.65" />
        <ellipse cx="91" cy="62" rx="4.5" ry="3" fill="#FF86A5" opacity="0.65" />

        {/* Cute Nose */}
        <path
          d="M 56 62 C 56 60, 64 60, 64 62 C 64 65, 60 67, 60 67 C 60 67, 56 65, 56 62 Z"
          fill="#202F36"
        />

        {/* Chewing Mouth with crumbs/leaf */}
        <g className="animate-panda-jaw">
          <path
            d="M 55 69 Q 60 74 65 69"
            stroke="#202F36"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Munching tiny green leaf tip in mouth */}
          <path
            d="M 59 71 Q 62 74 67 71 Q 64 73 59 71 Z"
            fill="#58CC02"
          />
        </g>

        {/* Left Arm holding bamboo */}
        <ellipse
          cx="33"
          cy="80"
          rx="11"
          ry="15"
          transform="rotate(25 33 80)"
          fill="#202F36"
          stroke="#131F24"
          strokeWidth="2"
        />

        {/* Bamboo Stalk (Animated with subtle shake) */}
        <g className="animate-bamboo-shake">
          {/* Bamboo Main Stem */}
          <path
            d="M 78 40 L 71 96"
            stroke="#58CC02"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Bamboo Segments/Nodes */}
          <line x1="74" y1="52" x2="82" y2="51" stroke="#46A302" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="71" y1="67" x2="79" y2="66" stroke="#46A302" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="68" y1="82" x2="76" y2="81" stroke="#46A302" strokeWidth="2.5" strokeLinecap="round" />

          {/* Bamboo Leaves */}
          <path
            d="M 78 42 C 86 36, 94 38, 97 45 C 92 48, 84 46, 78 42 Z"
            fill="#8EE000"
            stroke="#46A302"
            strokeWidth="1.5"
          />
          <path
            d="M 75 56 C 85 54, 92 60, 94 66 C 88 67, 80 64, 75 56 Z"
            fill="#8EE000"
            stroke="#46A302"
            strokeWidth="1.5"
          />
          <path
            d="M 74 38 C 76 28, 72 20, 66 18 C 66 26, 70 34, 74 38 Z"
            fill="#8EE000"
            stroke="#46A302"
            strokeWidth="1.5"
          />
        </g>

        {/* Right Arm grasping bamboo stem */}
        <ellipse
          cx="70"
          cy="82"
          rx="12"
          ry="14"
          transform="rotate(-20 70 82)"
          fill="#202F36"
          stroke="#131F24"
          strokeWidth="2"
        />
        {/* Paw Finger Knuckles */}
        <circle cx="67" cy="80" r="2.5" fill="#37464F" />
        <circle cx="72" cy="81" r="2.5" fill="#37464F" />
        <circle cx="76" cy="84" r="2.5" fill="#37464F" />
      </svg>
    </div>
  );
};
export default EatingPanda;
