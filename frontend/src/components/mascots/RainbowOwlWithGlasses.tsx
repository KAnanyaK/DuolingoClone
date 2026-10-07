"use client";

import React from "react";

interface RainbowOwlProps {
  className?: string;
  width?: number;
  height?: number;
}

export const RainbowOwlWithGlasses: React.FC<RainbowOwlProps> = ({
  className = "",
  width = 130,
  height = 130,
}) => {
  return (
    <div
      className={`inline-block filter drop-shadow-lg select-none pointer-events-none relative ${className}`}
      style={{ width, height }}
      aria-label="Rainbow Duo Owl Mascot with Glasses"
    >
      <style jsx>{`
        @keyframes rainbowOwlJumpAnim {
          0%, 100% {
            transform: translateY(0) scale(1, 0.95);
          }
          45% {
            transform: translateY(-22px) scale(0.97, 1.06) rotate(-2deg);
          }
          55% {
            transform: translateY(-22px) scale(0.97, 1.06) rotate(2deg);
          }
          75% {
            transform: translateY(-4px) scale(1.03, 0.97);
          }
        }
        @keyframes rainbowShadowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(0.6);
            opacity: 0.12;
          }
        }
        @keyframes superWingL {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-14deg); }
        }
        @keyframes superWingR {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(14deg); }
        }
        .animate-rainbow-owl-jump {
          animation: rainbowOwlJumpAnim 1.6s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
          transform-origin: bottom center;
        }
        .animate-rainbow-shadow {
          animation: rainbowShadowPulse 1.6s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
          transform-origin: center;
        }
        .animate-wing-left {
          animation: superWingL 1.6s ease-in-out infinite;
          transform-origin: 32px 65px;
        }
        .animate-wing-right {
          animation: superWingR 1.6s ease-in-out infinite;
          transform-origin: 88px 65px;
        }
      `}</style>

      <svg
        viewBox="0 0 120 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Rainbow Gradient for Body */}
          <linearGradient id="rainbowBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4B4B" />
            <stop offset="20%" stopColor="#FF9600" />
            <stop offset="40%" stopColor="#FFC800" />
            <stop offset="60%" stopColor="#58CC02" />
            <stop offset="80%" stopColor="#1CB0F6" />
            <stop offset="100%" stopColor="#CE82FF" />
          </linearGradient>

          {/* Rainbow Gradient for Belly */}
          <linearGradient id="rainbowBellyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDE6A" />
            <stop offset="40%" stopColor="#8EE000" />
            <stop offset="80%" stopColor="#7BE2FF" />
            <stop offset="100%" stopColor="#E9B7FF" />
          </linearGradient>

          {/* Left Wing Gradient */}
          <linearGradient id="rainbowWingL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4B4B" />
            <stop offset="50%" stopColor="#FF9600" />
            <stop offset="100%" stopColor="#58CC02" />
          </linearGradient>

          {/* Right Wing Gradient */}
          <linearGradient id="rainbowWingR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#58CC02" />
            <stop offset="50%" stopColor="#1CB0F6" />
            <stop offset="100%" stopColor="#CE82FF" />
          </linearGradient>

          {/* Glasses Frame Gradient (Metallic Dark Holographic) */}
          <linearGradient id="glassesFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B262C" />
            <stop offset="50%" stopColor="#2A3842" />
            <stop offset="100%" stopColor="#151D22" />
          </linearGradient>

          {/* Lens Glass Tint */}
          <linearGradient id="lensTint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7BE2FF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#CE82FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF9600" stopOpacity="0.2" />
          </linearGradient>

          {/* Shadow Gradient */}
          <radialGradient id="rainbowOwlShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Ground Shadow */}
        <ellipse
          cx="60"
          cy="118"
          rx="34"
          ry="6"
          fill="url(#rainbowOwlShadow)"
          className="animate-rainbow-shadow"
        />

        {/* The Jumping Owl Container */}
        <g className="animate-rainbow-owl-jump">
          {/* Feet (Golden Orange Chunky Paws) */}
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

          {/* Left Wing (Animated flapping) */}
          <g className="animate-wing-left">
            <path
              d="M 32 58 C 18 64, 8 78, 14 90 C 18 97, 27 94, 34 84 C 36 76, 35 66, 32 58 Z"
              fill="url(#rainbowWingL)"
              stroke="#D43F3F"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Wing Feather Line */}
            <path
              d="M 22 74 C 18 80, 20 86, 26 84 C 30 78, 30 72, 28 68"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Right Wing (Animated flapping) */}
          <g className="animate-wing-right">
            <path
              d="M 88 58 C 102 64, 112 78, 106 90 C 102 97, 93 94, 86 84 C 84 76, 85 66, 88 58 Z"
              fill="url(#rainbowWingR)"
              stroke="#B360E6"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Wing Feather Line */}
            <path
              d="M 98 74 C 102 80, 100 86, 94 84 C 90 78, 90 72, 92 68"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Main Body (Chunky Pill Shape with Rainbow Gradient) */}
          <path
            d="M 28 50 C 28 22, 92 22, 92 50 C 92 82, 86 108, 60 108 C 34 108, 28 82, 28 50 Z"
            fill="url(#rainbowBodyGrad)"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Ear Tufts */}
          <path
            d="M 32 30 C 24 20, 24 8, 38 18 C 36 24, 34 28, 32 30 Z"
            fill="#FF4B4B"
          />
          <path
            d="M 88 30 C 96 20, 96 8, 82 18 C 84 24, 86 28, 88 30 Z"
            fill="#CE82FF"
          />

          {/* Belly Patch with Radiant Pastel Gradient */}
          <path
            d="M 40 70 C 40 58, 80 58, 80 70 C 80 96, 74 104, 60 104 C 46 104, 40 96, 40 70 Z"
            fill="url(#rainbowBellyGrad)"
            opacity="0.95"
          />

          {/* Belly Chevrons */}
          <path
            d="M 52 76 L 60 82 L 68 76"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d="M 54 88 L 60 93 L 66 88"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Characteristic Big Duo Eyes */}
          {/* Left Eye Sclera */}
          <circle cx="47" cy="46" r="14" fill="#FFFFFF" />
          {/* Right Eye Sclera */}
          <circle cx="73" cy="46" r="14" fill="#FFFFFF" />

          {/* Eye Pupils (Looking slightly up with joy) */}
          <circle cx="47" cy="45" r="7" fill="#1B262C" />
          <circle cx="73" cy="45" r="7" fill="#1B262C" />

          {/* Cute Catchlight Sparkles */}
          <circle cx="45" cy="43" r="2.5" fill="#FFFFFF" />
          <circle cx="49" cy="47" r="1.2" fill="#FFFFFF" />
          <circle cx="71" cy="43" r="2.5" fill="#FFFFFF" />
          <circle cx="75" cy="47" r="1.2" fill="#FFFFFF" />

          {/* Beak (Golden Orange Wedge) */}
          <polygon
            points="60,49 55,59 65,59"
            fill="#FF9600"
            stroke="#E07A00"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* ================= STYLISH GLASSES ================= */}
          {/* Glasses Frame Shadows */}
          <circle cx="47" cy="46" r="16.5" stroke="#000000" strokeWidth="4" opacity="0.15" />
          <circle cx="73" cy="46" r="16.5" stroke="#000000" strokeWidth="4" opacity="0.15" />

          {/* Left Lens Tint */}
          <circle cx="47" cy="46" r="15" fill="url(#lensTint)" />
          {/* Right Lens Tint */}
          <circle cx="73" cy="46" r="15" fill="url(#lensTint)" />

          {/* Left Rim */}
          <circle
            cx="47"
            cy="46"
            r="16.5"
            stroke="url(#glassesFrameGrad)"
            strokeWidth="4"
          />
          {/* Right Rim */}
          <circle
            cx="73"
            cy="46"
            r="16.5"
            stroke="url(#glassesFrameGrad)"
            strokeWidth="4"
          />

          {/* Center Bridge */}
          <path
            d="M 60 44 Q 60 41 60 44"
            stroke="url(#glassesFrameGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line
            x1="57"
            y1="44"
            x2="63"
            y2="44"
            stroke="url(#glassesFrameGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Left Temple / Arm */}
          <path
            d="M 33 46 L 25 43"
            stroke="url(#glassesFrameGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Right Temple / Arm */}
          <path
            d="M 87 46 L 95 43"
            stroke="url(#glassesFrameGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Glasses Specular Glare (Cool Reflex Lines) */}
          {/* Left lens glare */}
          <path
            d="M 38 41 L 43 36"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 43 46 L 46 43"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Right lens glare */}
          <path
            d="M 64 41 L 69 36"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 69 46 L 72 43"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Cute Rosy Cheeks */}
          <circle cx="34" cy="56" r="4.5" fill="#FF4B4B" opacity="0.35" />
          <circle cx="86" cy="56" r="4.5" fill="#FF4B4B" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
};
