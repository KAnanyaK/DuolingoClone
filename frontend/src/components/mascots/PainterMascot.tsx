"use client";

import React from "react";

interface PainterMascotProps {
  className?: string;
  width?: number;
  height?: number;
}

export const PainterMascot: React.FC<PainterMascotProps> = ({
  className = "",
  width = 130,
  height = 130,
}) => {
  return (
    <div
      className={`inline-block filter drop-shadow-md select-none pointer-events-none ${className}`}
      style={{ width, height }}
      aria-label="Painter Mascot"
    >
      <svg
        viewBox="0 0 130 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <radialGradient
            id="painterShadow"
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

        {/* Ground shadow beneath easel and painter */}
        <ellipse cx="65" cy="120" rx="55" ry="7" fill="url(#painterShadow)" />

        {/* --- EASEL & CANVAS (Left Side) --- */}
        {/* Easel Wooden Legs (Back & Front) */}
        <line x1="32" y1="42" x2="16" y2="120" stroke="#C28448" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="32" y1="42" x2="48" y2="120" stroke="#B07138" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="32" y1="42" x2="32" y2="122" stroke="#9A5D2A" strokeWidth="3.5" strokeLinecap="round" />

        {/* Easel Wooden Shelf Bar */}
        <rect x="12" y="86" width="40" height="5.5" rx="2" fill="#E8A86B" stroke="#9A5D2A" strokeWidth="1.5" />

        {/* White Canvas */}
        <rect
          x="14"
          y="46"
          width="36"
          height="42"
          rx="4"
          fill="#FFFFFF"
          stroke="#E5E5E5"
          strokeWidth="2.5"
        />

        {/* Painting Artwork on Canvas (Colorful strokes: Red, Blue, Gold) */}
        <path
          d="M 22 58 Q 30 52 38 60 Q 42 64 42 70"
          stroke="#FF4B4B"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 20 74 Q 28 66 36 76"
          stroke="#1CB0F6"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="36" cy="56" r="3.5" fill="#FFC800" />

        {/* Fresh paint dab on canvas */}
        <circle cx="28" cy="80" r="2.5" fill="#58CC02" />

        {/* --- PAINTER CHARACTER (Right Side, with subtle bobbing animation) --- */}
        <g className="animate-painter-body">
          {/* Feet */}
          <ellipse cx="78" cy="116" rx="9" ry="5.5" fill="#58CC02" stroke="#46A302" strokeWidth="2" />
          <ellipse cx="98" cy="116" rx="9" ry="5.5" fill="#58CC02" stroke="#46A302" strokeWidth="2" />

          {/* Chunky Violet/Blue Smock Body */}
          <path
            d="M 70 68 C 70 56, 106 56, 106 68 C 106 96, 102 114, 88 114 C 74 114, 70 96, 70 68 Z"
            fill="#1CB0F6"
            stroke="#1899D6"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Smock Apron Pocket */}
          <path
            d="M 80 88 C 80 88, 80 98, 88 98 C 96 98, 96 88, 96 88 Z"
            fill="#1899D6"
            stroke="#137BAE"
            strokeWidth="2"
          />
          {/* Paint splatters on Apron */}
          <circle cx="78" cy="80" r="2.5" fill="#FF4B4B" />
          <circle cx="98" cy="84" r="2" fill="#FFC800" />
          <circle cx="86" cy="94" r="1.8" fill="#58CC02" />

          {/* Head (Chunky round happy character) */}
          <circle
            cx="88"
            cy="50"
            r="19"
            fill="#FFD2B2"
            stroke="#E8A982"
            strokeWidth="2.5"
          />

          {/* Cheeky French Painter Beret (Bright Red #FF4B4B) */}
          <path
            d="M 72 40 C 70 26, 106 22, 106 38 C 106 43, 90 44, 72 40 Z"
            fill="#FF4B4B"
            stroke="#EA2B2B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Beret little stalk on top */}
          <line x1="88" y1="26" x2="88" y2="21" stroke="#EA2B2B" strokeWidth="3" strokeLinecap="round" />

          {/* Cute Tuft of hair sticking out */}
          <path
            d="M 74 38 Q 70 44 72 47"
            stroke="#8E4924"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 102 38 Q 105 44 103 47"
            stroke="#8E4924"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Cheerful Eyes (Smiling curved arcs) */}
          <path
            d="M 79 48 Q 83 44 87 48"
            stroke="#4B4B4B"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 91 48 Q 95 44 99 48"
            stroke="#4B4B4B"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="77" cy="53" rx="3.5" ry="2.2" fill="#FF86A5" opacity="0.7" />
          <ellipse cx="101" cy="53" rx="3.5" ry="2.2" fill="#FF86A5" opacity="0.7" />

          {/* Happy Open Smile */}
          <path
            d="M 85 54 Q 89 59 93 54"
            stroke="#4B4B4B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Arm holding Painter's Wooden Palette */}
          <ellipse
            cx="102"
            cy="76"
            rx="7"
            ry="11"
            transform="rotate(20 102 76)"
            fill="#1CB0F6"
            stroke="#1899D6"
            strokeWidth="2.5"
          />

          {/* Wooden Palette */}
          <ellipse
            cx="108"
            cy="84"
            rx="14"
            ry="10"
            fill="#E8A86B"
            stroke="#9A5D2A"
            strokeWidth="2"
          />
          {/* Palette Thumb Hole */}
          <circle cx="102" cy="85" r="2.5" fill="#FFD2B2" stroke="#9A5D2A" strokeWidth="1" />
          {/* Paint dots on palette */}
          <circle cx="112" cy="78" r="2.5" fill="#FF4B4B" />
          <circle cx="117" cy="83" r="2.5" fill="#FFC800" />
          <circle cx="114" cy="89" r="2.5" fill="#58CC02" />
          <circle cx="108" cy="91" r="2.5" fill="#8E44AD" />

          {/* --- RIGHT ARM & BRUSH (With dynamic sweeping animation reaching for canvas) --- */}
          <g className="animate-painter-sweep">
            {/* Painter's Right Arm */}
            <path
              d="M 75 70 C 65 70, 52 64, 46 62"
              stroke="#1CB0F6"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx="44" cy="62" r="5" fill="#FFD2B2" stroke="#E8A982" strokeWidth="1.5" />

            {/* Paintbrush Handle */}
            <line x1="48" y1="64" x2="33" y2="58" stroke="#8E4924" strokeWidth="3" strokeLinecap="round" />
            {/* Ferrule (Metal band) */}
            <line x1="35" y1="58.8" x2="31" y2="57.2" stroke="#AFAFAF" strokeWidth="4" strokeLinecap="round" />
            {/* Brush Bristles with Red Paint Tip */}
            <path
              d="M 31 57 L 25 54.5 C 24 54, 25 57, 28 59 Z"
              fill="#FF4B4B"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
export default PainterMascot;
