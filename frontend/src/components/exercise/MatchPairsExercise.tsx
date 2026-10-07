"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { Check, Heart, X } from "lucide-react";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { speakGerman } from "@/lib/tts";

export interface PairItem {
  id: number;
  german: string;
  english: string;
}

export interface MatchPairsExerciseData {
  id: number;
  type: string;
  prompt: string;
  answer_data: {
    pairs: PairItem[];
  };
}

export interface MatchPairsExerciseProps {
  exercise: MatchPairsExerciseData;
  progressPercent?: number;
  targetProgressPercent?: number;
  isReview?: boolean;
  canSkip?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  onExit?: () => void;
}

interface CardItem {
  cardId: string;
  pairId: number;
  text: string;
  lang: "german" | "english";
}

export const MatchPairsExercise: React.FC<MatchPairsExerciseProps> = ({
  exercise,
  progressPercent = 60,
  targetProgressPercent = 80,
  isReview = false,
  canSkip = true,
  onComplete,
  onSkip,
  onExit,
}) => {
  const { hearts, decrementHearts, addXp } = useUserStore();

  // Left column (German) and Right column (English)
  const [leftCards, setLeftCards] = useState<CardItem[]>([]);
  const [rightCards, setRightCards] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [matchedCardIds, setMatchedCardIds] = useState<string[]>([]);
  const [flashingSuccessIds, setFlashingSuccessIds] = useState<string[]>([]);
  const [flashingErrorIds, setFlashingErrorIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(progressPercent);

  // Split pairs: German always in left column, English always in right column
  useEffect(() => {
    const leftList: CardItem[] = [];
    const rightList: CardItem[] = [];

    exercise.answer_data.pairs.forEach((pair) => {
      leftList.push({
        cardId: `pair-${pair.id}-de`,
        pairId: pair.id,
        text: pair.german,
        lang: "german",
      });
      rightList.push({
        cardId: `pair-${pair.id}-en`,
        pairId: pair.id,
        text: pair.english,
        lang: "english",
      });
    });

    // Shuffle left list independently
    for (let i = leftList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [leftList[i], leftList[j]] = [leftList[j], leftList[i]];
    }

    // Shuffle right list independently
    for (let i = rightList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rightList[i], rightList[j]] = [rightList[j], rightList[i]];
    }

    setLeftCards(leftList);
    setRightCards(rightList);
  }, [exercise]);

  // Handle card click
  const handleCardClick = (card: CardItem) => {
    if (isProcessing || hearts <= 0) return;
    if (matchedCardIds.includes(card.cardId)) return;

    // Speak German word upon tapping
    if (card.lang === "german") {
      speakGerman(card.text);
    }

    if (selectedCard && selectedCard.cardId === card.cardId) {
      // Toggle off if clicking the already selected card
      setSelectedCard(null);
      return;
    }

    // First click: select the card
    if (!selectedCard) {
      setSelectedCard(card);
      return;
    }

    // Second click: attempt to match with selectedCard
    const firstCard = selectedCard;
    const secondCard = card;

    if (firstCard.pairId === secondCard.pairId) {
      // Match found!
      setIsProcessing(true);
      setFlashingSuccessIds([firstCard.cardId, secondCard.cardId]);

      setTimeout(() => {
        const nextMatched = [...matchedCardIds, firstCard.cardId, secondCard.cardId];
        setMatchedCardIds(nextMatched);
        setFlashingSuccessIds([]);
        setSelectedCard(null);
        setIsProcessing(false);

        // Check if all cards matched
        const totalCards = leftCards.length + rightCards.length;
        if (nextMatched.length === totalCards && totalCards > 0) {
          setIsCompleted(true);
          setProgress(targetProgressPercent);
          addXp(15);
        }
      }, 500);
    } else {
      // Incorrect match!
      setIsProcessing(true);
      setFlashingErrorIds([firstCard.cardId, secondCard.cardId]);
      decrementHearts();

      setTimeout(() => {
        setFlashingErrorIds([]);
        setSelectedCard(null);
        setIsProcessing(false);
      }, 700);
    }
  };

  const handleSkip = () => {
    if (isCompleted || isSkipped) return;
    setIsSkipped(true);
    setProgress((prev) => Math.min(100, prev + 5));
  };

  const handleContinue = () => {
    if (isCompleted) {
      if (onComplete) {
        onComplete();
      }
    } else if (isSkipped) {
      if (onSkip) {
        onSkip();
      } else if (onComplete) {
        onComplete();
      }
    }
  };

  const renderCardButton = (card: CardItem) => {
    const isMatched = matchedCardIds.includes(card.cardId);
    const isSelected = selectedCard?.cardId === card.cardId;
    const isFlashingSuccess = flashingSuccessIds.includes(card.cardId);
    const isFlashingError = flashingErrorIds.includes(card.cardId);

    // Determine styling based on match states
    let cardStyle =
      "bg-white dark:bg-[#202F36] text-[#4B4B4B] dark:text-[#E5E5E5] border-2 border-[#e5e5e5] dark:border-[#37464F] border-b-4 border-b-[#e5e5e5] dark:border-b-[#263740] hover:bg-gray-50 dark:hover:bg-[#2B3E48] active:translate-y-1 active:border-b-2";

    if (isMatched) {
      cardStyle =
        "bg-[#f7f7f7] dark:bg-[#18272E] text-[#afafaf] dark:text-[#58646D] border-2 border-[#e5e5e5] dark:border-[#263E4B] border-b-2 border-b-[#e5e5e5] dark:border-b-[#263E4B] opacity-50 cursor-not-allowed";
    } else if (isFlashingSuccess) {
      cardStyle =
        "bg-[#d7ffb8] dark:bg-[#1A3826] text-[#58CC02] border-2 border-[#58CC02] border-b-4 border-b-[#46a302] scale-105";
    } else if (isFlashingError) {
      cardStyle =
        "bg-[#ffdfe0] dark:bg-[#3D1E24] text-[#FF4B4B] border-2 border-[#FF4B4B] border-b-4 border-b-[#ea2b2b] animate-shake";
    } else if (isSelected) {
      cardStyle =
        "bg-[#ddf4ff] dark:bg-[#1A3442] text-[#1CB0F6] border-2 border-[#1CB0F6] border-b-4 border-b-[#1CB0F6]";
    }

    return (
      <button
        key={card.cardId}
        onClick={() => handleCardClick(card)}
        disabled={isMatched || isProcessing}
        className={`w-full min-h-18 px-4 py-3 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center text-center transition-all duration-150 ease-out select-none cursor-pointer ${cardStyle}`}
      >
        {card.text}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] font-nunito select-none transition-colors">
      {/* Top Header with Progress Bar & Hearts */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 pt-6 pb-4 flex items-center gap-4 sm:gap-6">
        {/* Close Button */}
        <button
          onClick={onExit}
          className="text-[#afafaf] hover:text-[#4b4b4b] dark:hover:text-white p-1.5 transition-colors cursor-pointer"
          title="Exit lesson"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-4 bg-[#e5e5e5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 font-black text-[#FF4B4B]">
          <Heart className="w-6 h-6 fill-[#FF4B4B]" />
          <span className="text-lg">{hearts}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Prompt */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4B4B4B] dark:text-white mb-8">
          {isReview && <span className="text-[#1CB0F6]">Give it a try: </span>}
          {exercise.prompt}
        </h1>

        {/* 2 Distinct Columns: Left (German) vs Right (English) */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6 my-auto">
          {/* Left Column (German Words) */}
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {leftCards.map((card) => renderCardButton(card))}
          </div>

          {/* Right Column (English Words) */}
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {rightCards.map((card) => renderCardButton(card))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Footer */}
      <footer
        className={`w-full border-t-2 transition-all duration-300 ease-out py-5 px-6 sm:px-12 ${
          isCompleted
            ? "bg-[#d7ffb8] dark:bg-[#1A3826] border-[#bcf096] dark:border-[#285734]"
            : isSkipped
            ? "bg-[#ffdfe0] dark:bg-[#3D1E24] border-[#f8bcc0] dark:border-[#5C262C]"
            : "bg-white dark:bg-[#131F24] border-[#e5e5e5] dark:border-[#263E4B]"
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Banner Status message */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {isCompleted && (
              <div className="flex items-center gap-3 animate-bounce">
                <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center text-white shadow">
                  <Check className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#58CC02]">All pairs matched!</h3>
                  <p className="text-xs font-bold text-[#46a302] dark:text-[#58CC02]">
                    +15 XP earned • Great memory
                  </p>
                </div>
              </div>
            )}

            {isSkipped && (
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow flex-shrink-0 mt-0.5">
                  <X className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#FF4B4B]">Correct solution:</h3>
                  <p className="text-sm font-extrabold text-[#ea2b2b] dark:text-[#FF6B6B]">
                    {exercise.answer_data.pairs
                      .map((p) => `${p.german} = ${p.english}`)
                      .join(" • ")}
                  </p>
                </div>
              </div>
            )}

            {!isCompleted && !isSkipped && (
              <div className="hidden sm:block text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                Tap a word in German and its matching English translation
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full sm:w-auto flex items-center gap-3 justify-end">
            {!isCompleted && !isSkipped ? (
              <>
                <button
                  type="button"
                  disabled={!canSkip}
                  onClick={canSkip ? handleSkip : undefined}
                  className={`px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                    !canSkip
                      ? "text-gray-300 dark:text-[#3B4D54] cursor-not-allowed opacity-40 select-none"
                      : "text-[#afafaf] dark:text-[#8FA2AC] hover:text-[#777777] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#202F36] cursor-pointer"
                  }`}
                  title={!canSkip ? "Questions cannot be skipped again" : undefined}
                >
                  Skip
                </button>
                <button
                  disabled
                  className="w-full sm:w-48 py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-base bg-[#e5e5e5] text-[#afafaf] border-b-4 border-b-[#d5d5d5] cursor-not-allowed select-none"
                >
                  Check
                </button>
              </>
            ) : isCompleted ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-48 font-black tracking-widest bg-[#58CC02] border-[#46a302]"
                onClick={handleContinue}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-48 font-black tracking-widest bg-[#FF4B4B] hover:bg-[#ea2b2b] border-[#ea2b2b]"
                onClick={handleContinue}
              >
                Got it
              </Button>
            )}
          </div>
        </div>
      </footer>

      {/* Out of Hearts Modal */}
      <OutOfHeartsModal isOpen={hearts <= 0} />
    </div>
  );
};
