import React from "react";

/**
 * 1. Learn: A flat, 2D birdhouse. It has a yellow square body,
 * a distinct red triangular roof, and a small dark circular hole in the center.
 */
export const LearnNavIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Yellow square body */}
    <rect x="7" y="14" width="22" height="18" rx="2.5" fill="#FFC800" />

    {/* Distinct red triangular roof with subtle eaves */}
    <path
      d="M18 3L3 15.5H33L18 3Z"
      fill="#FF4B4B"
    />

    {/* Small dark circular hole in the center */}
    <circle cx="18" cy="22.5" r="3.5" fill="#2B2B2B" />
  </svg>
);

/**
 * 2. Leaderboards: A flat, yellow/gold shield shape. Add a lighter yellow diagonal
 * polygon across the top-left half to create a two-tone, shiny highlight effect.
 */
export const LeaderboardsNavIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <clipPath id="shield-clip-highlight">
        <path d="M7 4H29V17C29 25 21 30.5 18 32.5C15 30.5 7 25 7 17V4Z" />
      </clipPath>
    </defs>

    {/* Flat yellow/gold shield base */}
    <path
      d="M7 4H29V17C29 25 21 30.5 18 32.5C15 30.5 7 25 7 17V4Z"
      fill="#FFC800"
    />

    {/* Lighter yellow diagonal polygon across top-left half for two-tone shiny highlight */}
    <path
      d="M7 4H24L7 21V4Z"
      fill="#FFF066"
      clipPath="url(#shield-clip-highlight)"
    />
  </svg>
);

/**
 * 3. Quests: A flat, golden treasure chest. Use a lighter gold for the main body,
 * darker yellow/orange for the trim/borders, and include a darker central keyhole block.
 */
export const QuestsNavIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Chest Lid / dome - lighter gold */}
    <path
      d="M5 14C5 8.5 10.5 5.5 18 5.5C25.5 5.5 31 8.5 31 14H5Z"
      fill="#FFD900"
    />

    {/* Chest Main Body - lighter gold */}
    <rect x="5" y="14" width="26" height="16" rx="2" fill="#FFD900" />

    {/* Darker yellow/orange trim/borders */}
    {/* Horizontal divider rim */}
    <rect x="3.5" y="12.5" width="29" height="3.5" rx="1.5" fill="#E59400" />
    {/* Left border band */}
    <path
      d="M5 14H8.5V30H5C4.2 30 3.5 29.3 3.5 28.5V15C3.5 14.4 4.1 14 5 14Z"
      fill="#E59400"
    />
    {/* Right border band */}
    <path
      d="M27.5 14H31C31.9 14 32.5 14.4 32.5 15V28.5C32.5 29.3 31.8 30 31 30H27.5V14Z"
      fill="#E59400"
    />
    {/* Lid arch side accents */}
    <path
      d="M5 14C5 9.5 8 7 10 6.5L10.5 12.5H5V14Z"
      fill="#E59400"
    />
    <path
      d="M31 14C31 9.5 28 7 26 6.5L25.5 12.5H31V14Z"
      fill="#E59400"
    />

    {/* Darker central keyhole block */}
    <rect x="15" y="12" width="6" height="7.5" rx="1.5" fill="#4A3423" />
    {/* Keyhole dot & slot */}
    <circle cx="18" cy="14.8" r="1" fill="#FFD900" />
    <rect x="17.4" y="15.5" width="1.2" height="2" rx="0.3" fill="#FFD900" />
  </svg>
);

/**
 * 4. Shop: A flat, 2D storefront icon. It features a brown rectangular building base,
 * two light blue square windows at the bottom, and a prominent red-and-white striped awning across the top.
 */
