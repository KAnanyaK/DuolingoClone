"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { Check, X, Volume2, Heart } from "lucide-react";
import { OutOfHeartsModal } from "./OutOfHeartsModal";

export interface TypeAnswerExerciseData {
  id: number;
  type: string;
  prompt: string;
  question: string;
  answer_data: {
    correct_answer: string;
  };
}

export interface TypeAnswerExerciseProps {
  exercise: TypeAnswerExerciseData;
  progressPercent?: number;
  targetProgressPercent?: number;
  isReview?: boolean;
  canSkip?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  onExit?: () => void;
}

export const TypeAnswerExercise: React.FC<TypeAnswerExerciseProps> = ({
  exercise,
  progressPercent = 80,
  targetProgressPercent = 100,
  isReview = false,
  canSkip = true,
  onComplete,
  onSkip,
  onExit,
}) => {
  const { hearts, decrementHearts, addXp } = useUserStore();

  const [inputVal, setInputVal] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "skipped">("idle");
  const [progress, setProgress] = useState<number>(progressPercent);

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCheck = () => {
    if (!inputVal.trim()) return;

    const trimmedInput = inputVal.trim().toLowerCase();
    const trimmedTarget = exercise.answer_data.correct_answer.trim().toLowerCase();
    const isMatch = trimmedInput === trimmedTarget;

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
    } else if (status === "skipped") {
      if (onSkip) onSkip();
      else if (onComplete) onComplete();
    } else if (status === "incorrect") {
      if (onComplete) onComplete();
    }
  };

  const isCheckDisabled = inputVal.trim().length === 0 || hearts <= 0;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] font-nunito select-none transition-colors">
      {/* Out of Hearts Modal if hearts hits 0 */}
      <OutOfHeartsModal isOpen={hearts <= 0} />

      {/* Top Header / Progress Bar */}
      <div className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
        <button
          onClick={onExit}
          className="text-[#afafaf] hover:text-[#4B4B4B] dark:hover:text-white transition-colors p-2 cursor-pointer"
          aria-label="Exit lesson"
        >
          <X size={28} strokeWidth={3} />
        </button>

        <div className="flex-1 h-4 bg-[#e5e5e5] dark:bg-[#2B3E48] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Heart size={26} className="text-[#FF4B4B] fill-[#FF4B4B]" />
          <span className="font-black text-xl text-[#FF4B4B]">{hearts}</span>
        </div>
      </div>

      {/* Main Exercise Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 flex flex-col justify-center py-6">
        {/* Prompt */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#4B4B4B] dark:text-white mb-6">
          {isReview && <span className="text-[#1CB0F6]">Give it a try: </span>}
          {exercise.prompt}
        </h1>

        {/* Question bubble / prompt */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => handleSpeak(exercise.question)}
            className="w-12 h-12 rounded-2xl bg-[#1CB0F6] text-white flex items-center justify-center shadow-[0_4px_0_#1899D6] hover:bg-[#1899D6] active:translate-y-1 active:shadow-none transition-all flex-shrink-0 cursor-pointer"
            aria-label="Listen to prompt"
          >
            <Volume2 size={24} />
          </button>
          <div className="relative border-2 border-[#e5e5e5] dark:border-[#263E4B] rounded-2xl px-5 py-3 text-xl font-bold text-[#4B4B4B] dark:text-white bg-white dark:bg-[#18272E] shadow-sm flex items-center">
            {exercise.question}
          </div>
        </div>

        {/* Input area styled with thick gray border */}
        <div className="w-full">
          <input
            type="text"
            id="type-answer-input"
            value={inputVal}
            onChange={(e) => {
              if (status === "idle") {
                setInputVal(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isCheckDisabled && status === "idle") {
                handleCheck();
              }
            }}
            placeholder="Type your answer in German"
            disabled={status !== "idle" || hearts <= 0}
            className="w-full border-2 border-[#e5e5e5] dark:border-[#263E4B] bg-gray-50 dark:bg-[#18272E] focus:border-[#1CB0F6] focus:bg-white dark:focus:bg-[#202F36] focus:outline-none rounded-2xl p-4 text-xl font-bold text-[#4B4B4B] dark:text-white transition-all"
            autoComplete="off"
            autoFocus
          />
        </div>
      </main>

      {/* Fixed Bottom Footer */}
      <footer
        className={`w-full border-t-2 py-6 px-6 transition-colors duration-200 ${
          status === "idle"
            ? "border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#131F24]"
            : status === "correct"
            ? "border-transparent bg-[#d7ffb8] dark:bg-[#1A3826]"
            : "border-transparent bg-[#ffdfe0] dark:bg-[#3D1E24]"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          {status === "idle" && (
            <>
              <button
                type="button"
                disabled={!canSkip}
                onClick={canSkip ? handleSkip : undefined}
                className={`font-black uppercase text-sm tracking-wider transition-colors ${
                  !canSkip
                    ? "text-gray-300 dark:text-[#3B4D54] cursor-not-allowed opacity-40 select-none"
                    : "text-[#afafaf] dark:text-[#8FA2AC] hover:text-[#777] dark:hover:text-white cursor-pointer"
                }`}
                title={!canSkip ? "Questions cannot be skipped again" : undefined}
              >
                Skip
              </button>
              <Button
                variant="primary"
                size="lg"
                disabled={isCheckDisabled}
                onClick={handleCheck}
                className="w-full sm:w-auto min-w-[150px]"
              >
                Check
              </Button>
            </>
          )}

          {status === "correct" && (
            <>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center text-white font-black shadow-sm">
                  <Check size={28} strokeWidth={4} />
                </div>
                <div>
                  <h2 className="text-[#58CC02] font-black text-2xl tracking-wide">
                    Nicely done!
                  </h2>
                  <p className="text-[#58a700] font-bold text-sm">
                    Answer: {exercise.answer_data.correct_answer}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                className="w-full sm:w-auto min-w-[150px]"
              >
                Continue
              </Button>
            </>
          )}

          {(status === "incorrect" || status === "skipped") && (
            <>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center text-white font-black shadow-sm">
                  <X size={28} strokeWidth={4} />
                </div>
                <div>
                  <h2 className="text-[#FF4B4B] font-black text-2xl tracking-wide">
                    Correct solution:
                  </h2>
                  <p className="text-base font-extrabold text-[#ea2b2b]">
                    {exercise.answer_data.correct_answer}
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                size="lg"
                onClick={handleContinue}
                className="w-full sm:w-auto min-w-[150px]"
              >
                Got it
              </Button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};
