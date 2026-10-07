"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";

export interface GemsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  gemsCount: number;
}

export const GemsPopover: React.FC<GemsPopoverProps> = ({
  isOpen,
  onClose,
  gemsCount,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-14 sm:top-16 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-80 sm:w-88 rounded-3xl bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] shadow-2xl border-2 border-[#E5E5E5] dark:border-[#263E4B] p-6 select-none font-nunito animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top pointer arrow pointing right under the gems cluster */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#E5E5E5] dark:border-b-[#263E4B]" />
      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-white dark:border-b-[#131F24]" />

      <div className="flex items-center gap-5">
        {/* Golden Chest Full of Blue Glowing Gems Graphic from screenshot */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 90"
            className="w-full h-full filter drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Open Chest Lid (Dark wood exterior, golden rims) */}
            <path
              d="M16 12C16 9 20 6 24 6H76C80 6 84 9 84 12V34H16V12Z"
              fill="#964B00"
            />
            {/* Golden Lid Border Band */}
            <rect x="14" y="4" width="72" height="6" rx="2" fill="#FFC800" />
            <rect x="14" y="30" width="72" height="4" fill="#FFC800" />

            {/* Glowing Blue Gems Piling Out of Chest */}
            {/* Back gem */}
            <polygon points="32,24 44,14 56,22 48,34 32,32" fill="#1CB0F6" />
            <polygon points="44,14 56,22 48,26 40,22" fill="#72D4FF" />

            {/* Middle right gem */}
            <polygon points="52,26 66,16 78,24 72,36 56,36" fill="#009BE5" />
            <polygon points="66,16 78,24 68,26 60,20" fill="#58CC02" opacity="0.1" />
            <polygon points="66,16 78,24 70,26 62,22" fill="#72D4FF" />

            {/* Front prominent hexagonal gem */}
            <polygon points="26,30 42,20 54,32 46,46 28,44" fill="#00A7F5" />
            <polygon points="42,20 54,32 44,34 34,26" fill="#A8E8FF" />
            <polygon points="28,44 46,46 38,36" fill="#007EBA" />

            {/* Right front gem */}
            <polygon points="48,32 64,22 76,32 66,46 50,44" fill="#1CB0F6" />
            <polygon points="64,22 76,32 66,34 56,28" fill="#BDEEFF" />

            {/* Chest Body (Rich golden/wood box) */}
            <rect x="14" y="34" width="72" height="44" rx="4" fill="#A0522D" />
            {/* Golden Horizontal and Vertical Bands */}
            <rect x="14" y="34" width="72" height="6" fill="#FFC800" />
            <rect x="14" y="68" width="72" height="10" rx="3" fill="#FFC800" />
            <rect x="14" y="34" width="10" height="44" fill="#FFC800" />
            <rect x="76" y="34" width="10" height="44" fill="#FFC800" />

            {/* Golden Chest Lock Plate */}
            <rect x="42" y="38" width="16" height="20" rx="3" fill="#FFC800" stroke="#E5A800" strokeWidth="2" />
            {/* Keyhole */}
            <circle cx="50" cy="45" r="2.5" fill="#5C2E00" />
            <polygon points="49,45 51,45 52,53 48,53" fill="#5C2E00" />

            {/* Rivet dots */}
            <circle cx="19" cy="40" r="1.5" fill="#E5A800" />
            <circle cx="19" cy="72" r="1.5" fill="#E5A800" />
            <circle cx="81" cy="40" r="1.5" fill="#E5A800" />
            <circle cx="81" cy="72" r="1.5" fill="#E5A800" />
          </svg>
        </div>

        {/* Text and Action */}
        <div className="flex flex-col items-start text-left flex-1">
          <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B] dark:text-white leading-tight mb-1">
            Gems
          </h3>
          <p className="text-sm font-bold text-[#777777] dark:text-[#93A4AC] mb-3">
            You have {gemsCount} gems
          </p>
          <Link
            href="/shop"
            onClick={onClose}
            className="font-black text-sm uppercase tracking-wider text-[#1CB0F6] hover:text-[#1899D6] transition-colors cursor-pointer select-none"
          >
            GO TO SHOP
          </Link>
        </div>
      </div>
    </div>
  );
};