export const ShopNavIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Brown rectangular building base */}
    <rect x="5" y="14" width="26" height="17" rx="2" fill="#8B5A2B" />

    {/* Two light blue square windows at the bottom */}
    <rect x="8" y="19" width="7" height="7" rx="1.5" fill="#84D8FF" />
    <rect x="21" y="19" width="7" height="7" rx="1.5" fill="#84D8FF" />

    {/* Prominent red-and-white striped awning across the top */}
    {/* Stripe 1 (Red) */}
    <path
      d="M3 7H8V14.5C8 15.8 6.8 16.8 5.5 16.8C4.2 16.8 3 15.8 3 14.5V7Z"
      fill="#FF4B4B"
    />
    {/* Stripe 2 (White) */}
    <path
      d="M8 7H13V14.5C13 15.8 11.8 16.8 10.5 16.8C9.2 16.8 8 15.8 8 14.5V7Z"
      fill="#FFFFFF"
    />
    {/* Stripe 3 (Red) */}
    <path
      d="M13 7H18V14.5C18 15.8 16.8 16.8 15.5 16.8C14.2 16.8 13 15.8 13 14.5V7Z"
      fill="#FF4B4B"
    />
    {/* Stripe 4 (White) */}
    <path
      d="M18 7H23V14.5C23 15.8 21.8 16.8 20.5 16.8C19.2 16.8 18 15.8 18 14.5V7Z"
      fill="#FFFFFF"
    />
    {/* Stripe 5 (Red) */}
    <path
      d="M23 7H28V14.5C28 15.8 26.8 16.8 25.5 16.8C24.2 16.8 23 15.8 23 14.5V7Z"
      fill="#FF4B4B"
    />
    {/* Stripe 6 (White) */}
    <path
      d="M28 7H33V14.5C33 15.8 31.8 16.8 30.5 16.8C29.2 16.8 28 15.8 28 14.5V7Z"
      fill="#FFFFFF"
    />
    {/* Awning top bar */}
    <rect x="2.5" y="6" width="31" height="2.5" rx="1" fill="#E53935" />
  </svg>
);

/**
 * 5. Profile: A circular icon made of a dashed gray border,
 * with a green owl mascot centered inside.
 */
export const ProfileNavIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Circular dashed gray border */}
    <circle
      cx="18"
      cy="18"
      r="16"
      stroke="#AFAFAF"
      strokeWidth="2"
      strokeDasharray="3.5 3.5"
      fill="none"
    />

    {/* Green owl mascot centered inside */}
    {/* Owl ears */}
    <path d="M10.5 11.5C11.5 8.5 14 9.5 14 11.5Z" fill="#58CC02" />
    <path d="M25.5 11.5C24.5 8.5 22 9.5 22 11.5Z" fill="#58CC02" />

    {/* Owl rounded body */}
    <ellipse cx="18" cy="19" rx="10" ry="10.5" fill="#58CC02" />

    {/* White eye rings */}
    <ellipse cx="14.5" cy="17.5" rx="3.5" ry="4" fill="#FFFFFF" />
    <ellipse cx="21.5" cy="17.5" rx="3.5" ry="4" fill="#FFFFFF" />

    {/* Pupils */}
    <circle cx="15.5" cy="17.5" r="1.8" fill="#3C3C3C" />
    <circle cx="20.5" cy="17.5" r="1.8" fill="#3C3C3C" />

    {/* Eye gleam highlights */}
    <circle cx="16" cy="16.7" r="0.6" fill="#FFFFFF" />
    <circle cx="21" cy="16.7" r="0.6" fill="#FFFFFF" />

    {/* Orange beak */}
    <path d="M16 20.5H20L18 23.2Z" fill="#FF9600" />
  </svg>
);

/**
 * 6. Settings: A solid, bright purple circular background
 * with three white, horizontally aligned dots (...) in the absolute center.
 */
export const SettingsNavIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Solid, bright purple circular background */}
    <circle cx="18" cy="18" r="16" fill="#B86BFF" />

    {/* Three white horizontally aligned dots in the absolute center */}
    <circle cx="11.5" cy="18" r="2.2" fill="#FFFFFF" />
    <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />
    <circle cx="24.5" cy="18" r="2.2" fill="#FFFFFF" />
  </svg>
);
