"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export interface ExitConfirmationModalProps {
  isOpen: boolean;
  onKeepLearning: () => void;
  onEndSession: () => void;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isOpen,
  onKeepLearning,
  onEndSession,
}) => {
  // Close on Esc key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onKeepLearning();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onKeepLearning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none font-nunito animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div className="bg-[#131F24] text-white rounded-3xl max-w-sm w-full p-8 text-center border-2 border-[#202F36] shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-150">
        {/* Crying Duo Owl SVG Mascot matching the user's screenshot */}
        <div className="w-32 h-32 mb-6 relative flex items-center justify-center">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-md"
          >
            {/* Soft Shadow base */}
            <ellipse cx="60" cy="108" rx="36" ry="5" fill="#0A1014" opacity="0.6" />

            {/* Owl Body (Green rounded shape) */}
            <path
              d="M 28 46 C 28 20, 92 20, 92 46 C 92 78, 86 102, 60 102 C 34 102, 28 78, 28 46 Z"
              fill="#58CC02"
            />

            {/* Ear Tufts */}
            <path
              d="M 32 26 C 26 16, 26 8, 38 16 C 36 22, 34 25, 32 26 Z"
              fill="#46A302"
            />
            <path
              d="M 88 26 C 94 16, 94 8, 82 16 C 84 22, 86 25, 88 26 Z"
              fill="#46A302"
            />

            {/* Light Green Tummy patch */}
            <path
              d="M 40 70 C 40 60, 80 60, 80 70 C 80 94, 74 100, 60 100 C 46 100, 40 94, 40 70 Z"
              fill="#8EE000"
            />

            {/* Belly feathers chevrons */}
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

            {/* Paws / Feet (Orange) */}
            <path
              d="M 44 98 C 44 106, 32 107, 30 107 C 28 107, 27 105, 29 101 C 31 96, 38 95, 44 98 Z"
              fill="#FF9600"
            />
            <path
              d="M 76 98 C 76 106, 88 107, 90 107 C 92 107, 93 105, 91 101 C 89 96, 82 95, 76 98 Z"
              fill="#FF9600"
            />

            {/* Big Sad / Pouting Crying Eyes */}
            {/* Eye Sockets (White Pill Ovals) */}
            <ellipse cx="44" cy="46" rx="14" ry="16" fill="#FFFFFF" />
            <ellipse cx="76" cy="46" rx="14" ry="16" fill="#FFFFFF" />

            {/* Big Pupil circles looking up with sadness */}
            <ellipse cx="45" cy="45" rx="10" ry="11" fill="#202F36" />
            <ellipse cx="75" cy="45" rx="10" ry="11" fill="#202F36" />

            {/* Sparkles / Highlights in eyes */}
            <circle cx="48" cy="41" r="4" fill="#FFFFFF" />
            <circle cx="42" cy="49" r="2" fill="#FFFFFF" />
            <circle cx="78" cy="41" r="4" fill="#FFFFFF" />
            <circle cx="72" cy="49" r="2" fill="#FFFFFF" />

            {/* Teardrops pooled under eyes (Blue glossy tears) */}
            <path
              d="M 35 48 C 35 48, 38 58, 45 58 C 52 58, 55 48, 55 48 C 53 54, 49 57, 45 57 C 41 57, 37 54, 35 48 Z"
              fill="#1CB0F6"
            />
            <ellipse cx="45" cy="55" rx="7" ry="3.5" fill="#58CCFF" />

            <path
              d="M 65 48 C 65 48, 68 58, 75 58 C 82 58, 85 48, 85 48 C 83 54, 79 57, 75 57 C 71 57, 67 54, 65 48 Z"
              fill="#1CB0F6"
            />
            <ellipse cx="75" cy="55" rx="7" ry="3.5" fill="#58CCFF" />

            {/* Sad downturned beak (Orange) */}
            <path
              d="M 53 52 C 53 50, 67 50, 67 52 C 67 61, 60 65, 60 65 C 60 65, 53 61, 53 52 Z"
              fill="#FF9600"
            />
            <path
              d="M 55 53 C 57 51, 63 51, 65 53 C 64 57, 56 57, 55 53 Z"
              fill="#FFB84D"
            />
          </svg>
        </div>

        {/* Heading text matching screenshot */}
        <h2 className="text-2xl font-black text-white mb-2 leading-tight">
          Wait, don’t go! You’ll lose your progress if you quit now
        </h2>

        <div className="w-full flex flex-col gap-3 mt-6">
          {/* KEEP LEARNING (Blue prominent button) */}
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onKeepLearning}
            className="font-black uppercase tracking-widest text-base py-4 bg-[#1CB0F6] hover:bg-[#1899d6] border-[#1899d6] text-white shadow-md active:translate-y-1"
          >
            KEEP LEARNING
          </Button>

          {/* END SESSION (Red text button) */}
          <button
            type="button"
            onClick={onEndSession}
            className="w-full py-3 text-base font-black uppercase tracking-widest text-[#FF4B4B] hover:text-[#ea2b2b] transition-colors cursor-pointer select-none active:opacity-80"
          >
            END SESSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;
