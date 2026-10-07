"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { API_BASE_URL } from "@/config/api";

export interface HeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInLesson?: boolean;
}

export const HeartsModal: React.FC<HeartsModalProps> = ({
  isOpen,
  onClose,
  isInLesson = false,
}) => {
  const router = useRouter();
  const { hearts, refillHearts, setStats, gems, startHeartsCooldown } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isOutOfHearts = hearts === 0;
  // Requirement 2: button should be disabled if full hearts are more than 1 (i.e. hearts >= 2)
  const isRefillDisabled = hearts > 1 || gems < 350;

  const handleRefill = () => {
    if (gems < 350) {
      setErrorMessage("Not enough gems! (Requires 350 gems)");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    fetch(`${API_BASE_URL}/api/users/1/refill-hearts`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Refill API failed");
        return res.json();
      })
      .then((data) => {
        setStats({
          hearts: 5,
          gems: typeof data.gems === "number" ? data.gems : Math.max(0, gems - 350),
          heartsCooldownEndTime: null,
        });
        refillHearts();
        onClose();
      })
      .catch(() => {
        // Fallback local refill
        refillHearts();
        setStats({
          hearts: 5,
          gems: Math.max(0, gems - 350),
          heartsCooldownEndTime: null,
        });
        onClose();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleNoThanks = () => {
    if (isOutOfHearts) {
      startHeartsCooldown();
    }
    onClose();
    if (isInLesson && isOutOfHearts) {
      router.push("/learn");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn select-none font-nunito">
      <div className="bg-white dark:bg-[#131F24] rounded-3xl max-w-sm w-full p-6 text-center border-2 border-[#e5e5e5] dark:border-[#263E4B] text-[#4B4B4B] dark:text-[#E5E5E5] shadow-2xl animate-scaleUp flex flex-col items-center">
        {/* CASE A: User actually has 0 hearts (Out of Hearts Screen) */}
        {isOutOfHearts ? (
          <>
            {/* Crying/Broken Heart Mascot SVG */}
            <div className="w-28 h-28 mb-3 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
                <path
                  d="M50 88L18 54C8 44 8 26 22 16C36 6 46 14 50 22C54 14 64 6 78 16C92 26 92 44 82 54L50 88Z"
                  fill="#FF4B4B"
                />
                <path
                  d="M50 22L45 36L55 48L46 62L52 74L49 86"
                  stroke="#B32626"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M30 40Q35 34 40 40" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M60 40Q65 34 70 40" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path
                  d="M33 46C31 46 29 48 29 50C29 52 33 57 33 57C33 57 37 52 37 50C37 48 35 46 33 46Z"
                  fill="#1CB0F6"
                />
                <ellipse cx="50" cy="54" rx="4" ry="5" fill="#8A1313" />
              </svg>
            </div>

            <h2 className="text-2xl font-black text-[#4B4B4B] dark:text-white mb-2 leading-tight">
              You are out of hearts!
            </h2>
            <p className="text-sm font-bold text-[#777777] dark:text-[#93A4AC] mb-6">
              Refill your hearts now to continue learning, or wait 10 mins for them to recharge.
            </p>
          </>
        ) : (
          /* CASE B: User clicked Hearts icon while hearts > 0 (Requirement 2: Hearts status breakdown) */
          <>
            <h2 className="text-2xl font-black text-[#4B4B4B] dark:text-white mb-2 leading-tight">
              Hearts
            </h2>
            <p className="text-xs font-bold text-[#777777] dark:text-[#93A4AC] mb-6">
              You lose hearts by making mistakes. Keep practicing!
            </p>

            {/* Row of 5 Hearts: filled red vs broken */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((index) => {
                const isFilled = index <= hearts;

                return (
                  <div key={index} className="flex flex-col items-center">
                    {isFilled ? (
                      // Full Red Heart
                      <svg className="w-10 h-10 fill-[#FF4B4B] drop-shadow-sm transition-transform hover:scale-110" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      // Broken / Empty Heart
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-10 h-10 fill-[#e5e5e5]" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="absolute text-xs font-black text-gray-400">✕</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-xs font-black text-ink mb-4">
              {hearts === 5
                ? "You have full hearts!"
                : `${hearts} / 5 hearts remaining`}
            </div>
          </>
        )}

        {errorMessage && (
          <p className="text-xs font-extrabold text-[#FF4B4B] mb-3">
            {errorMessage}
          </p>
        )}

        {/* Refill Button (Disabled if hearts > 1 or gems < 350) */}
        <Button
          variant={isRefillDisabled ? "default" : "secondary"}
          size="lg"
          fullWidth
          disabled={isRefillDisabled || isSubmitting}
          onClick={handleRefill}
          className={`font-black tracking-wider text-base py-3.5 mb-2 shadow-sm ${
            isRefillDisabled
              ? "bg-[#e5e5e5] text-[#afafaf] border-b-4 border-b-[#cecece] cursor-not-allowed opacity-60"
              : "bg-[#1CB0F6] border-[#1899d6] text-white"
          }`}
        >
          {isSubmitting ? "Refilling..." : "Refill Hearts (350 Gems)"}
        </Button>

        {/* Secondary Button */}
        <button
          onClick={handleNoThanks}
          className="w-full py-2.5 text-sm font-extrabold text-[#afafaf] hover:text-[#4B4B4B] transition-colors uppercase tracking-widest cursor-pointer"
        >
          {isOutOfHearts ? "No thanks" : "Done"}
        </button>
      </div>
    </div>
  );
};
