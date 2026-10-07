"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { Check, X, Volume2, Heart } from "lucide-react";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { speakGerman } from "@/lib/tts";

export interface OptionItem {
  id: number;
  text: string;
}

export interface MultipleChoiceExerciseData {
  id: number;
  type: string;
  prompt: string;
  question: string;
  answer_data: {
    options: OptionItem[];
    correct_option_id: number;
  };
}

export interface MultipleChoiceExerciseProps {
  exercise: MultipleChoiceExerciseData;
  progressPercent?: number;
  targetProgressPercent?: number;
  isReview?: boolean;
  canSkip?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  onExit?: () => void;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  exercise,
  progressPercent = 20,
  targetProgressPercent = 40,
  isReview = false,
  canSkip = true,
  onComplete,
  onSkip,
  onExit,
}) => {
  const { hearts, decrementHearts, addXp } = useUserStore();

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "skipped">("idle");
  const [progress, setProgress] = useState<number>(progressPercent);

  const correctOption = exercise.answer_data.options.find(
    (opt) => opt.id === exercise.answer_data.correct_option_id
  );

  const handleSelect = (id: number) => {
    if (status !== "idle" || hearts <= 0) return;
    setSelectedOptionId(id);
  };

  const handleCheck = () => {
    if (selectedOptionId === null) return;

    if (selectedOptionId === exercise.answer_data.correct_option_id) {
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
        {/* Exercise Prompt Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4B4B4B] dark:text-white mb-4">
          {isReview && <span className="text-[#1CB0F6]">Give it a try: </span>}
          {exercise.prompt}
        </h1>

        {/* Question Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => speakGerman(exercise.question)}
            className="text-[#1CB0F6] hover:scale-110 active:scale-95 transition-transform cursor-pointer p-1"
            title="Listen pronunciation"
            aria-label="Listen pronunciation"
          >
            <Volume2 className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-xl sm:text-2xl font-bold text-[#4B4B4B] dark:text-white underline decoration-dotted decoration-gray-400 underline-offset-8">
            {exercise.question}
          </span>
        </div>

        {/* Multiple Choice Options List */}
        <div className="flex flex-col gap-3.5 my-auto">
          {exercise.answer_data.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={status !== "idle"}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-lg text-left transition-all duration-100 ease-out active:translate-y-1 active:border-b-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#ddf4ff] dark:bg-[#1A3442] text-[#1cb0f6] border-2 border-[#1CB0F6] border-b-4 border-b-[#1CB0F6]"
                    : "bg-white dark:bg-[#202F36] text-[#4B4B4B] dark:text-[#E5E5E5] border-2 border-[#e5e5e5] dark:border-[#37464F] border-b-4 border-b-[#e5e5e5] dark:border-b-[#263740] hover:bg-gray-50 dark:hover:bg-[#2B3E48]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Number Badge */}
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-colors ${
                      isSelected
                        ? "border-[#1CB0F6] text-[#1CB0F6] bg-white dark:bg-[#131F24]"
                        : "border-[#e5e5e5] dark:border-[#37464F] text-[#afafaf] dark:text-[#8FA2AC] bg-transparent"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-base sm:text-lg">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Validation Footer */}
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
          {/* Banner Message */}
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
                    {correctOption ? correctOption.text : ""}
                  </p>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="hidden sm:block text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                Choose an option and press Check
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
                  variant={selectedOptionId !== null ? "primary" : "default"}
                  size="lg"
                  disabled={selectedOptionId === null}
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
