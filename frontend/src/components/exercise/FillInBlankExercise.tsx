"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { Check, X, Volume2, Heart } from "lucide-react";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { speakGerman } from "@/lib/tts";

export interface FillInBlankExerciseData {
  id: number;
  type: string;
  prompt: string;
  sentence: string; // e.g. "Der ___ frisst den Apfel."
  answer_data: {
    word_bank: string[];
    correct_answer: string;
  };
}

export interface FillInBlankExerciseProps {
  exercise: FillInBlankExerciseData;
  progressPercent?: number;
  targetProgressPercent?: number;
  isReview?: boolean;
  canSkip?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  onExit?: () => void;
}

export const FillInBlankExercise: React.FC<FillInBlankExerciseProps> = ({
  exercise,
  progressPercent = 40,
  targetProgressPercent = 60,
  isReview = false,
  canSkip = true,
  onComplete,
  onSkip,
  onExit,
}) => {
  const { hearts, decrementHearts, addXp } = useUserStore();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "skipped">("idle");
  const [progress, setProgress] = useState<number>(progressPercent);

  // Split sentence at the "___" blank marker
  const parts = exercise.sentence.split("___");
  const prefix = parts[0] || "";
  const suffix = parts[1] || "";

  const handleSelectWord = (word: string) => {
    if (status !== "idle" || hearts <= 0) return;
    // Clicking word chip moves it to the blank slot
    setSelectedWord(word);
  };

  const handleUnselectWord = () => {
    if (status !== "idle") return;
    // Clicking the filled slot returns it to the bank
    setSelectedWord(null);
  };

  const handleCheck = () => {
    if (!selectedWord) return;

    const isMatch = selectedWord.trim().toLowerCase() === exercise.answer_data.correct_answer.trim().toLowerCase();

    if (isMatch) {
      setStatus("correct");
      setProgress(targetProgressPercent);
      addXp(10);
    } else {
      setStatus("incorrect");
      decrementHearts();
    }
  };

  const handleSkip = () => {
    if (status !== "idle") return;
    setStatus("skipped");
    setProgress((prev) => Math.min(100, prev + 5));
  };

  const handleContinue = () => {
    if (status === "correct") {
      if (onComplete) onComplete();
      else setStatus("idle");
    } else if (status === "skipped") {
      if (onSkip) onSkip();
      else if (onComplete) onComplete();
    } else if (status === "incorrect") {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] font-nunito select-none transition-colors">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 pt-6 pb-4 flex items-center gap-4 sm:gap-6">
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

        {/* Hearts */}
        <div className="flex items-center gap-1.5 font-black text-[#FF4B4B]">
          <Heart className="w-6 h-6 fill-[#FF4B4B]" />
          <span className="text-lg">{hearts}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4B4B4B] dark:text-white mb-8">
          {isReview && <span className="text-[#1CB0F6]">Give it a try: </span>}
          {exercise.prompt}
        </h1>

        {/* Sentence with Blank Slot */}
        <div className="bg-gray-50 dark:bg-[#18272E] border-2 border-[#e5e5e5] dark:border-[#263E4B] rounded-3xl p-6 sm:p-8 mb-12 flex flex-wrap items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-[#4B4B4B] dark:text-white">
          <button
            type="button"
            onClick={() => {
              const fullSentence = exercise.sentence.replace(
                "___",
                selectedWord || exercise.answer_data.correct_answer
              );
              speakGerman(fullSentence);
            }}
            className="text-[#1CB0F6] hover:scale-110 active:scale-95 transition-transform p-1 mr-2 cursor-pointer"
            title="Listen pronunciation"
            aria-label="Listen pronunciation"
          >
            <Volume2 className="w-6 h-6 stroke-[2.5]" />
          </button>

          <span>{prefix}</span>

          {/* Underlined Blank Slot */}
          {selectedWord ? (
            <button
              onClick={handleUnselectWord}
              disabled={status !== "idle"}
              className="btn-3d bg-white dark:bg-[#202F36] text-[#1CB0F6] font-black text-xl px-4 py-1.5 rounded-2xl border-2 border-[#1CB0F6] border-b-4 border-b-[#1CB0F6] active:translate-y-1 active:border-b-0 cursor-pointer shadow-sm transition-all"
              title="Click to remove from blank"
            >
              {selectedWord}
            </button>
          ) : (
            <div className="min-w-24 h-10 border-b-4 border-[#4B4B4B] dark:border-[#E5E5E5] mx-2 inline-flex items-center justify-center text-sm text-[#afafaf] dark:text-[#8FA2AC] font-extrabold">
              ___
            </div>
          )}

          <span>{suffix}</span>
        </div>

        {/* Word Bank Chips */}
        <div className="flex flex-wrap gap-3 justify-center items-center py-4">
          {exercise.answer_data.word_bank.map((word, idx) => {
            const isUsed = selectedWord === word;

            return isUsed ? (
              <div
                key={idx}
                className="bg-[#e5e5e5] dark:bg-[#202F36] rounded-2xl px-5 py-3 border-2 border-transparent h-12 min-w-20 opacity-50"
              />
            ) : (
              <button
                key={idx}
                onClick={() => handleSelectWord(word)}
                disabled={status !== "idle" || hearts <= 0}
                className="btn-3d bg-white dark:bg-[#202F36] text-[#4B4B4B] dark:text-[#E5E5E5] font-extrabold text-base px-6 py-3 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464F] border-b-4 border-b-[#e5e5e5] dark:border-b-[#263740] hover:bg-gray-50 dark:hover:bg-[#2B3E48] active:translate-y-1 active:border-b-0 cursor-pointer transition-all shadow-sm"
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Footer */}
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
          {/* Banner message */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {status === "correct" && (
              <div className="flex items-center gap-3 animate-bounce">
                <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center text-white shadow">
                  <Check className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#58CC02]">Well done!</h3>
                  <p className="text-xs font-bold text-[#46a302] dark:text-[#58CC02]">+10 XP earned</p>
                </div>
              </div>
            )}

            {(status === "incorrect" || status === "skipped") && (
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow flex-shrink-0 mt-0.5">
                  <X className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#FF4B4B]">Correct answer:</h3>
                  <p className="text-base font-extrabold text-[#ea2b2b] dark:text-[#FF6B6B]">
                    {exercise.answer_data.correct_answer}
                  </p>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="hidden sm:block text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                Select a word chip to fill the blank
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
                  variant={selectedWord !== null ? "primary" : "default"}
                  size="lg"
                  disabled={selectedWord === null}
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
