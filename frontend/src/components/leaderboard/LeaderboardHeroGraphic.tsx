import React from "react";

export interface LeaderboardHeroGraphicProps {
  className?: string;
}

/**
 * Custom 3-Badge Illustration (Leaderboard Hero Graphic)
 * ViewBox: 0 0 120 80
 *
 * Layering:
 * - Ribbon tails (bottom)
 * - Left Medal: 3rd Place - Bronze (#CA7900)
 * - Right Medal: 2nd Place - Silver (#AFAFAF)
 * - Middle Medal: 1st Place - Gold (#FFC800) in center, largest & in front
 * - Glossy highlight & 4-point sparkles
 */
export const LeaderboardHeroGraphic: React.FC<LeaderboardHeroGraphicProps> = ({
  className = "w-44 sm:w-52 h-auto",
}) => {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Leaderboard top 3 medals"
    >
      <defs>
        {/* Clip for Gold Badge Glossy Highlight */}
        <clipPath id="gold-medal-clip">
          <circle cx="60" cy="36" r="23" />
        </clipPath>
        {/* Clip for Silver Badge Glossy Highlight */}
        <clipPath id="silver-medal-clip">
          <circle cx="88" cy="40" r="18" />
        </clipPath>
      </defs>

      {/* ================= RIBBON TAILS (BACK) ================= */}
      {/* 3rd Place (Bronze) Ribbon Tails */}
      <g>
        {/* Left ribbon tail */}
        <path
          d="M26 50L20 68L27 64L32 68L29 50Z"
          fill="#9E5B00"
        />
        {/* Right ribbon tail */}
        <path
          d="M33 50L30 69L37 65L43 69L39 50Z"
          fill="#B56B00"
        />
      </g>

      {/* 2nd Place (Silver) Ribbon Tails */}
      <g>
        {/* Left ribbon tail */}
        <path
          d="M81 48L77 67L84 63L90 67L87 48Z"
          fill="#7E8E96"
        />
        {/* Right ribbon tail */}
        <path
          d="M88 48L85 68L92 64L98 68L94 48Z"
          fill="#94A3AB"
        />
      </g>

      {/* 1st Place (Gold) Ribbon Tails */}
      <g>
        {/* Left gold/red ribbon tail */}
        <path
          d="M52 52L44 74L54 69L61 74L57 52Z"
          fill="#E53935"
        />
        {/* Right gold/red ribbon tail */}
        <path
          d="M60 52L59 75L68 70L76 75L68 52Z"
          fill="#FF5252"
        />
      </g>

      {/* ================= LEFT MEDAL: 3RD PLACE (BRONZE) ================= */}
      <g id="bronze-medal">
        {/* Outer Shadow Rim */}
        <circle cx="32" cy="41" r="18.5" fill="#8A4E00" />
        {/* Outer Bronze Base */}
        <circle cx="32" cy="40" r="18" fill="#CA7900" />
        {/* Inner Darker Bronze Ring */}
        <circle cx="32" cy="40" r="14" fill="#A85F00" />
        {/* Center Bronze Disc */}
        <circle cx="32" cy="40" r="11" fill="#CA7900" />
        {/* Number '3' */}
        <text
          x="32"
          y="45"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          3
        </text>
      </g>

      {/* ================= RIGHT MEDAL: 2ND PLACE (SILVER) ================= */}
      <g id="silver-medal">
        {/* Outer Shadow Rim */}
        <circle cx="88" cy="41" r="18.5" fill="#788891" />
        {/* Outer Silver Base */}
        <circle cx="88" cy="40" r="18" fill="#AFAFAF" />
        {/* Inner Darker Silver Ring */}
        <circle cx="88" cy="40" r="14" fill="#8F9EA6" />
        {/* Center Silver Disc */}
        <circle cx="88" cy="40" r="11" fill="#AFAFAF" />
        {/* Gloss highlight on silver */}
        <path
          d="M72 32C76 25 84 23 92 25C84 26 77 33 75 42Z"
          fill="#FFFFFF"
          opacity="0.3"
          clipPath="url(#silver-medal-clip)"
        />
        {/* Number '2' */}
        <text
          x="88"
          y="45"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          2
        </text>
      </g>

      {/* ================= MIDDLE MEDAL: 1ST PLACE (GOLD) ================= */}
      {/* (Rendered last so it sits in front of left and right medals) */}
      <g id="gold-medal">
        {/* Outer 3D Bottom Lip / Shadow Rim */}
        <circle cx="60" cy="37.5" r="23.5" fill="#D97706" />
        {/* Outer Golden Disc */}
        <circle cx="60" cy="36" r="23" fill="#FFC800" />
        {/* Darker Orange Inner Ring */}
        <circle cx="60" cy="36" r="18" fill="#E59400" />
        {/* Core Gold Center */}
        <circle cx="60" cy="36" r="14.5" fill="#FFC800" />

        {/* Shiny / Glossy Effect: Semi-transparent white curve across top-left edge */}
        <path
          d="M40 24C45 16 56 14 68 16C54 18 44 28 42 42C39 36 38 29 40 24Z"
          fill="white"
          opacity="0.35"
          clipPath="url(#gold-medal-clip)"
        />

        {/* Star Icon or Number '1' in direct center */}
        <text
          x="60"
          y="42"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="17"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          filter="drop-shadow(0 1px 1px rgba(180, 100, 0, 0.4))"
        >
          1
        </text>
      </g>

      {/* ================= 4-POINT VECTOR SPARKLES (STARS) ================= */}
      {/* Sparkle 1: Top-Right of Gold Badge */}
      <path
        d="M78 17 Q78 22 83 22 Q78 22 78 27 Q78 22 73 22 Q78 22 78 17 Z"
        fill="#FFFFFF"
      />
      {/* Center dot for sparkle 1 */}
      <circle cx="78" cy="22" r="1" fill="#FFE57F" />

      {/* Sparkle 2: Top-Left of Gold Badge */}
      <path
        d="M42 15 Q42 19 46 19 Q42 19 42 23 Q42 19 38 19 Q42 19 42 15 Z"
        fill="#FFFFFF"
      />

      {/* Sparkle 3: Far-Right above Silver Badge */}
      <path
        d="M102 24 Q102 27 105 27 Q102 27 102 30 Q102 27 99 27 Q102 27 102 24 Z"
        fill="#FFFFFF"
      />

      {/* Sparkle 4: Lower Left near Bronze Badge */}
      <path
        d="M18 36 Q18 39 21 39 Q18 39 18 42 Q18 39 15 39 Q18 39 18 36 Z"
        fill="#FFE57F"
      />
    </svg>
  );
};
