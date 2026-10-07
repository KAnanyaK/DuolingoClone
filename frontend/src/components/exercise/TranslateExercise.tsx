"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { Check, X, Volume2, Sparkles, Heart } from "lucide-react";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { speakGerman } from "@/lib/tts";

export interface ExerciseData {
  id: number;
  type: string;
  prompt: string;
  question: string;
  answer_data: {
    correct_answer: string[];
    word_bank: string[];
  };
}

export interface TranslateExerciseProps {
  exercise: ExerciseData;
  progressPercent?: number;
  targetProgressPercent?: number;
  isReview?: boolean;
  canSkip?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  onExit?: () => void;
}

interface WordChipItem {
  id: string; // unique id per chip to handle duplicate words cleanly
  text: string;
  originalIndex: number;
}

export const TranslateExercise: React.FC<TranslateExerciseProps> = ({
  exercise,
  progressPercent = 0,
  targetProgressPercent = 20,
  isReview = false,
  canSkip = true,
  onComplete,
  onSkip,
  onExit,
}) => {
  const { hearts, decrementHearts, addXp } = useUserStore();

  // Initialize word bank with stable item IDs and original indices
  const [bankChips, setBankChips] = useState<WordChipItem[]>(() =>
    exercise.answer_data.word_bank.map((word, index) => ({
      id: `${word}-${index}`,
      text: word,
      originalIndex: index,
    }))
  );

  // User's selected chips placed in the answer zone
  const [selectedChips, setSelectedChips] = useState<WordChipItem[]>([]);

  // Validation status
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "skipped">("idle");
  const [progress, setProgress] = useState<number>(progressPercent);

  // Drag and drop state for answer zone reordering
  const [draggedChipIndex, setDraggedChipIndex] = useState<number | null>(null);

  // Handle clicking a chip in the word bank (moves it to answer zone)
  const handleSelectChip = (chip: WordChipItem) => {
    if (status !== "idle" || hearts <= 0) return;
    setBankChips((prev) => prev.filter((item) => item.id !== chip.id));
    setSelectedChips((prev) => [...prev, chip]);
  };

  // Handle clicking a chip in the answer zone (returns it to word bank)
  const handleUnselectChip = (chip: WordChipItem) => {
    if (status !== "idle") return;
    setSelectedChips((prev) => prev.filter((item) => item.id !== chip.id));
    setBankChips((prev) => {
      // Re-insert and sort back by originalIndex for consistent ordering
      const updated = [...prev, chip];
      return updated.sort((a, b) => a.originalIndex - b.originalIndex);
    });
  };

  // Native HTML5 Drag and Drop Handlers for reordering inside the answer zone
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (status !== "idle") return;
    setDraggedChipIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedChipIndex === null || draggedChipIndex === targetIndex || status !== "idle") {
      setDraggedChipIndex(null);
      return;
    }

    setSelectedChips((prev) => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedChipIndex, 1);
      copy.splice(targetIndex, 0, draggedItem);
      return copy;
    });
    setDraggedChipIndex(null);
  };

  // Check the answer
  const handleCheck = () => {
    if (selectedChips.length === 0) return;

    const userWords = selectedChips.map((c) => c.text);
    const correctWords = exercise.answer_data.correct_answer;

    const isMatch =
      userWords.length === correctWords.length &&
      userWords.every((word, idx) => word.toLowerCase() === correctWords[idx].toLowerCase());

    if (isMatch) {
      setStatus("correct");
      setProgress(targetProgressPercent);
      addXp(10);
    } else {
      setStatus("incorrect");
      decrementHearts();
    }
  };

  // Handle Skip action
  const handleSkip = () => {
    if (status !== "idle") return;
    setStatus("skipped");
    setProgress((prev) => Math.min(100, prev + 5)); // Progress increments by 5% on skip
  };

  // Reset or proceed on action button in banner
  const handleContinue = () => {
    if (status === "correct") {
      if (onComplete) {
        onComplete();
      } else {
        setStatus("idle");
      }
    } else if (status === "skipped") {
      if (onSkip) {
        onSkip();
      } else if (onComplete) {
        onComplete();
      }
    } else if (status === "incorrect") {
      setStatus("idle");
    }
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

        {/* Lesson Progress Bar */}
        <div className="flex-1 h-4 bg-[#e5e5e5] dark:bg-[#2B3E48] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Gloss highlight */}
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 font-black text-[#FF4B4B]">
          <Heart className="w-6 h-6 fill-[#FF4B4B]" />
          <span className="text-lg">{hearts}</span>
        </div>
      </div>

      {/* Main Exercise Content Area */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Exercise Prompt Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4B4B4B] dark:text-white mb-8">
          {isReview && <span className="text-[#1CB0F6]">Give it a try: </span>}
          {exercise.prompt}
        </h1>

        {/* Mascot & Target Text Bubble Row */}
        <div className="flex items-end gap-4 sm:gap-6 mb-10">
          {/* Duolingo Mascot SVG Placeholder */}
          <div className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 relative">
            <svg
              viewBox="0 0 100 120"
              className="w-full h-full drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Duo Owl Body */}
              <rect x="15" y="20" width="70" height="85" rx="35" fill="#58CC02" />
              {/* Belly */}
              <ellipse cx="50" cy="75" rx="22" ry="25" fill="#84D8FF" opacity="0.3" />
              {/* Eyes Outer */}
              <circle cx="36" cy="45" r="15" fill="white" />
              <circle cx="64" cy="45" r="15" fill="white" />
              {/* Pupils */}
              <circle cx="38" cy="45" r="7" fill="#4B4B4B" />
              <circle cx="62" cy="45" r="7" fill="#4B4B4B" />
              {/* Sparkle */}
              <circle cx="40" cy="43" r="2.5" fill="white" />
              <circle cx="64" cy="43" r="2.5" fill="white" />
              {/* Beak */}
              <polygon points="50,49 44,58 56,58" fill="#FF9600" />
              {/* Feet */}
              <ellipse cx="38" cy="106" rx="10" ry="4" fill="#FF9600" />
              <ellipse cx="62" cy="106" rx="10" ry="4" fill="#FF9600" />
            </svg>
          </div>

          {/* Speech Bubble */}
          <div className="relative bg-white dark:bg-[#18272E] border-2 border-[#e5e5e5] dark:border-[#263E4B] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3">
            {/* Speech bubble pointer / triangle */}
            <div className="absolute -left-2.5 bottom-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#e5e5e5] dark:border-r-[#263E4B]" />
            <div className="absolute -left-2 bottom-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-[#18272E]" />

            <button
              type="button"
              onClick={() => speakGerman(exercise.question)}
              className="text-[#1CB0F6] hover:scale-110 active:scale-95 transition-transform cursor-pointer p-1"
              title="Listen pronunciation"
              aria-label="Listen pronunciation"
            >
              <Volume2 className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-xl sm:text-2xl font-bold text-[#4B4B4B] dark:text-white">
              {exercise.question}
            </span>
          </div>
        </div>

        {/* Answer Zone with Solid Bottom Border */}
        <div className="min-h-24 border-b-2 border-[#e5e5e5] dark:border-[#263E4B] py-3 mb-10 flex flex-wrap gap-2.5 items-center">
          {selectedChips.length === 0 ? (
            <div className="text-[#afafaf] dark:text-[#6A7E88] font-bold text-sm italic select-none">
              Tap or drag words below to build your answer
            </div>
          ) : (
            selectedChips.map((chip, index) => (
              <div
                key={chip.id}
                draggable={status === "idle"}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`transition-transform ${
                  draggedChipIndex === index ? "opacity-50 scale-95" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleUnselectChip(chip)}
                  disabled={status !== "idle"}
                  className="btn-3d bg-white dark:bg-[#202F36] text-[#4B4B4B] dark:text-[#E5E5E5] font-bold text-base px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464F] border-b-4 border-b-[#e5e5e5] dark:border-b-[#263740] hover:bg-gray-50 dark:hover:bg-[#2B3E48] active:translate-y-1 active:border-b-0 cursor-grab active:cursor-grabbing transition-all shadow-sm"
                  title="Click to remove or drag to reorder"
                >
                  {chip.text}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Word Bank Area */}
        <div className="flex flex-wrap gap-2.5 justify-center items-center py-4">
          {exercise.answer_data.word_bank.map((word, index) => {
            const chipId = `${word}-${index}`;
            const isUsed = selectedChips.some((c) => c.id === chipId);

            return isUsed ? (
              // Empty placeholder slot when word is selected into answer zone
              <div
                key={chipId}
                className="bg-[#e5e5e5] dark:bg-[#202F36] rounded-2xl px-4 py-2.5 border-2 border-transparent h-12 min-w-16 opacity-50"
              />
            ) : (
              <button
                key={chipId}
                onClick={() =>
                  handleSelectChip({ id: chipId, text: word, originalIndex: index })
                }
                disabled={status !== "idle"}
                className="btn-3d bg-white dark:bg-[#202F36] text-[#4B4B4B] dark:text-[#E5E5E5] font-extrabold text-base px-4 py-2.5 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464F] border-b-4 border-b-[#e5e5e5] dark:border-b-[#263740] hover:bg-gray-50 dark:hover:bg-[#2B3E48] active:translate-y-1 active:border-b-0 cursor-pointer transition-all shadow-sm"
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Validation Footer / Banner */}
      <footer
        className={`w-full border-t-2 transition-all duration-300 ease-out py-5 px-6 sm:px-12 ${
          status === "idle"
            ? "bg-white dark:bg-[#131F24] border-[#e5e5e5] dark:border-[#263E4B]"
            : status === "correct"
            ? "bg-[#d7ffb8] dark:bg-[#1A3826] border-[#bcf096] dark:border-[#285734]"
            : "bg-[#ffdfe0] dark:bg-[#3D1E24] border-[#f8bcc0] dark:border-[#5C262C]"
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Banner Message Area */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {status === "correct" && (
              <div className="flex items-center gap-3 animate-bounce">
                <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center text-white shadow">
                  <Check className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#58CC02]">Nicely done!</h3>
                  <p className="text-xs font-bold text-[#46a302] dark:text-[#58CC02]">
                    +10 XP earned
                  </p>
                </div>
              </div>
            )}

            {(status === "incorrect" || status === "skipped") && (
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow flex-shrink-0 mt-0.5">
                  <X className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#FF4B4B]">Correct solution:</h3>
                  <p className="text-base font-extrabold text-[#ea2b2b] dark:text-[#FF6B6B]">
                    {exercise.answer_data.correct_answer.join(" ")}
                  </p>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="hidden sm:block text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                Select words in the right order and press Check
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full sm:w-auto flex items-center gap-3 justify-end">
            {status === "idle" ? (
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
                <Button
                  variant={selectedChips.length > 0 ? "primary" : "default"}
                  size="lg"
                  disabled={selectedChips.length === 0}
                  className="w-full sm:w-48 font-black tracking-widest"
                  onClick={handleCheck}
                >
                  Check
                </Button>
              </>
            ) : status === "correct" ? (
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
                variant="danger"
                size="lg"
                className="w-full sm:w-48 font-black tracking-widest bg-[#FF4B4B] border-[#ea2b2b]"
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
